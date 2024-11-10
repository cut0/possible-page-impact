import { ROOT_DIR } from "./constants";
import path from "path";

export const parseUniqueArray = <T>(arr: T[], key: keyof T): T[] => {
  return Array.from(new Map(arr.map((item) => [item[key], item])).values());
};

export const createMdLink = (content: string, link: string | null) => {
  return link != null ? `[\`${content}\`](${link})` : content;
};

export const isRelativePath = (path: string): boolean => {
  return /^(?:\.{1,2}(?:[\\\/]|$)|[^\/\\]+?[\\\/])/.test(path);
};

export const toAbsolutePath = (pathStr: string): string => {
  return isRelativePath(pathStr) ? path.resolve(ROOT_DIR, pathStr) : pathStr;
};
