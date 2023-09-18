const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  appIndex: 'demo.html',
  open: false,
  watch: !hmr,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
});
