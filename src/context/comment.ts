import path from "path";
import {
  COMMENT_HEADING,
  MAX_SHOW_DETAIL_CHANGED_COUNT,
  MAX_SHOW_FULL_CHANGED_COUNT,
  ROOT_DIR,
} from "../constants";
import { Config, ImpactedInfoTree, ImpactedNode, ImpactMap } from "../types";
import { createMdLink, parseUniqueArray } from "../utils";

const createImpacted = (impactedFiles: ImpactedNode[]): string => {
  const content = [];

  if (impactedFiles.length === 0) {
    content.push("✨️ No Impacted Files ✨️\n");
    return content.join("\n");
  }

  const impactedFileListStr = (() => {
    return impactedFiles
      .map(({ path, link }) => `- ${createMdLink(path, link)}`)
      .join("\n");
  })();

  if (impactedFiles.length > MAX_SHOW_FULL_CHANGED_COUNT) {
    content.push("> [!CAUTION]");
    content.push(
      `> Too many impacted files. Please check the detail section. Too many files (**${impactedFiles.length} files...**)`
    );
    content.push("<details><summary>Details</summary>\n");
    content.push(impactedFileListStr);
    content.push("</details>");
  } else {
    content.push(impactedFileListStr);
  }

  content.push("");

  return content.join("\n");
};

const createImpactedDetails = (treeList: ImpactedInfoTree[]): string => {
  const content = [];

  if (treeList.length === 0) {
    content.push("✨️ No Impacted Files ✨️");
    return content.join("\n");
  }

  for (const tree of treeList) {
    content.push(
      `### 📝 ${createMdLink(path.basename(tree.file.path), tree.file.link)} (${
        tree.parents.length
      } files)\n`
    );

    // GHA のコメント可能な文字数最大値を考慮して、150ファイル以上の場合は詳細を表示しない
    const detail = (() => {
      if (tree.parents.length > 150) {
        return "Too many files..., Cannot display all files.";
      }
      if (tree.parents.length === 0) {
        return "✨️ No impact (Could be a dead code...) ✨️";
      }
      return tree.parents
        .map(({ path, link }) => `- [ ] ${createMdLink(path, link)}`)
        .join("\n");
    })();

    if (tree.parents.length > MAX_SHOW_DETAIL_CHANGED_COUNT) {
      content.push("<details><summary>Impacted Files</summary>\n");
    }

    content.push(detail);

    if (tree.parents.length > MAX_SHOW_DETAIL_CHANGED_COUNT) {
      content.push("</details>");
    }

    content.push("");
    content.push("---");
  }

  return content.join("\n");
};

export const createComment = (
  impactMap: ImpactMap,
  repoUrl: string,
  { SHA }: Config
): string => {
  const impactedTreeList: ImpactedInfoTree[] = [...Object.entries(impactMap)]
    .map(([file, parents]) => {
      return {
        file: {
          path: path.relative(ROOT_DIR, file),
          link: `${repoUrl}/blob/${SHA}/${path.relative(ROOT_DIR, file)}`,
        },
        parents: [...new Set(parents)]
          .map((pathStr) => ({
            path: path.relative(ROOT_DIR, pathStr),
            link: `${repoUrl}/blob/${SHA}/${path.relative(ROOT_DIR, pathStr)}`,
          }))
          .sort((a, b) => a.path.localeCompare(b.path)),
      };
    })
    .sort((a, b) => b.parents.length - a.parents.length);

  const impactedFiles = parseUniqueArray(
    impactedTreeList.flatMap((el) => el.parents),
    "path"
  ).sort((a, b) => a.path.localeCompare(b.path));

  const reportText = [
    COMMENT_HEADING,
    `# Possible Impact Report
    
Displays the potentially affected files for each file that has changed.
    `,
    `## ⚡️ ${impactedFiles.length} Impacted Pages\n`,
    createImpacted(impactedFiles),
    "## 🔎 Impacted Pages Detail\n",
    createImpactedDetails(impactedTreeList),
  ];

  return reportText.join("\n");
};
