import { useState } from "react";
import { Clock, MessageSquare, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Dummy data for conversation history
const dummyHistory = [
  {
    id: "1",
    title: "Understanding React Architecture",
    repoName: "facebook/react",
    lastMessage: "The architecture consists of reconciler, renderer, and scheduler...",
    timestamp: "2 hours ago",
    messageCount: 12,
    category: "architecture"
  },
  {
    id: "2", 
    title: "Setup and Installation Guide",
    repoName: "vercel/next.js",
    lastMessage: "You can install Next.js using npm create next-app or yarn...",
    timestamp: "5 hours ago",
    messageCount: 8,
    category: "setup"
  },
  {
    id: "3",
    title: "Good First Issues for Beginners",
    repoName: "tailwindlabs/tailwindcss",
    lastMessage: "Here are some good first issues: #1234, #5678, #9012...",
    timestamp: "1 day ago",
    messageCount: 15,
    category: "issues"
  },
  {
    id: "4",
    title: "Component Lifecycle Questions",
    repoName: "facebook/react",
    lastMessage: "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount...",
    timestamp: "2 days ago",
    messageCount: 20,
    category: "architecture"
  },
  {
    id: "5",
    title: "Testing Strategy Discussion",
    repoName: "jestjs/jest",
    lastMessage: "Jest uses a snapshot testing approach for component testing...",
    timestamp: "3 days ago",
    messageCount: 7,
    category: "testing"
  },
  {
    id: "6",
    title: "API Integration Help",
    repoName: "axios/axios",
    lastMessage: "For interceptors, you can use axios.interceptors.request.use()...",
    timestamp: "1 week ago",
    messageCount: 11,
    category: "integration"
  }
];

const categories = [
  { id: "all", label: "All" },
  { id: "architecture", label: "Architecture" },
  { id: "setup", label: "Setup" },
  { id: "issues", label: "Issues" },
  { id: "testing", label: "Testing" },
  { id: "integration", label: "Integration" }
];

function HistoryPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [history, setHistory] = useState(dummyHistory);
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      architecture: "bg-[#3b82f6]",
      setup: "bg-[#10b981]", 
      issues: "bg-[#f59e0b]",
      testing: "bg-[#8b5cf6]",
      integration: "bg-[#ec4899]"
    };
    return colors[category] || "bg-[#6b7280]";
  };

  if (!isExpanded) {
    return (
      <aside className="flex flex-col border-r border-[#1E2530] bg-[#0d0f14] w-12 hover:w-48 transition-all duration-300 group">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center p-3 text-[#a8ff3e] hover:bg-[#1e2530]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <Clock className="w-6 h-6 text-[#6b7788] group-hover:text-[#a8ff3e]" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col border-r border-[#1E2530] bg-[#0d0f14] w-80 transition-all duration-300">
      {/* Header */}
      <div className="border-b border-[#1E2530] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a8ff3e]" />
            <div className="font-syne-Bold text-[13px] text-white">History</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[12px] text-[#6b7788]">{filteredHistory.length} chats</div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-[#1e2530] rounded text-[#6b7788] hover:text-[#a8ff3e]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-[#1E2530] px-4 py-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7788]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[5px] border border-[#1E2530] bg-[#11141C] pl-7 pr-3 py-1.5 text-[12px] text-white placeholder-[#6b7788] focus:border-[#a8ff3e] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-[#1E2530] px-4 py-3">
        <div className="mb-2 text-[10px] uppercase text-[#6b7788]">Filter</div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-[4px] border px-2 py-0.5 text-[10px] transition ${selectedCategory === category.id
                ? "border-[#4c5f92] bg-[#1a2035] text-white"
                : "border-[#1E2530] bg-[#11141C] text-[#828FAC] hover:border-[#2a3048] hover:text-white"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[#6b7788]">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-[11px]">No conversations found</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="group rounded-[6px] border border-[#1E2530] bg-[#11141C] p-2.5 hover:border-[#2a3048] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-white font-semibold text-[11px] font-syne-Bold truncate">
                      {item.title}
                    </h3>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] text-white flex-shrink-0 ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-[#7a8299] mb-1.5">
                    <span className="text-[#a8ff3e] truncate">{item.repoName}</span>
                  </div>
                  
                  <p className="text-[10px] text-[#6b7788] line-clamp-2">
                    {item.lastMessage}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1e2530] rounded flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3 text-[#6b7788] hover:text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-[#1E2530] bg-[#11141C] px-4 py-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex gap-3 text-[#6b7788]">
            <div>
              <span className="text-white font-semibold">{history.length}</span> chats
            </div>
            <div>
              <span className="text-white font-semibold">{history.reduce((acc, item) => acc + item.messageCount, 0)}</span> msgs
            </div>
          </div>
          <div className="text-[#6b7788]">
            Local
          </div>
        </div>
      </div>
    </aside>
  );
}

export default HistoryPanel;