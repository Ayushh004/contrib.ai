function HowItWorks() {
  return (
    <div id="how-it-works" className="flex flex-col justify-center items-center min-h-[70vh] md:min-h-[80vh] gap-8 bg-[#0a0c10] py-12 px-4">
        {/* 1st */}
        <div className="bg-[#11141c] border border-[#556070] rounded-2xl px-3 text-[12px] text-[#a8ff3e]">how it works</div>
        {/* 2nd */}
        <div className="text-center font-syne-ExtraBold text-[28px] md:text-[40px] max-w-[90%] md:max-w-[70%] text-white leading-tight">From zero to merged in four steps.</div>
        {/* 3rd */}
       
          <div className="grid grid-cols-1 md:grid-cols-4 min-w-[90%] md:min-w-[70%] gap-4 md:gap-0">
            <div className="border-r border-b md:border-b-0 border-[#1a1f2e] min-h-32 md:min-h-35 pl-4 transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
                <div className="text-[#a8ff3e] text-[11px] transition-all duration-300 hover:scale-105">01</div>
                <div className="font-syne-ExtraBold text-[15px] md:text-[17px] text-white">Paste a GitHub URL</div>
                <div className="text-[#556070] text-sm md:text-base">Any public repo, any language.</div>
            </div>
            <div className="border-l border-b md:border-b-0 md:border-x border-[#1a1f2e] pl-4 transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
                <div className="text-[#a8ff3e] text-[11px] transition-all duration-300 hover:scale-105">02</div>
                <div className="font-syne-ExtraBold text-[15px] md:text-[17px] text-white">AI maps the terrain</div>
                <div className="text-[#556070] text-sm md:text-base">Any public repo, any language.</div>
            </div>
            <div className="border-l border-b md:border-b-0 md:border-x border-[#1a1f2e] pl-4 transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
                <div className="text-[#a8ff3e] text-[11px] transition-all duration-300 hover:scale-105">03</div>
                <div className="font-syne-ExtraBold text-[15px] md:text-[17px] text-white">Pick your issue</div>
                <div className="text-[#556070] text-sm md:text-base">Any public repo, any language.</div>
            </div>
            <div className="border-l border-[#1a1f2e] pl-4 transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
                <div className="text-[#a8ff3e] text-[11px] transition-all duration-300 hover:scale-105">04</div>
                <div className="font-syne-ExtraBold text-[15px] md:text-[17px] text-white">Ship your PR</div>
                <div className="text-[#556070] text-sm md:text-base">Any public repo, any language.</div>
            </div>
        </div>
    </div>
  )
}

export default HowItWorks