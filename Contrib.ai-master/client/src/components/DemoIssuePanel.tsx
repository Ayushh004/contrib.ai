import { X } from "lucide-react";

function DemoIssuePanel() {
  const demoIssues = [
    {
      id: 1,
      title: "Fix hydration mismatch in strict mode",
      author: "facebook/react",
      labels: ["good first issue", "bug"],
      difficulty: "Easy",
      files: ["src/react/ReactFiberWorkLoop.js"]
    },
    {
      id: 2,
      title: "Update documentation for useCallback",
      author: "facebook/react",
      labels: ["documentation", "good first issue"],
      difficulty: "Easy",
      files: ["docs/hooks-reference.md"]
    },
    {
      id: 3,
      title: "Add TypeScript types for new API",
      author: "facebook/react",
      labels: ["typescript", "enhancement"],
      difficulty: "Medium",
      files: ["types/react/index.d.ts"]
    },
    {
      id: 4,
      title: "Improve error messages for hook dependencies",
      author: "facebook/react",
      labels: ["good first issue", "developer experience"],
      difficulty: "Medium",
      files: ["src/react/ReactHooks.js"]
    },
    {
      id: 5,
      title: "Optimize reconciliation algorithm",
      author: "facebook/react",
      labels: ["performance", "enhancement"],
      difficulty: "Hard",
      files: ["src/react/ReactFiber.js"]
    }
  ];

  const getLabelColor = (label: string) => {
    if (label.includes("good first issue")) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (label.includes("bug")) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (label.includes("documentation")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (label.includes("typescript")) return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    if (label.includes("performance")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (label.includes("enhancement")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "text-green-400";
    if (difficulty === "Medium") return "text-yellow-400";
    if (difficulty === "Hard") return "text-red-400";
    return "text-gray-400";
  };

  const closeSidebar = () => {
    const event = new CustomEvent('closeIssuePanel');
    window.dispatchEvent(event);
  };

  return (
    <aside className="flex flex-col border-l border-[#1E2530] bg-[#0d0f14] w-full md:w-80 h-full">
      {/* Header */}
      <div className="border-b border-[#1E2530] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#a8ff3e] rounded-sm" />
          <div className="font-syne-Bold text-[13px] md:text-[15px] text-white">Demo Issues</div>
        </div>
        <button
          onClick={closeSidebar}
          className="md:hidden text-[#6b7788] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="border-b border-[#1E2530] bg-[#11141C] px-4 py-2">
        <div className="flex items-center justify-between text-[10px] md:text-[11px]">
          <div className="flex gap-3 text-[#6b7788]">
            <div>
              <span className="text-white font-semibold">{demoIssues.length}</span> issues
            </div>
            <div>
              <span className="text-white font-semibold">3</span> good first issues
            </div>
          </div>
          <div className="text-[#6b7788]">
            Demo
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {demoIssues.map((issue) => (
          <div key={issue.id} className="border border-[#1E2530] rounded-lg bg-[#11141C] p-3 hover:border-[#a8ff3e] transition-all duration-300 hover:shadow-[0_0_10px_rgba(168,255,62,0.2)]">
            {/* Issue Title */}
            <div className="text-white text-[11px] md:text-[12px] font-semibold mb-2 hover:text-[#a8ff3e] transition-colors cursor-pointer">
              {issue.title}
            </div>

            {/* Labels */}
            <div className="flex flex-wrap gap-1 mb-2">
              {issue.labels.map((label, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[8px] md:text-[9px] border ${getLabelColor(label)}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-[9px] md:text-[10px] text-[#6b7788]">
              <div className="flex items-center gap-2">
                <span className="text-[8px] md:text-[9px]">{issue.author}</span>
                <span>•</span>
                <span className={getDifficultyColor(issue.difficulty)}>
                  {issue.difficulty}
                </span>
              </div>
            </div>

            {/* Files */}
            <div className="mt-2 text-[9px] md:text-[10px] text-[#6b7788]">
              <div className="font-medium mb-1">Files:</div>
              {issue.files.map((file, idx) => (
                <div key={idx} className="text-[#a8ff3e] font-mono text-[8px] md:text-[9px] break-all">
                  {file}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default DemoIssuePanel;