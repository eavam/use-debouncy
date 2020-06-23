// eslint-disable-next-line no-undef
module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        tarballDir: 'lib',
      },
    ],
    '@semantic-release/git',
    [
      '@semantic-release/github',
      {
        assets: ['lib/**'],
      },
    ],
  ],
};
