/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/index.ts',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	}
};

export default config;