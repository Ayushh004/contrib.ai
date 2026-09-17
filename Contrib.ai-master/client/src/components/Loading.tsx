import { useEffect, useState } from "react"
import { socket } from "../socket";
import { useNavigate, useParams } from "react-router-dom";

function Loading() {
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState("Starting...");
    const [step, setStep] = useState(1);
    const [total, setTotal] = useState(8);
    const {jobId} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Loading component - jobId:", jobId);
        console.log("Socket connected:", socket.connected);
        
        if (!socket.connected) {
            socket.connect();
            console.log("Socket connecting...");
        }
        
        socket.emit("join", jobId);
        console.log("Emitted join event for jobId:", jobId);
    
        socket.on("progress", (data) => {
            console.log("Progress received:", data);
            const percent = data.progress;
            setProgress(percent);
            setFile(data.file);
            setStep(data.current);
            setTotal(data.total);
        });

        socket.on("done", () => {
            console.log("Done event received");
            setProgress(100);
            setFile("Completed");
            navigate(`/chatbox/${jobId}`);
        });
        
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
        
        return () => {
            socket.off("progress");
            socket.off("done");
            socket.off("connect");
            socket.off("disconnect");
        };

    }, [jobId, navigate])

    return (
        <div className="bg-[#0d0f14] border border-[#1e2530]  min-h-screen flex flex-col items-center justify-center px-8 py-12 font-mono gap-8">

            {/* Logo */}
            <div className="font-syne font-bold text-[20px] text-[#e8eaf0]">
                contrib<span className="text-[#a8ff3e]">.ai</span>
            </div>

            {/* Center Block */}
            <div className="flex flex-col  items-center gap-5 w-full max-w-105">

                {/* Repo + Dot */}
                <div className="flex items-center gap-2">
                    <div className="w-1.75 h-1.75 rounded-full bg-[#a8ff3e] animate-pulse"></div>
                    <div className="text-[13px] text-sky-300 tracking-wide">
                        facebook/<b className="text-[#e8eaf0] font-medium">react</b>
                    </div>
                </div>

                {/* Step Label */}
                <div className="text-[12px] text-[#8895b3] h-4.5 text-center">
                    Processing: {file}
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                    <div className="w-full h-1 bg-[#11141c] rounded-full overflow-hidden relative">
                        <div className="h-full bg-[#a8ff3e] rounded-full  relative" style={{width:`${progress}%`}}>

                            {/* shimmer */}
                            <div className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.4s_infinite]">

                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between w-full items-center">
                    <div className="font-syne font-extrabold text-[13px] text-[#a8ff3e]">
                        {progress}%
                    </div>
                    <div className="text-[10px] text-[#3a4560]">
                        step {step} of {total}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Loading
