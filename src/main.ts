import github from "@actions/github";
import { createImpactMap } from "./context/traverse";
import { createComment } from "./context/comment";
import { getChangedFiles, postComment } from "./context/octkit";
import { createConfig } from "./config";

const run = async () => {
  const context = github.context;
  const { owner, repo } = context.repo;
  const issue_number = context.issue.number;

  const config = createConfig();

  const octokit = github.getOctokit(config.GITHUB_TOKEN);

  const files = await getChangedFiles({ octokit, owner, repo, issue_number });

  const impactMap = createImpactMap(files, config);
  const comment = createComment(
    impactMap,
    `https://github.com/${owner}/${repo}`,
    config
  );

  await postComment(comment, { octokit, owner, repo, issue_number });
};

run();
