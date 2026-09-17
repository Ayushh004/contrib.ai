import { useState, useEffect } from "react";
import LogoIcon from "./LogoIcon";
import SendIcon from "./SendIcon";
import DemoIssuePanel from "./DemoIssuePanel";
import DemoRepoConversationSidebar from "./DemoRepoConversationSidebar";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Menu, X } from "lucide-react";

type Sender = "user" | "bot";
type Message = {
  sender: Sender;
  text: string;
  createdAt?: Date;
};

function DemoChatBox() {
  const [querry, updatequerry] = useState("");
  const [messages, setMessage] = useState<Message[]>([
    { 
      sender: "bot", 
      text: "Welcome to the demo! I'm analyzing the facebook/react repository. This is a preview of how contrib.ai helps you understand and contribute to open source projects." 
    },
    { 
      sender: "user", 
      text: "What are good first issues for beginners?" 
    },
    { 
      sender: "bot", 
      text: "I found 23 good first issues in facebook/react. Here are the top 3:\n\n1. **Issue #28304** - Fix hydration mismatch in strict mode\n   - Difficulty: Easy\n   - Files involved: `src/react/ReactFiberWorkLoop.js`\n\n2. **Issue #28491** - Update documentation for useCallback\n   - Difficulty: Easy\n   - Files involved: `docs/hooks-reference.md`\n\n3. **Issue #28502** - Add TypeScript types for new API\n   - Difficulty: Medium\n   - Files involved: `types/react/index.d.ts`\n\nWould you like me to explain any of these issues in detail?" 
    }
  ]);
  const [showRepoSidebar, setShowRepoSidebar] = useState(false);
  const [showIssuePanel, setShowIssuePanel] = useState(false);
  const navigate = useNavigate();

  // Handle custom event to close repo sidebar
  useEffect(() => {
    const handleCloseRepoSidebar = () => {
      setShowRepoSidebar(false);
    };

    const handleCloseIssuePanel = () => {
      setShowIssuePanel(false);
    };

    window.addEventListener('closeRepoSidebar', handleCloseRepoSidebar);
    window.addEventListener('closeIssuePanel', handleCloseIssuePanel);
    return () => {
      window.removeEventListener('closeRepoSidebar', handleCloseRepoSidebar);
      window.removeEventListener('closeIssuePanel', handleCloseIssuePanel);
    };
  }, []);

  const sendQuerry = () => {
    const demoResponse: Message = { 
      sender: "bot", 
      text: "This is a demo mode. To interact with the AI chatbox with real repositories, please sign up and add your own repository!" 
    };
    setMessage((prev) => [...prev, demoResponse]);
    updatequerry("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuerry();
    }
  };

  const navigateToLandingPage = () => {
    navigate("/");
  };

  const formatMessage = (text: string) => {
    if (!text) return '';

    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-[#0a0c10] border border-[#1e2530] rounded-lg p-3 my-2 overflow-x-auto text-[#a8ff3e] font-mono text-xs">$1</pre>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-[#1a2035] text-[#a8ff3e] px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="text-gray-300">$1</em>');
    formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-3 mb-1">$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-3 mb-1">$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-3 mb-1">$1</h1>');
    formatted = formatted.replace(/^- (.+)$/gm, '<li class="text-gray-300 ml-4 my-1">• $1</li>');
    formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="text-gray-300 ml-4 my-1">$1</li>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#a8ff3e] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  };

  return (
    <div className="min-h-screen border border-[#1E2530] bg-[#0d0f14]">
      <style>{`
        .formatted-message pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .formatted-message code {
          white-space: pre-wrap;
        }
        .formatted-message h1,
        .formatted-message h2,
        .formatted-message h3 {
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .formatted-message p {
          margin-bottom: 0.5rem;
        }
        .formatted-message ul,
        .formatted-message ol {
          margin-left: 1rem;
          margin-bottom: 0.5rem;
        }
        .formatted-message li {
          margin-bottom: 0.25rem;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[auto_minmax(0,1fr)_360px]">
        {/* Mobile Repo Sidebar Toggle */}
        <div className="xl:hidden fixed top-20 left-4 z-50">
          <button
            onClick={() => setShowRepoSidebar(!showRepoSidebar)}
            className="bg-[#11141C] border border-[#1E2530] p-2 rounded-lg text-[#a8ff3e] hover:bg-[#1a2035] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)]"
          >
            {showRepoSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Issue Panel Toggle */}
        <div className="xl:hidden fixed top-20 right-4 z-50">
          <button
            onClick={() => setShowIssuePanel(!showIssuePanel)}
            className="bg-[#11141C] border border-[#1E2530] p-2 rounded-lg text-[#a8ff3e] hover:bg-[#1a2035] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)]"
          >
            {showIssuePanel ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Repo Sidebar */}
        <div className={`${showRepoSidebar ? 'fixed inset-0 z-40' : 'hidden'} xl:static xl:block xl:z-auto`}>
          <DemoRepoConversationSidebar />
        </div>

        {/* Main Chat Section */}
        <section className="flex min-h-screen flex-col border-r border-[#1E2530]">
          {/* contrib.ai assistant */}
          <div className="border border-[#1E2530] flex items-center justify-between px-4 py-3">
            <div className="flex gap-3.5 items-center">
              <LogoIcon />
              <div className="text-white">
                <div className="font-syne-Bold text-[13px] md:text-[15px]">contrib.ai assistant</div>
                <div className="text-[12px] text-[#6b7788]">Demo Mode</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#1e2530] text-[#8895b3] px-2 py-0.5 rounded text-[9px] font-medium tracking-wide">
                <div className="w-1 h-1 bg-[#a8ff3e] rounded-full"></div>
                <span>DEMO</span>
              </div>
              <button onClick={navigateToLandingPage} className="rounded bg-lime-400 text-black h-8 font-medium cursor-pointer hover:bg-lime-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 px-3 md:px-4 text-[13px] md:text-[15px]">
                ← Home
              </button>
            </div>
          </div>

          {/* where do i start */}
          <div className="flex gap-3 overflow-x-auto border border-[#1E2530] p-2 text-[11px] text-white scrollbar-hide">
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 md:px-3 text-[#828FAC] transition-all duration-300 hover:border-[#a8ff3e] hover:text-[#a8ff3e] cursor-pointer">Where do I start?</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 md:px-3 text-[#828FAC] transition-all duration-300 hover:border-[#a8ff3e] hover:text-[#a8ff3e] cursor-pointer">Explain the architecture</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 md:px-3 text-[#828FAC] transition-all duration-300 hover:border-[#a8ff3e] hover:text-[#a8ff3e] cursor-pointer">Find a good first issue</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 md:px-3 text-[#828FAC] transition-all duration-300 hover:border-[#a8ff3e] hover:text-[#a8ff3e] cursor-pointer">How do I run this locally?</div>
          </div>

          {/* chat app */}
          <div className="flex min-h-[50vh] md:min-h-[60vh] flex-1 flex-col gap-2 overflow-y-auto p-3.5 py-auto">
            {messages.map((msg: Message, i: number) => (
              <div
                key={i}
                className={`max-w-[90%] md:max-w-[80%] rounded-lg px-3 md:px-4 py-2 md:py-3 text-[12px] md:text-[14px] transition-all duration-300 hover:scale-102 hover:shadow-[0_0_10px_rgba(168,255,62,0.2)] ${msg.sender === "user" ? "ml-auto border border-[#1e2530] bg-[#11141c]" : "border-2 border-[#2a3048] bg-[#1a2035]"
                  }`}
              >
                <div className="text-gray-300 leading-relaxed formatted-message" dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
              </div>
            ))}
          </div>

          {/* input box */}
          <div className="flex h-[12vh] md:h-[10vh] items-center justify-around px-4">
            <input
              type="text"
              onKeyDown={handleKeyDown}
              value={querry}
              onChange={(e) => { updatequerry(e.target.value) }}
              placeholder="Demo mode - Sign up to interact with real repos!"
              disabled
              className="h-[65%] min-w-[85%] md:min-w-[95%] rounded-2xl border-2 border-[#1E2530] pl-3 text-white transition-all duration-300 focus:border-[#a8ff3e] focus:shadow-[0_0_10px_rgba(168,255,62,0.3)] opacity-50 cursor-not-allowed text-sm md:text-base"
            />

            <button 
              onClick={sendQuerry} 
              disabled
              className="cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-110 opacity-50 cursor-not-allowed"
            >
              <SendIcon />
            </button>
          </div>
        </section>

        {/* Issue Panel */}
        <div className={`${showIssuePanel ? 'fixed inset-0 z-40' : 'hidden'} xl:static xl:block xl:z-auto`}>
          <DemoIssuePanel />
        </div>
      </div>
    </div>
  );
}

export default DemoChatBox;