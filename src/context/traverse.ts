import path from "path";
import type { FileRelationNode, ParentsTree } from "depon";
import { genFileRelation, getParentsTree } from "depon";
import { Config, ImpactMap } from "../types";
import { minimatch } from "minimatch";
import { ROOT_DIR } from "../constants";
import { toAbsolutePath } from "../utils";

export const createImpactMap = (
  files: string[],
  { APP_DIR, PAGES_PATH_GLOB, PAGES_PATH_REGEX }: Config
): ImpactMap => {
  const impactMap: ImpactMap = {};

  const traverse = (node: ParentsTree<FileRelationNode>, fileName: string) => {
    const isPageFile =
      (PAGES_PATH_GLOB !== "" &&
        minimatch(node.key, toAbsolutePath(PAGES_PATH_GLOB))) ||
      (PAGES_PATH_REGEX !== "" && new RegExp(PAGES_PATH_REGEX).test(node.key));

    if (isPageFile) {
      if (impactMap[fileName] == null) {
        impactMap[fileName] = [];
      }
      impactMap[fileName].push(node.key);
      return;
    }

    for (const parent of node.parents) {
      traverse(parent, fileName);
    }
  };

  const fileRelation = genFileRelation({
    targetDir: APP_DIR,
    ignoreTypeRelation: true,
  });

  for (const file of files) {
    const filePath = path.resolve(ROOT_DIR, file);
    const parentsTree = getParentsTree(fileRelation, filePath);
    traverse(parentsTree, filePath);
  }

  return impactMap;
};
