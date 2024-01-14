import { createConfig } from '@pnb/eslint';

export default [
  { ignores: [ 'build/', 'node_modules/' ] },
  ...await createConfig(import.meta.url),
];
