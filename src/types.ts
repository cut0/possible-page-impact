export type Config = {
  GITHUB_TOKEN: string;
  SHA: string;
  APP_DIR: string;
  PAGES_PATH_GLOB: string;
  PAGES_PATH_REGEX: string;
};

export type ImpactMap = Record<string, string[]>;

export type ImpactedNode = {
  path: string;
  link: string | null;
};

export type ImpactedInfoTree = {
  file: ImpactedNode;
  parents: ImpactedNode[];
};
