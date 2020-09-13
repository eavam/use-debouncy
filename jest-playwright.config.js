module.exports = {
  serverOptions: {
    command: 'npm run serve:e2e',
    port: 1234,
    launchTimeout: 30000,
  },
  launchOptions: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  },
  browserContext: 'incognito',
};
