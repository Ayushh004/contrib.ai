import axios from "axios";
import Repo from "../models/RepoModel.js";
import { getCached, setCached } from "../utils/redisClient.js";

const getRepoIssues = async (req, res) => {
  try {
    const { jobId } = req.params;

    const repo = await Repo.findOne({ jobId });

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const githubLink = repo.repoLink;

    // https://github.com/facebook/react
    const match = githubLink.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid GitHub URL",
      });
    }

    const owner = match[1];
    const repoName = match[2];

    // Generate cache key
    const cacheKey = `github:issues:${owner}/${repoName}`;
    
    
    // Try to get from cache first (15-minute TTL = 900 seconds)
    const cachedIssues = await getCached(cacheKey);
    if (cachedIssues) {
      console.log(`✅ Returning cached GitHub issues for ${owner}/${repoName}`);
      return res.status(200).json(cachedIssues);
    }

    // If not in cache, fetch from GitHub API
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/issues`
    );

    const issues = response.data.filter(
      issue => !issue.pull_request
    );

    // Cache the result for 15 minutes (900 seconds)
    await setCached(cacheKey, issues, 900);

    return res.status(200).json(issues);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Issues not fetched",
    });
  }
};

const getIssueDetails = async (req, res) => {
  try {
    const { jobId, issueNumber } = req.params;

    const repo = await Repo.findOne({ jobId });

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const githubLink = repo.repoLink;

    const match = githubLink.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid GitHub URL",
      });
    }

    const owner = match[1];
    const repoName = match[2];

    // Generate cache key for issue details
    const cacheKey = `github:issue:${owner}/${repoName}/${issueNumber}`;
    
    // Try to get from cache first (15-minute TTL = 900 seconds)
    const cachedIssueDetails = await getCached(cacheKey);
    if (cachedIssueDetails) {
      console.log(`✅ Returning cached issue details for ${owner}/${repoName}#${issueNumber}`);
      return res.status(200).json(cachedIssueDetails);
    }

    // Fetch issue details and comments in parallel
    const [issueResponse, commentsResponse] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repoName}/issues/${issueNumber}`),
      axios.get(`https://api.github.com/repos/${owner}/${repoName}/issues/${issueNumber}/comments`)
    ]);

    const issueDetails = {
      issue: issueResponse.data,
      comments: commentsResponse.data
    };

    // Cache the result for 15 minutes (900 seconds)
    await setCached(cacheKey, issueDetails, 900);

    return res.status(200).json(issueDetails);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Issue details not fetched",
    });
  }
};

export default getRepoIssues;
export { getIssueDetails };