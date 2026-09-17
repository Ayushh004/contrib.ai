import { cloneRepository } from '../utils/cloner.js';
import { exec } from 'node:child_process';
import util from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFiles } from './getFiles.js';
import { getIO } from '../socket.js';
import { jobProgress } from '../utils/jobStore.js';
import fs from 'fs';

// exec is used to run terminal commands but we have to pass the command and the callback function in it which can be little messy and also we can't use async await in it so we promisify it to reduce complexity and to use it in async await style
const execPromise = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// __dirname is giving you the folder path of current file (server->current files folder name). and ROOT_DIR is giving you the folder path of just above parent folder of the current folder(Open_Source)
const ROOT_DIR = path.resolve(__dirname, '../..');

// Process a single file
async function processFile(filePath, index, total, jobId, pythonPath, pythonScriptPath) {
    const fileName = path.basename(filePath);
    try {
        const normalizedPath = path.normalize(filePath);
        process.stdout.write(`[${index + 1}/${total}] Processing: ${fileName}... `);
        
        console.log(`🔍 Executing: ${pythonPath} ${pythonScriptPath} ${normalizedPath} ${jobId}`);
        
        // Handle both absolute paths and simple commands like 'python3'
        const pythonCommand = path.isAbsolute(pythonPath) ? `"${pythonPath}"` : pythonPath;
        const command = `${pythonCommand} "${pythonScriptPath}" "${normalizedPath}" "${jobId}"`;
        
        // Pass environment variables to the child process
        const { stdout, stderr } = await execPromise(command, { 
            timeout: 60000,
            env: { ...process.env } // Inherit all environment variables
        });
        
        console.log(`📤 Python stdout: ${stdout}`);
        console.log(`⚠️ Python stderr: ${stderr}`);
        
        if (stderr) {
            console.log(`\n❌ ERROR in ${fileName}: ${stderr}`);
        }

        let functionsSaved = 0;
        if (stdout && stdout.trim()) {
            const result = JSON.parse(stdout.trim());
            functionsSaved = result.functions_saved;
            console.log(`✅ Saved ${functionsSaved} functions.`);
        }
        
        return { success: true, functionsSaved, fileName, index };
    } catch (fileError) {
        console.log(`❌ Skipped ${fileName} (Error in file)`);
        console.log(`❌ Error details: ${fileError.message}`);
        console.log(`❌ Full error:`, fileError);
        return { success: false, functionsSaved: 0, fileName, index };
    }
}

