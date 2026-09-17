
function Footer() {
    return (
        <div className="flex items-center justify-center bg-[#0d0f14] py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#1a1f2e] min-h-[10vh] md:min-h-[12vh] min-w-[90%] md:min-w-[65%] pt-6">
                <div className="text-white flex transition-all duration-300 hover:scale-105 cursor-pointer">
                    <h1 className="text-lg md:text-xl">contrib</h1>
                    <h1 className="text-[#a8ff3e] text-lg md:text-xl">.ai</h1>
                </div>
                <div className="text-[#6e7d9b] text-[11px] md:text-[13px] text-center md:text-right transition-all duration-300 hover:text-[#a8ff3e] cursor-pointer">Built for developers who want to give back.</div>
            </div>
        </div>

    )
}

export default Footer