
function FeatureSection() {
    return (
        <div id="features" className="flex flex-col justify-center items-center bg-[#0d0f14] min-h-[120vh] md:min-h-[140vh] py-12 px-4">
           <div className="flex flex-col items-center gap-8 md:gap-11 max-w-6xl mx-auto">
            {/* 1st part */}
            <div className="flex flex-col gap-3 max-w-[90%] md:max-w-[70%] text-center">
                <div className="rounded-2xl border border-[#556070] w-24 mx-auto text-center text-[12px] text-[#a8ff3e] bg-[#1a2035]">features</div>
                <div className="font-syne-ExtraBold text-[28px] md:text-[40px] text-white leading-tight">Everything you need to ship your first PR.
                </div>
                <div className="text-[#8895b3] text-sm md:text-base">No more staring at a codebase wondering where to start.</div>
            </div>
            {/* grid part */}
            <div className="flex items-center justify-center w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center max-w-[90%] md:max-w-[70%]">
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-4 md:gap-5 border border-[#1e2530] min-h-48 md:min-h-52 p-4 md:pl-4 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_15px_rgba(168,255,62,0.2)] hover:-translate-y-0.5 hover:scale-101 cursor-pointer">
                        <div className="rounded-[9px] bg-[#a8ff3e] w-10 h-10 transition-all duration-300 hover:scale-103 hover:shadow-[0_0_8px_rgba(168,255,62,0.3)]"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px] md:text-[17px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b] text-sm md:text-base">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-4 md:gap-5 border border-[#1e2530] min-h-48 md:min-h-52 p-4 md:pl-4 transition-all duration-300 hover:border-[#7dd3fc] hover:shadow-[0_0_15px_rgba(125,211,252,0.2)] hover:-translate-y-0.5 hover:scale-101 cursor-pointer">
                        <div className="rounded-[9px] bg-[#7dd3fc] w-10 h-10 transition-all duration-300 hover:scale-103 hover:shadow-[0_0_8px_rgba(125,211,252,0.3)]"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px] md:text-[17px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b] text-sm md:text-base">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-4 md:gap-5 border border-[#1e2530] min-h-48 md:min-h-52 p-4 md:pl-4 transition-all duration-300 hover:border-[#f9a8d4] hover:shadow-[0_0_15px_rgba(249,168,212,0.2)] hover:-translate-y-0.5 hover:scale-101 cursor-pointer">
                        <div className="rounded-[9px] bg-[#f9a8d4] w-10 h-10 transition-all duration-300 hover:scale-103 hover:shadow-[0_0_8px_rgba(249,168,212,0.3)]"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px] md:text-[17px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b] text-sm md:text-base">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-4 md:gap-5 border border-[#1e2530] min-h-48 md:min-h-52 p-4 md:pl-4 transition-all duration-300 hover:border-[#fbbf24] hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:-translate-y-0.5 hover:scale-101 cursor-pointer">
                        <div className="rounded-[9px] bg-[#fbbf24] w-10 h-10 transition-all duration-300 hover:scale-103 hover:shadow-[0_0_8px_rgba(251,191,36,0.3)]"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px] md:text-[17px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b] text-sm md:text-base">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
       
    )
}

export default FeatureSection