// Process files in parallel with controlled concurrency
async function processFilesInParallel(codeFiles, jobId, pythonPath, pythonScriptPath, concurrency = 3) {
    let totalFunctionsSaved = 0;
    let completed = 0;
    
    for (let i = 0; i < codeFiles.length; i += concurrency) {
        const batch = codeFiles.slice(i, i + concurrency);
        
        // Process batch in parallel
        const results = await Promise.all(
            batch.map((filePath, batchIndex) => 
                processFile(filePath, i + batchIndex, codeFiles.length, jobId, pythonPath, pythonScriptPath)
            )
        );
        
        // Process results
        for (const result of results) {
            totalFunctionsSaved += result.functionsSaved;
            completed++;
            
            // Update progress
            jobProgress.set(jobId, {
                progress: Math.round((completed / codeFiles.length) * 100),
                current: completed,
                total: codeFiles.length,
                file: result.fileName
            });

            getIO().to(jobId).emit("progress", {
                progress: Math.round((completed / codeFiles.length) * 100),
                current: completed,
                total: codeFiles.length,
                file: result.fileName
            });
        }
        
        // Rate limiting delay between batches (keeps the delay but reduces total time)
        if (i + concurrency < codeFiles.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
    
    return totalFunctionsSaved;
}

export default async function processRepo(url, jobId) {
    try {
        console.log("=== ProcessRepo Function Started ===");
        console.log("URL:", url);
        console.log("Job ID:", jobId);
        
        // Install Python dependencies if needed
        console.log("📦 Setting up Python environment...");
        let useVenv = false;
        let pythonPath = 'python3';
        const isWindows = process.platform === 'win32';
        const requirementsPath = path.join(ROOT_DIR, 'ai_engine', 'requirements.txt');
        
        try {
            // Check if venv exists, if not create it
            const venvPath = path.join(ROOT_DIR, 'ai_engine', '.venv');
            console.log("🔍 Checking venv path:", venvPath);
            console.log("🔍 Venv exists:", fs.existsSync(venvPath));
            
            if (!fs.existsSync(venvPath)) {
                console.log("🔧 Creating virtual environment...");
                try {
                    // Standard venv creation
                    const venvCommand = isWindows 
                        ? `python -m venv "${venvPath}"`
                        : `python3 -m venv "${venvPath}"`;
                    await execPromise(venvCommand, { timeout: 120000, env: { ...process.env } });
                    console.log("✅ Virtual environment created");
                    useVenv = true;
                } catch (venvError) {
                    console.error("⚠️ Failed to create venv, will use system Python:", venvError.message);
                    useVenv = false;
                }
            } else {
                console.log("✅ Virtual environment already exists");
                useVenv = true;
            }
            console.log("🔍 useVenv after venv check:", useVenv);
            
            if (useVenv) {
                // Install dependencies in venv
                const pipPath = isWindows 
                    ? path.join(ROOT_DIR, 'ai_engine', '.venv', 'Scripts', 'pip.exe')
                    : path.join(ROOT_DIR, 'ai_engine', '.venv', 'bin', 'pip');
                
                console.log("🔍 Pip path:", pipPath);
                console.log("🔍 Pip exists:", fs.existsSync(pipPath));
                
                // Check if pip exists in venv
                if (fs.existsSync(pipPath)) {
                    console.log("📦 Installing dependencies in venv...");
                    try {
                        const pipCommand = `"${pipPath}" install -r "${requirementsPath}"`;
                        const { stdout: pipOutput, stderr: pipError } = await execPromise(
                            pipCommand,
                            { timeout: 120000, env: { ...process.env } }
                        );
                        console.log("✅ Dependencies installed:", pipOutput);
                        if (pipError) {
                            console.log("⚠️ Pip stderr:", pipError);
                        }
                    } catch (pipInstallError) {
                        console.error("⚠️ Failed to install dependencies in venv:", pipInstallError.message);
                        console.log("⚠️ Will try to use venv Python anyway, but dependencies may be missing");
                    }
                } else {
                    console.log("⚠️ Pip not found in venv, trying to ensurepip...");
                    try {
                        const venvPython = isWindows 
                            ? path.join(ROOT_DIR, 'ai_engine', '.venv', 'Scripts', 'python.exe')
                            : path.join(ROOT_DIR, 'ai_engine', '.venv', 'bin', 'python');
                        const ensurepipCommand = `"${venvPython}" -m ensurepip --upgrade`;
                        await execPromise(ensurepipCommand, { timeout: 60000, env: { ...process.env } });
                        console.log("✅ Pip installed via ensurepip");
                        
                        // Try installing dependencies again
                        const pipCommand = `"${pipPath}" install -r "${requirementsPath}"`;
                        const { stdout: pipOutput, stderr: pipError } = await execPromise(
                            pipCommand,
                            { timeout: 120000, env: { ...process.env } }
                        );
                        console.log("✅ Dependencies installed:", pipOutput);
                        if (pipError) {
                            console.log("⚠️ Pip stderr:", pipError);
                        }
                    } catch (ensurepipError) {
                        console.error("⚠️ Failed to install pip via ensurepip:", ensurepipError.message);
                        console.log("⚠️ Will try to use venv Python anyway, but dependencies may be missing");
                    }
                }
            }
        } catch (pipError) {
            console.error("❌ Python setup failed, will use system Python:", pipError.message);
            console.error("❌ Full error:", pipError);
            useVenv = false;
        }
        
        const { targetPath } = await cloneRepository(url, jobId);
        console.log("✅ Repository cloned to:", targetPath);
        
        // we know that the  target path is the path till jobid folder and we are fetching all files from it, which are cloned in that folder from git url
        const allFiles = await getFiles(targetPath)
        console.log("📁 Total files found:", allFiles.length);
        
        // extracting the files which have extensions as ['.js', '.py', '.ts', '.jsx']
        const codeFiles = allFiles.filter(file =>
            ['.js', '.py', '.ts', '.jsx', '.tsx'].includes(path.extname(file))
        );
        console.log("💻 Code files found:", codeFiles.length);

        if (codeFiles.length === 0) {
            console.log("❌ No code files found to parse!");
            return;
        }
        console.log(`🚀 Starting Ingestion for ${codeFiles.length} files...`);
        console.log("📂 ROOT_DIR:", ROOT_DIR);
        console.log("📂 AI Engine Dir:", path.join(ROOT_DIR, 'ai_engine'));
        console.log("📂 AI Engine exists:", fs.existsSync(path.join(ROOT_DIR, 'ai_engine')));
        console.log("📂 .venv Dir:", path.join(ROOT_DIR, 'ai_engine', '.venv'));
        console.log("📂 .venv exists:", fs.existsSync(path.join(ROOT_DIR, 'ai_engine', '.venv')));
        console.log("📂 .venv/bin:", path.join(ROOT_DIR, 'ai_engine', '.venv', 'bin'));
        console.log("📂 .venv/bin exists:", fs.existsSync(path.join(ROOT_DIR, 'ai_engine', '.venv', 'bin')));
        
        // --- THE VIRTUAL ENVIRONMENT PATHS ---
        // Use venv if available and working, otherwise fallback to system Python
        const venvPythonPath = isWindows 
            ? path.join(ROOT_DIR, 'ai_engine', '.venv', 'Scripts', 'python.exe')
            : path.join(ROOT_DIR, 'ai_engine', '.venv', 'bin', 'python');
        
        // Use venv Python if venv was successfully set up (even if pip install failed)
        if (useVenv && fs.existsSync(venvPythonPath)) {
            pythonPath = venvPythonPath;
            console.log("🐍 Using venv Python:", pythonPath);
        } else {
            // Fallback to system Python
            pythonPath = isWindows ? 'python' : 'python3';
            console.log("🐍 Using system Python:", pythonPath);
            console.log("⚠️ Make sure dependencies are installed system-wide:");
            console.log("   pip install -r ai_engine/requirements.txt");
        }
        
        console.log("🐍 Platform:", process.platform);
        console.log("🐍 Venv Python path:", venvPythonPath);
        console.log("🐍 Venv Python exists:", fs.existsSync(venvPythonPath));
        console.log("🐍 useVenv flag:", useVenv);
        //pythonScriptPath is a path to processor.py 
        const pythonScriptPath = path.join(ROOT_DIR, 'ai_engine', 'processor.py');
        console.log("📜 Processor script path:", pythonScriptPath);
        console.log("📜 Processor script exists:", fs.existsSync(pythonScriptPath));
        
        // Process files in parallel with controlled concurrency (3 files at a time)
        const totalFunctionsSaved = await processFilesInParallel(
            codeFiles, 
            jobId, 
            pythonPath, 
            pythonScriptPath,
            3 // Process 3 files concurrently
        );
        
        jobProgress.set(jobId, {
            progress: 100,
            current: codeFiles.length,
            total: codeFiles.length,
            file: "Completed 🎉"
        });
        getIO().to(jobId).emit("done", {
            totalFunctionsSaved
        });
        console.log(`\n--- INGESTION COMPLETE ---`);
        console.log(`Total Files Processed: ${codeFiles.length}`);
        console.log(`Total Functions in Vector DB: ${totalFunctionsSaved}`);
        console.log(`Repo ID for Search: ${jobId}`);
        return 1;

    } catch (err) {
        console.error("❌ Critical System Error:", err.message);
        console.error("Full error:", err);
    }
}

