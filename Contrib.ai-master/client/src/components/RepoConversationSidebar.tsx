import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, MessageSquare, FolderOpen, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosSetup/API";

interface Conversation {
  _id: string;
  title: string;
  messages: Array<{ sender: string; text: string; createdAt: Date }>;
  createdAt: string;
}

interface Repo {
  _id: string;
  jobId: string;
  repoLink: string;
  conversations: Conversation[];
}

function RepoConversationSidebar() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRepos();
  }, []);

  const fetchUserRepos = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/repos");
      
      if (res.data?.success && res.data?.repos) {
        // Transform repos data to match our interface
        const transformedRepos = res.data.repos.map((repo: any) => ({
          _id: repo._id,
          jobId: repo.jobId,
          repoLink: repo.repoLink,
          conversations: [] // Will be fetched when expanded
        }));
        
        setRepos(transformedRepos);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationsForRepo = async (jobId: string) => {
    try {
      setLoadingConversations(prev => new Set(prev).add(jobId));
      const res = await API.get(`/conversations/repo/${jobId}`);
      
      if (res.data?.conversations) {
        setRepos(prev => prev.map(repo => 
          repo.jobId === jobId 
            ? { ...repo, conversations: res.data.conversations }
            : repo
        ));
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const toggleRepoExpand = async (repoId: string) => {
    const newExpanded = new Set(expandedRepos);
    if (newExpanded.has(repoId)) {
      newExpanded.delete(repoId);
    } else {
      newExpanded.add(repoId);
      // Fetch conversations when expanding
      await fetchConversationsForRepo(repoId);
    }
    setExpandedRepos(newExpanded);
  };

  const selectConversation = (jobId: string, conversationId: string) => {
    navigate(`/chatbox/${jobId}/${conversationId}`);
  };

  const createNewConversation = async (jobId: string) => {
    try {
      const res = await API.post("/conversation", { repoId: jobId });
      const newConversation = res.data;
      
      // Update the repos state with the new conversation
      setRepos(prev => prev.map(repo => 
        repo.jobId === jobId 
          ? { ...repo, conversations: [newConversation, ...repo.conversations] }
          : repo
      ));
      
      // Navigate to the new conversation
      navigate(`/chatbox/${jobId}/${newConversation._id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
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

  const closeSidebar = () => {
    const event = new CustomEvent('closeRepoSidebar');
    window.dispatchEvent(event);
  };

  return (
    <aside className="flex flex-col border-r border-[#1E2530] bg-[#0d0f14] w-full md:w-80 h-full">
      {/* Header */}
      <div className="border-b border-[#1E2530] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#a8ff3e]" />
          <div className="font-syne-Bold text-[13px] md:text-[15px] text-white">Repositories</div>
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
              <span className="text-white font-semibold">{repos.length}</span> repos
            </div>
            <div>
              <span className="text-white font-semibold">{totalConversations}</span> conversations
            </div>
          </div>
          <div className="text-[#6b7788]">
            Local
          </div>
        </div>
      </div>

      {/* Repos List */}
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-[#6b7788] text-[11px]">
            Loading repos...
          </div>
        ) : repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen className="w-8 h-8 text-[#6b7788] mb-2" />
            <p className="text-[11px] text-[#6b7788] mb-3">No repositories yet</p>
            <button
              onClick={handleAddRepo}
              className="px-3 py-1.5 bg-[#a8ff3e] text-black text-[11px] rounded-[5px] hover:bg-[#bfff6e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105"
            >
              Add your first repo
            </button>
          </div>
        ) : (
          repos.map((repo) => (
            <div key={repo._id} className="border border-[#1E2530] rounded-[6px] bg-[#11141C] overflow-hidden transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_10px_rgba(168,255,62,0.2)]">
              {/* Repo Header */}
              <button
                onClick={() => toggleRepoExpand(repo.jobId)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#1a2035] transition-all duration-300"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {expandedRepos.has(repo.jobId) ? (
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
              {expandedRepos.has(repo.jobId) && (
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
                  {loadingConversations.has(repo.jobId) ? (
                    <div className="flex items-center justify-center py-4 text-[#6b7788] text-[10px]">
                      Loading conversations...
                    </div>
                  ) : repo.conversations.length === 0 ? (
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
          ))
        )}
      </div>
    </aside>
  );
}

export default RepoConversationSidebar;
