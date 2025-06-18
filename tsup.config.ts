import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  platform: "node",
  format: ["esm", "cjs"],
  target: "es2022",
  skipNodeModuleBundles: true,
  terserOptions: {
    mangle: false,
    keep_classnames: true,
    keep_fnames: true,
  },
  keepNames: true,
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  treeShake: false,
  outDir: "dist",
});
