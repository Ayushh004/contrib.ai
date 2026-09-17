import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import GoogleLoginModal from "./GoogleLoginModal";

function HeroSection() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const NavigateToLinkDrop = ():void=>{
    if (isAuthenticated) {
      navigate("/pastelink");
    } else {
      setIsLoginModalOpen(true);
    }
  }

  const NavigateToDemo = ():void=>{
    navigate("/chatbox/demo");
  }

  return (
    <>
      <div className="border-2 flex flex-col md:flex-row bg-[#0d0f14] justify-center items-center py-12 md:py-24 px-4 min-h-[90vh]">
        {/* leftpart */}
        <div className="pr-0 md:pr-24 space-y-6 w-full md:w-1/2 pt-4 md:pt-0">
          {/* round icon */}
          <span className="font-syne-jetBrains border bg-[#1a2035] text-[#a8ff3e] px-3 py-1 border-[#556070] rounded-2xl text-xs md:text-sm inline-block">discover issues worth solving</span>
          {/* main heading */}
          <div className="pt-[5%] leading-none">
            <span className="font-syne-ExtraBold text-[32px] md:text-[48px] lg:text-[58px] tracking-[-0.03em] text-white block">Open</span>
            <span className="font-syne-ExtraBold text-[32px] md:text-[48px] lg:text-[58px] tracking-[-0.03em] text-white block">source,</span>
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="font-syne-ExtraBold text-[32px] md:text-[48px] lg:text-[58px] tracking-[-0.03em] text-[#a8ff3e]">finally</span>
              <span className="font-syne-ExtraBold text-[32px] md:text-[48px] lg:text-[58px] tracking-[-0.03em] text-white md:ml-4">less</span>
            </div>
            <span className="font-syne-ExtraBold text-[32px] md:text-[48px] lg:text-[58px] tracking-[-0.03em] text-white block">intimidating.</span>
          </div>
          {/* paragraph */}
          <div className="text-[#8895b3] mt-0.5 text-sm md:text-base">
            <p className="">Drop in any GitHub repo. Our AI decodes the</p>
            <p>architecture, surfaces the right issues, and walks</p>
            <p>you through your first PR — step by step.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-start space-y-4 md:space-x-8 md:space-y-0 mt-6">
            <button onClick={NavigateToLinkDrop} className="cursor-pointer hover:bg-lime-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 h-12 text-[16px] md:text-[20px] px-6 pb-2 bg-[#a8ff3e] rounded-[5px] text-center">Start contributing free</button>

            <button onClick={NavigateToDemo} className="bg-[#0d0f14] border border-[#1e2530] text-white rounded-[7px] px-7 hover:border-[#a8ff3e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 text-center">Try Demo</button>
          </div>
        </div>
        {/* RightPart */}
        <div className="rounded-[20px] h-[25vh] md:h-[30vh] bg-[#0a0c10] border border-[#1e2530] w-full md:w-[40%] lg:w-[25%] flex flex-col justify-center mt-8 md:mt-0">
          <div className="ml-4 md:ml-6">
             {/* coloured icons */}
            <div className="flex border space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* paragraph */}
            <div className="text-xs md:text-sm">
              <p className="text-[#e2e8f0]">$ analyzing repo: facebook/react...</p>
              <p className="text-[#7dd3fc]">{">"} 1,247 open issues found</p>
              <p className="text-[#7dd3fc]">{">"} entry points mapped: src/react.js</p>
              <p className="text-[#7dd3fc]">{">"} architecture: Fiber reconciler</p>
              <p className="text-[#7dd3fc]">{">"} good first issues: 23 matches</p>
              <p className="text-[#a8ff3e]">✓ ready to contribute. let's go.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Google Login Modal */}
      <GoogleLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  )
}

export default HeroSection