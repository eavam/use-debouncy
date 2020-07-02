// eslint-disable-next-line no-undef
module.exports = {
  serverOptions: {
    command: 'yarn parcel e2e/app/index.html',
    port: 1234,
    launchTimeout: 30000,
  },
  launch: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  },
  browserContext: 'incognito',
};
