
function StatsBar() {
  return (
    <div className="bg-[#0d0f14] border border-[#1a1f2e] py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 min-h-[20vh] md:min-h-[25vh] place-items-center max-w-5xl mx-auto items-center justify-center px-4">
         <div className="border-r border-b md:border-b-0 border-[#1a1f2e] flex flex-col w-full transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
            <div className="text-center text-white text-[24px] md:text-[34px] font-syne-ExtraBold transition-all duration-300 hover:scale-105 hover:text-[#a8ff3e]">12k+</div>
            <div className="text-center text-[#556070] text-[12px] md:text-[14px]">contributors onboarded</div>
         </div>
         <div className="border-l border-b md:border-b-0 md:border-x border-[#1a1f2e] flex flex-col w-full transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
            <div className="text-center text-white text-[24px] md:text-[34px] font-syne-ExtraBold transition-all duration-300 hover:scale-105 hover:text-[#a8ff3e]">340k+</div>
            <div className="text-center text-[#556070] text-[12px] md:text-[14px]">repos analyzed</div>
         </div>
         <div className="border-l border-b md:border-b-0 md:border-x border-[#1a1f2e] flex flex-col w-full transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
            <div className="text-center text-white text-[24px] md:text-[34px] font-syne-ExtraBold transition-all duration-300 hover:scale-105 hover:text-[#a8ff3e]">89%</div>
            <div className="text-center text-[#556070] text-[12px] md:text-[14px]">first PR success rate</div>
         </div>
         <div className="border-l border-[#1a1f2e] flex flex-col w-full transition-all duration-300 hover:bg-[#11141c] hover:-translate-y-1 cursor-pointer p-4">
            <div className="text-center text-white text-[24px] md:text-[34px] font-syne-ExtraBold transition-all duration-300 hover:scale-105 hover:text-[#a8ff3e]">{"<"}60s</div>
            <div className="text-center text-[#556070] text-[12px] md:text-[14px]">to first insight</div>
         </div>
    </div>
    </div>

  )
}

export default StatsBar