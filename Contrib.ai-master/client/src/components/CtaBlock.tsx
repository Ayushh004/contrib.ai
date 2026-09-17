import { useNavigate } from "react-router-dom";

function CtaBlock() {
  const navigate = useNavigate();
  

  const NavigateToLinkDrop = ():void=>{
    navigate("/pastelink")
  }
  return (
    <div className="flex justify-center items-center min-h-[60vh] md:min-h-[77vh] bg-[#0d0f14] py-12 px-4">
        <div className="rounded-3xl flex flex-col justify-center items-center gap-5 border border-[#1e3020] min-h-[40vh] md:min-h-[55vh] max-w-[90%] md:max-w-[65%] bg-gradient-to-br from-[#111820] to-[#0f1a14] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,255,62,0.15)] hover:-translate-y-1 p-6 md:p-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-100 md:h-100 rounded-full
  bg-[radial-gradient(circle,rgba(168,255,62,0.09)_0%,transparent_70%)] pointer-events-none" />
            <div className="font-syne-ExtraBold text-white text-[24px] md:text-[40px] max-w-[95%] text-center leading-tight relative z-10">Your first open source PR
is closer than you think.</div>
            <div className="text-[#6e7d9b] text-sm md:text-base text-center relative z-10">Join 12,000+ developers who shipped their first contribution with contrib.ai.</div>
            <button onClick={NavigateToLinkDrop} className="cursor-pointer hover:bg-lime-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 bg-[#a8ff3e] rounded-lg p-3 md:p-2 text-sm md:text-base relative z-10">Start for free — no sign up needed →</button>
        </div>
    </div>
  )
}

export default CtaBlock