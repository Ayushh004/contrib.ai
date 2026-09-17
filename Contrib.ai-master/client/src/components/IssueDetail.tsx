import { useEffect, useState } from "react";
import API from "../../axiosSetup/API";
import { ArrowLeft, MessageSquare, Clock, User } from "lucide-react";

type IssueDetailProps = {
  jobId: string | undefined;
  issueNumber: number;
  onBack: () => void;
};

type Comment = {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  body: string;
};

type IssueDetails = {
  title: string;
  number: number;
  state: "open" | "closed";
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  labels: { name: string; color: string }[];
  comments: number;
};

type IssueDetailData = {
  issue: IssueDetails;
  comments: Comment[];
};

function IssueDetail({ jobId, issueNumber, onBack }: IssueDetailProps) {
  const [issueData, setIssueData] = useState<IssueDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/issues/${jobId}/${issueNumber}`);
        setIssueData(res.data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load issue details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId && issueNumber) {
      fetchIssueDetails();
    }
  }, [jobId, issueNumber]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[#6b7788]">Loading issue details...</div>
      </div>
    );
  }

  if (error || !issueData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="text-red-400 mb-4">{error || "Issue not found"}</div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-[5px] border border-[#2a3048] bg-[#11141C] px-3 py-2 text-[11px] text-[#828FAC] hover:border-[#a8ff3e] hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to issues
        </button>
      </div>
    );
  }

  const { issue, comments } = issueData;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[#1E2530] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-[5px] border border-[#2a3048] bg-[#11141C] px-3 py-2 text-[11px] text-[#828FAC] hover:border-[#a8ff3e] hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className={`rounded-[5px] border px-2 py-0.5 text-[10px] transition-all duration-300 ${
            issue.state === "open"
              ? "border-[#244f38] bg-[#102018] text-[#7ed9a4]"
              : "border-[#4c3f25] bg-[#211a10] text-[#d7b46a]"
          }`}>
            {issue.state}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Issue Title and Meta */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-syne-jetBrains text-[11px] text-[#6b7788]">#{issue.number}</span>
            <span className="text-[11px] text-[#6b7788]">•</span>
            <div className="flex items-center gap-1 text-[11px] text-[#6b7788]">
              <MessageSquare className="w-3 h-3" />
              {comments.length} comments
            </div>
          </div>
          <h1 className="text-[16px] font-bold text-white leading-6 mb-3">{issue.title}</h1>
          
          {/* Labels */}
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {issue.labels.map((label) => (
                <span
                  key={label.name}
                  className="rounded-[5px] border border-[#2a3048] bg-[#1a2035] px-2 py-0.5 text-[10px] text-[#AAB5CC]"
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Author and Date */}
          <div className="flex items-center gap-3 text-[11px] text-[#6b7788]">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{issue.user.login}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Opened {formatDate(issue.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        {issue.body && (
          <div className="mb-6 rounded-[8px] border border-[#1E2530] bg-[#11141C] p-4">
            <div className="mb-2 text-[11px] uppercase text-[#6b7788]">Description</div>
            <div className="text-[13px] text-[#AAB5CC] leading-5 whitespace-pre-wrap">
              {issue.body}
            </div>
          </div>
        )}

        {/* Comments Section */}
        {comments.length > 0 && (
          <div>
            <div className="mb-3 text-[11px] uppercase text-[#6b7788]">
              Comments ({comments.length})
            </div>
            <div className="flex flex-col gap-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-[8px] border border-[#1E2530] bg-[#11141C] p-4"
                >
                  {/* Comment Header */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.user.avatar_url}
                        alt={comment.user.login}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-[12px] text-[#AAB5CC]">{comment.user.login}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#6b7788]">
                      <Clock className="w-3 h-3" />
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  {/* Comment Body */}
                  <div className="text-[12px] text-[#AAB5CC] leading-5 whitespace-pre-wrap">
                    {comment.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {comments.length === 0 && (
          <div className="text-center py-8 text-[#6b7788] text-[12px]">
            No comments yet
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueDetail;