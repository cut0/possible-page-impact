import core from "@actions/core";
import { Config } from "./types";
import path from "path";
import { ROOT_DIR } from "./constants";

export const createConfig = (): Config => {
  return {
    GITHUB_TOKEN: core.getInput("GITHUB_TOKEN", { required: true }),
    SHA: core.getInput("SHA", { required: true }),
    APP_DIR: path.resolve(
      ROOT_DIR,
      core.getInput("app_dir", { required: true })
    ),
    PAGES_PATH_GLOB: core.getInput("pages_pattern", {
      required: false,
    }),
    PAGES_PATH_REGEX: core.getInput("pages_regex", {
      required: false,
    }),
  };
};
