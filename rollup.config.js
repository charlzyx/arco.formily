import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import fileSize from "rollup-plugin-filesize";
import externalGlobals from 'rollup-plugin-external-globals'
import typescript from "rollup-plugin-typescript2";
import multiInput from "rollup-plugin-multi-input";

import pkg from './package.json';
const peerDepsExternal = Object.keys(pkg.peerDependencies)

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ["./src/**/*"],
  output: [
    {
      dir: "./dist/cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: "./dist/esm",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    multiInput.default(),
	externalGlobals(peerDepsExternal, {
		exclude: ['**/*.{less,sass,scss}'],
	}),
    resolve(),
    commonjs(),
    typescript(),
    fileSize(),
  ],
};

export default config