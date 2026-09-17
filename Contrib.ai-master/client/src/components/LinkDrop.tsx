import { useState } from "react"
import API from "../../axiosSetup/API.tsx"
import { useNavigate } from "react-router-dom"
function LinkDrop() {

  const [url_link, seturl_link] = useState("")
  const navigate = useNavigate();
  const analyzeUrl = async () => {
    const res = await API.post("/num", { "link": url_link})
    const jobId = res.data.jobId;
    const existing = res.data.existing;

    if (existing) {
      // If repo already exists, go directly to chatbot
      navigate(`/chat/${jobId}`);
    } else {
      // If new repo, go to loading page
      navigate(`/loading/${jobId}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="absolute top-8 text-sm font-semibold tracking-wide">
        contrib<span className="text-lime-400">.ai</span>
      </div>

      {/* Main Heading */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Drop in a repo.
        </h1>

        <h2 className="text-4xl md:text-6xl font-bold text-lime-400 mt-2">
          We'll handle the rest.
        </h2>

        <p className="text-gray-400 mt-4 text-sm md:text-base">
          Paste any public GitHub repo link to start exploring.
        </p>
      </div>

      {/* Input Section */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="flex items-center bg-[#111820] border border-gray-700 rounded-xl overflow-hidden">

          {/* Input */}
          <input
            type="text"
            value={url_link}
            onChange={(e) => { seturl_link(e.target.value) }}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-gray-300"
          />

          {/* Button */}
          <button onClick={analyzeUrl} className="bg-lime-400 text-black px-6 py-3 font-medium cursor-pointer hover:bg-lime-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105">
            Analyze →
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-gray-500">Try:</span>

        <button className="px-3 py-1 rounded-md bg-[#111820] border border-gray-700 text-gray-300 hover:border-lime-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105">
          facebook/react
        </button>

        <button className="px-3 py-1 rounded-md bg-[#111820] border border-gray-700 text-gray-300 hover:border-lime-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105">
          vercel/next.js
        </button>

        <button className="px-3 py-1 rounded-md bg-[#111820] border border-gray-700 text-gray-300 hover:border-lime-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105">
          microsoft/vscode
        </button>

        <button className="px-3 py-1 rounded-md bg-[#111820] border border-gray-700 text-gray-300 hover:border-lime-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105">
          torvalds/linux
        </button>
      </div>

    </div>
  )
}

export default LinkDrop