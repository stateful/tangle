import config from './rollup.esm';
config.output.format = 'cjs';
global.IS_CJS = true;
export default config;
