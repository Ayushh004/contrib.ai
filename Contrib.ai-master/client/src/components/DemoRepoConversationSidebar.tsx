import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, FolderOpen, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  _id: string;
  title: string;
  messages: Array<{ sender: string; text: string; createdAt: string }>;
  createdAt: string;
}

interface Repo {
  _id: string;
  jobId: string;
  repoLink: string;
  conversations: Conversation[];
}

function DemoRepoConversationSidebar() {
  const [repos, setRepos] = useState<Repo[]>([
    {
      _id: "demo-repo-1",
      jobId: "demo-job-1",
      repoLink: "https://github.com/facebook/react",
      conversations: [
        {
          _id: "demo-conv-1",
          title: "React Architecture Deep Dive",
          messages: [
            { sender: "user", text: "Explain React's architecture", createdAt: new Date().toISOString() },
            { sender: "bot", text: "React uses a virtual DOM and fiber architecture for efficient rendering...", createdAt: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      _id: "demo-repo-2",
      jobId: "demo-job-2",
      repoLink: "https://github.com/vercel/next.js",
      conversations: []
    },
    {
      _id: "demo-repo-3",
      jobId: "demo-job-3",
      repoLink: "https://github.com/microsoft/vscode",
      conversations: []
    }
  ]);
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set(["demo-repo-1"]));
  const navigate = useNavigate();

  const toggleRepoExpand = (repoId: string) => {
    const newExpanded = new Set(expandedRepos);
    if (newExpanded.has(repoId)) {
      newExpanded.delete(repoId);
    } else {
      newExpanded.add(repoId);
    }
    setExpandedRepos(newExpanded);
  };

  const selectConversation = (jobId: string, conversationId: string) => {
    navigate(`/chatbox/${jobId}/${conversationId}`);
  };

  const createNewConversation = (jobId: string) => {
    const newConversation: Conversation = {
      _id: `demo-conv-${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    setRepos(prev => prev.map(repo => 
      repo.jobId === jobId 
        ? { ...repo, conversations: [newConversation, ...repo.conversations] }
        : repo
    ));
  };

  const handleAddRepo = () => {
    navigate("/pastelink");
  };

  const extractRepoName = (repoLink: string) => {
    const match = repoLink.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return `${match[1]}/${match[2]}`;
    }
    return repoLink;
  };

  const totalConversations = repos.reduce((acc, repo) => acc + repo.conversations.length, 0);

  // Get the close sidebar function from parent if needed
  const closeSidebar = () => {
    // This will be called from parent to close the mobile sidebar
    const event = new CustomEvent('closeRepoSidebar');
    window.dispatchEvent(event);
  };

  return (
    <aside className="flex flex-col border-r border-[#1E2530] bg-[#0d0f14] w-full md:w-80 h-full">
      {/* Header */}
      <div className="border-b border-[#1E2530] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#a8ff3e]" />
          <div className="font-syne-Bold text-[13px] md:text-[15px] text-white">Demo Repositories</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRepo}
            className="flex items-center gap-1 text-[#a8ff3e] hover:text-[#bfff6e] text-[11px] font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add</span>
          </button>
          <button
            onClick={closeSidebar}
            className="md:hidden text-[#6b7788] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-[#1E2530] bg-[#11141C] px-4 py-2">
        <div className="flex items-center justify-between text-[10px] md:text-[11px]">
          <div className="flex gap-3 text-[#6b7788]">
            <div>
              <span className="text-white font-semibold">{repos.length}</span> demo repos
            </div>
            <div>
              <span className="text-white font-semibold">{totalConversations}</span> conversations
            </div>
          </div>
          <div className="text-[#6b7788]">
            Demo
          </div>
        </div>
      </div>

      {/* Repos List */}
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {repos.map((repo) => (
          <div key={repo._id} className="border border-[#1E2530] rounded-[6px] bg-[#11141C] overflow-hidden transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_10px_rgba(168,255,62,0.2)]">
            {/* Repo Header */}
            <button
              onClick={() => toggleRepoExpand(repo._id)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#1a2035] transition-all duration-300"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {expandedRepos.has(repo._id) ? (
                  <ChevronDown className="w-3 h-3 text-[#6b7788] flex-shrink-0 transition-all duration-300 hover:text-[#a8ff3e]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#6b7788] flex-shrink-0 transition-all duration-300 hover:text-[#a8ff3e]" />
                )}
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-white font-semibold text-[11px] md:text-[12px] font-syne-Bold truncate transition-all duration-300 hover:text-[#a8ff3e]">
                    {extractRepoName(repo.repoLink)}
                  </span>
                  <span className="text-[10px] text-[#6b7788]">
                    {repo.conversations.length} conversation{repo.conversations.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <MessageSquare className="w-3 h-3 text-[#6b7788] flex-shrink-0 transition-all duration-300 hover:text-[#a8ff3e]" />
            </button>

            {/* Conversations List */}
            {expandedRepos.has(repo._id) && (
              <div className="border-t border-[#1E2530] bg-[#0d0f14]">
                {/* New Conversation Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    createNewConversation(repo.jobId);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1a2035] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 text-[#a8ff3e] text-[11px]"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Conversation</span>
                </button>

                {/* Conversation Items */}
                {repo.conversations.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-[#6b7788] text-[10px]">
                    No conversations yet
                  </div>
                ) : (
                  repo.conversations.map((conversation) => (
                    <button
                      key={conversation._id}
                      onClick={() => selectConversation(repo.jobId, conversation._id)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1a2035] transition-all duration-300 hover:translate-x-1 text-left"
                    >
                      <MessageSquare className="w-3 h-3 text-[#6b7788] flex-shrink-0 transition-all duration-300 hover:text-[#a8ff3e]" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white text-[11px] truncate transition-all duration-300 hover:text-[#a8ff3e]">
                          {conversation.title}
                        </span>
                        <span className="text-[9px] text-[#6b7788]">
                          {conversation.messages.length} messages
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default DemoRepoConversationSidebar;