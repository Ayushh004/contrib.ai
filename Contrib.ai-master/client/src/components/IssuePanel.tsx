import { useEffect, useState } from "react";
import API from "../../axiosSetup/API";
import { X } from "lucide-react";
import IssueDetail from "./IssueDetail";

type RepoIssue = {
  id: number;
  title: string;
  number: number;
  labels: string[];
  status: "open" | "closed";
  updatedAt: string;
};




///
function IssuePanel({ jobid }: { jobid: string | undefined }) {
  const [activeLabel, setActiveLabel] = useState("All");
  const [repoIssues, setRepoIssues] = useState<RepoIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<RepoIssue | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");
  
  const filteredIssues =
    activeLabel === "All"
      ? repoIssues
      : repoIssues.filter((issue) => issue.labels.includes(activeLabel));

  const issueLabels = Array.from(
    new Set(repoIssues.flatMap((issue) => issue.labels))
  );
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get(`/issues/${jobid}`);
        const formattedIssues: RepoIssue[] = res.data.map(
          (issue: {
            id: number;
            title: string;
            number: number;
            state: "open" | "closed";
            updated_at: string;
            labels: { name: string }[];
          }) => ({
            id: issue.id,
            title: issue.title,
            number: issue.number,
            labels: issue.labels.map(label => label.name),
            status: issue.state,
            updatedAt: new Date(issue.updated_at).toLocaleString(),
          })
        );
        
        setRepoIssues(formattedIssues);

      } catch (e) {
        console.error(e);
        // Clear issues if there's an error fetching for the new repo
        setRepoIssues([]);

      }

    }
    if (jobid) {
      fetchIssues();
    } else {
      // Clear issues when there's no jobid
      setRepoIssues([]);
    }
  }, [jobid]);
  
  // Reset view and selected issue when jobid changes
  useEffect(() => {
    setSelectedIssue(null);
    setView("list");
    setActiveLabel("All");
  }, [jobid]);

  const closeSidebar = () => {
    const event = new CustomEvent('closeIssuePanel');
    window.dispatchEvent(event);
  };

  const handleIssueClick = (issue: RepoIssue) => {
    setSelectedIssue(issue);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedIssue(null);
    setView("list");
  };







  return (
    <aside className="flex max-h-screen flex-col border-t border-[#1E2530] bg-[#0d0f14] xl:border-l xl:border-t-0 w-full md:w-80 h-full">
      {view === "detail" && selectedIssue ? (
        <IssueDetail
          jobId={jobid}
          issueNumber={selectedIssue.number}
          onBack={handleBack}
        />
      ) : (
        <>
          <div className="border-b border-[#1E2530] px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-syne-Bold text-[13px] md:text-[15px] text-white">Repo issues</div>
              <div className="text-[12px] text-[#6b7788]">{filteredIssues.length} matching issues</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-[5px] border border-[#2a3048] bg-[#11141C] px-2 py-1 text-[11px] text-[#828FAC]">
                fix them
              </div>
              <button
                onClick={closeSidebar}
                className="md:hidden text-[#6b7788] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-b border-[#1E2530] px-4 py-3">
            <div className="mb-2 text-[11px] uppercase text-[#6b7788]">Labels</div>
            <div className="flex flex-wrap gap-2">
              {["All", ...issueLabels].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveLabel(label)}
                  className={`rounded-[5px] border px-2 py-1 text-[11px] transition-all duration-300 ${activeLabel === label
                    ? "border-[#4c5f92] bg-[#1a2035] text-white"
                    : "border-[#1E2530] bg-[#11141C] text-[#828FAC] hover:border-[#a8ff3e] hover:text-white hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {filteredIssues.map((issue) => (
              <article 
                key={issue.id} 
                className="rounded-[8px] border border-[#1E2530] bg-[#11141C] p-3 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_10px_rgba(168,255,62,0.2)] hover:-translate-y-0.5 cursor-pointer"
                onClick={() => handleIssueClick(issue)}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-syne-jetBrains text-[11px] md:text-[12px] text-[#6b7788] transition-all duration-300 hover:text-[#a8ff3e]">#{issue.number}</span>
                  <span className={`rounded-[5px] border px-2 py-0.5 text-[10px] transition-all duration-300 ${issue.status === "open"
                    ? "border-[#244f38] bg-[#102018] text-[#7ed9a4]"
                    : "border-[#4c3f25] bg-[#211a10] text-[#d7b46a]"
                    }`}>
                    {issue.status}
                  </span>
                </div>
                <h2 className="text-[13px] md:text-[14px] leading-5 text-white transition-all duration-300 hover:text-[#a8ff3e]">{issue.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <span key={label} className="rounded-[5px] border border-[#2a3048] bg-[#1a2035] px-2 py-0.5 text-[10px] text-[#AAB5CC] transition-all duration-300 hover:border-[#a8ff3e] hover:text-[#a8ff3e]">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-[11px] text-[#6b7788] transition-all duration-300 hover:text-[#a8ff3e]">Updated {issue.updatedAt}</div>
              </article>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

export default IssuePanel;
