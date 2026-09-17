import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Docs() {
  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <Navbar />
      
      {/* Docs Header */}
      <div className="flex flex-col items-center justify-center py-24 px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          <span className="text-[#a8ff3e]">Documentation</span>
        </h1>
        <p className="text-[#8895b3] text-lg max-w-2xl text-center mb-8">
          Everything you need to know about using contrib.ai
        </p>
      </div>

      {/* Docs Content */}
      <div className="max-w-4xl mx-auto px-8 pb-24">
        <div className="space-y-12">
          {/* Getting Started */}
          <div className="border border-[#1e2530] bg-[#11141c] rounded-lg p-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4 text-[#8895b3]">
              <p>
                Welcome to contrib.ai! This platform helps you understand and contribute to open source projects with the help of AI.
              </p>
              <h3 className="text-white text-lg font-semibold mt-6">Step 1: Sign Up</h3>
              <p>
                Create an account using your email or Google authentication to get started.
              </p>
              <h3 className="text-white text-lg font-semibold mt-6">Step 2: Add a Repository</h3>
              <p>
                Paste any public GitHub repository URL to begin analyzing the codebase.
              </p>
              <h3 className="text-white text-lg font-semibold mt-6">Step 3: Start Chatting</h3>
              <p>
                Ask questions about the codebase, find issues, and get guidance on contributing.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="border border-[#1e2530] bg-[#11141c] rounded-lg p-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Features</h2>
            <div className="space-y-4 text-[#8895b3]">
              <h3 className="text-white text-lg font-semibold">AI-Powered Analysis</h3>
              <p>
                Our AI analyzes entire codebases to understand architecture, dependencies, and patterns.
              </p>
              <h3 className="text-white text-lg font-semibold mt-4">Interactive Chat</h3>
              <p>
                Ask questions in natural language and get instant, context-aware answers.
              </p>
              <h3 className="text-white text-lg font-semibold mt-4">Issue Discovery</h3>
              <p>
                Find "good first issues" and beginner-friendly tasks tailored to your skill level.
              </p>
              <h3 className="text-white text-lg font-semibold mt-4">Multi-Repository Support</h3>
              <p>
                Manage and explore multiple repositories simultaneously.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="border border-[#1e2530] bg-[#11141c] rounded-lg p-8">
            <h2 className="text-white text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4 text-[#8895b3]">
              <div className="flex items-start gap-4">
                <div className="text-[#a8ff3e] font-bold">01</div>
                <div>
                  <h3 className="text-white font-semibold">Paste a GitHub URL</h3>
                  <p>Any public repo, any language.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#a8ff3e] font-bold">02</div>
                <div>
                  <h3 className="text-white font-semibold">AI maps the terrain</h3>
                  <p>Our AI analyzes the codebase structure and dependencies.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#a8ff3e] font-bold">03</div>
                <div>
                  <h3 className="text-white font-semibold">Pick your issue</h3>
                  <p>Choose from curated issues that match your skill level.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#a8ff3e] font-bold">04</div>
                <div>
                  <h3 className="text-white font-semibold">Ship your PR</h3>
                  <p>Get guidance and submit your first pull request.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="border border-[#1e2530] bg-[#11141c] rounded-lg p-8">
            <h2 className="text-white text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-6 text-[#8895b3]">
              <div>
                <h3 className="text-white font-semibold mb-2">Is contrib.ai free to use?</h3>
                <p>Yes, contrib.ai is currently free for all users.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">What repositories can I analyze?</h3>
                <p>You can analyze any public GitHub repository.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">How does the AI understand code?</h3>
                <p>Our AI uses advanced language models and vector search to understand code structure, patterns, and context.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Can I use contrib.ai for private repositories?</h3>
                <p>Currently, we only support public repositories. Private repository support is coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Docs;