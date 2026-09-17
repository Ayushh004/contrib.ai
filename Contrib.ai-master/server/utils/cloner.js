import { simpleGit } from 'simple-git';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises'; 
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import.meta.url giving the current file's directary path url
// fileURLToPath(import.meta.url) convert the url to actual path
// path.dirname(fileURLToPath(import.meta.url)) give the path till folder excluding the file name.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const git = simpleGit();
console.log("__dirname: ",__dirname);

 export async function cloneRepository(repoUrl,jobId){
        
        // now we get out of the current folder and move to the temp folder.
        const tempBaseDir = path.join(__dirname,'..','temp');
        // and make a folder inside the temp folder which name will be the unique job id.
        // now targetPath is the actual folder path where we will store all files from git url.
        const targetPath = path.join(tempBaseDir, jobId);

        try{
        // if temp folder is already present the it will not make it. otherwise it will make it
           await fs.mkdir(tempBaseDir, { recursive: true });

        console.log(`[${jobId}] Cloning: ${repoUrl}...`);
        // cloning all the files from the repoUrl to the target path which is jobID named folder
        await git.clone(repoUrl, targetPath);
        
        console.log(`[${jobId}] Successfully cloned to: ${targetPath}`);
        return { jobId, targetPath };
        }
        catch(error){
console.error("Cloning failed:", error);
        throw error;
        }
  }