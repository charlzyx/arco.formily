import dts from "rollup-plugin-dts";
import buildConfig from "./rollup.config";
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
  ...buildConfig,
  input: "esm/index.d.ts",
  output: {
    format: "es",
    dir: `./dist`,
  },
  plugins: [
    dts.default({
      respectExternal: true,
    }),
    ...buildConfig.plugins,
  ],
  external: externals,
};

export default config;
