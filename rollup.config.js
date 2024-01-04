import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import NpmImport from "less-plugin-npm-import";
import multiInput from "rollup-plugin-multi-input";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const externals = [
  ...Object.keys(pkg.peerDependencies),
  /^@arco\-design\/web-react\//,
  /^react\//,
];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ["./src/**/*"],
  output: [
    {
      dir: "./lib",
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: "./esm",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: externals,
  plugins: [
    multiInput.default(),
    resolve(),
    commonjs(),
    typescript({
      exclude: "./**/*.less",
    }),
    postcss({
      extract: "arco.formily.css",
      minimize: false,
      sourceMap: false,
      modules: true,
      extensions: [".css", ".less", ".sass"],
      use: {
        less: {
          plugins: [new NpmImport({ prefix: "~" })],
          javascriptEnabled: true,
        },
        sass: {},
        stylus: {},
      },
    }),
  ],
};

export default config;
