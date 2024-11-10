import { type BuildOptions, build } from "esbuild";

const options: BuildOptions = {
  entryPoints: ["./src/main.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "node",
  target: "esnext",
} as const;

Promise.all([
  build({
    ...options,
    format: "cjs",
    outfile: "./dist/index.cjs",
  }),
]).catch(() => process.exit(1));
