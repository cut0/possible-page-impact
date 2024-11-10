import core from "@actions/core";
import { GitHub } from "@actions/github/lib/utils";
import { COMMENT_HEADING } from "../constants";

type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;

type Options = {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  issue_number: number;
};

export const postComment = async (
  message: string,
  { octokit, owner, repo, issue_number }: Options
): Promise<void> => {
  try {
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number,
    });

    const existingComment = comments.find((comment) =>
      comment.body?.includes(COMMENT_HEADING)
    );

    if (existingComment) {
      await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingComment.id,
        body: message,
      });
    } else {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: message,
      });
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

export const getChangedFiles = async ({
  octokit,
  owner,
  repo,
  issue_number,
}: Options): Promise<string[]> => {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: issue_number,
  });

  return files.map((file) => file.filename);
};
