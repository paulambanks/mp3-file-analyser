import { createConfig } from '@pnb/eslint';

export default [
  { ignores: [ 'build/', 'node_modules/', '.svelte-kit' ] },
  ...await createConfig(import.meta.url),
];
