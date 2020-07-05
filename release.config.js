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
    ['@semantic-release/git', { assets: ['CHANGELOG.md', 'package.json'] }],
    [
      '@semantic-release/github',
      {
        assets: ['lib/**'],
      },
    ],
    [
      '@semantic-release/exec',
      {
        publishCmd:
          'yarn bit tag --all ${nextRelease.version} && yarn bit export --all',
      },
    ],
  ],
};
