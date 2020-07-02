## [2.0.1](https://github.com/eavam/use-debouncy/compare/v2.0.0...v2.0.1) (2020-07-02)


### Bug Fixes

* update information about bundle size ([38017d2](https://github.com/eavam/use-debouncy/commit/38017d21d0b11fcf3245e5e4e3d4afc451d991c9))

# [2.0.0](https://github.com/eavam/use-debouncy/compare/v1.9.3...v2.0.0) (2020-07-02)


### Bug Fixes

* add e2e tests in release workflow ([23928e3](https://github.com/eavam/use-debouncy/commit/23928e35dbb23d1a7c43a713f74c8061b86c6691))
* add newline at end gitignore ([c66ba7f](https://github.com/eavam/use-debouncy/commit/c66ba7f6ce012ebc50e897f92a8debf24827b17d))


### Features

* add e2e tests ([34cc610](https://github.com/eavam/use-debouncy/commit/34cc610a4f01affafa58d5d643094aa5a60c650c))
* changed hook for minimize useEffect calls ([26c608a](https://github.com/eavam/use-debouncy/commit/26c608aa27dfc24ab31e78d53313d5c8829a217f))


### BREAKING CHANGES

* Change track first mount call.
setTimeout reference moved in lexical scope.
The call happens clearTimeout with every deps update.

## [1.9.3](https://github.com/eavam/use-debouncy/compare/v1.9.2...v1.9.3) (2020-07-01)


### Bug Fixes

* add example gif ([54d1cbe](https://github.com/eavam/use-debouncy/commit/54d1cbe04bc72f0d77c42ab30b4144ab1c3768f5))

## [1.9.2](https://github.com/eavam/use-debouncy/compare/v1.9.1...v1.9.2) (2020-06-28)


### Bug Fixes

* current timer state allocated to a separate variable ([9d8846e](https://github.com/eavam/use-debouncy/commit/9d8846ec648b38ce69c736985173ee3e23328623))

## [1.9.1](https://github.com/eavam/use-debouncy/compare/v1.9.0...v1.9.1) (2020-06-25)


### Bug Fixes

* change description ([83f420e](https://github.com/eavam/use-debouncy/commit/83f420ea3314abfc82836e0afba548501621ddf8))

# [1.9.0](https://github.com/eavam/use-debouncy/compare/v1.8.0...v1.9.0) (2020-06-24)


### Features

* optimize bundle size ([1d393cb](https://github.com/eavam/use-debouncy/commit/1d393cbb384fd18dcce3f13fe9e8717335443fc1))

# [1.8.0](https://github.com/eavam/use-debouncy/compare/v1.7.0...v1.8.0) (2020-06-24)


### Bug Fixes

* change bundle size limit ([8fc2039](https://github.com/eavam/use-debouncy/commit/8fc2039c5ffc9c0df88cffbe7b4cc0e4895dc5d2))
* repository urls ([829f8d3](https://github.com/eavam/use-debouncy/commit/829f8d367d94525c0989515c9bd0ea3f13cb3177))


### Features

* add clear timer on unmount to avoid memory leaks ([56f2c4c](https://github.com/eavam/use-debouncy/commit/56f2c4c15289e4f6b9f6954a80763df3fa85f8b5))

# [1.7.0](https://github.com/eavam/use-debouncy/compare/v1.6.1...v1.7.0) (2020-06-23)

### Bug Fixes

- brotli disable ([1db05ff](https://github.com/eavam/use-debouncy/commit/1db05ffbf3e359083dd7cf28a199dbd185f654fc))
- clear moved in up scope ([a58fe87](https://github.com/eavam/use-debouncy/commit/a58fe87357d49423f20efbdd3be282a1de7a7412))
- disable run size-limit in test ([c5560b8](https://github.com/eavam/use-debouncy/commit/c5560b8046885655b6799aee50c3bc6e96777fd4))

### Features

- compress size bundle ([0d2976e](https://github.com/eavam/use-debouncy/commit/0d2976ecfb6b67ab30cd3097aa037f4de57c11a2))
- remove update function for comprese size ([a71b259](https://github.com/eavam/use-debouncy/commit/a71b259eb6eac65beb120103d3ead625834dbc6f))

## [1.6.1](https://github.com/eavam/use-debouncy/compare/v1.6.0...v1.6.1) (2020-06-23)

### Bug Fixes

- remove duplicate link in codesandbox ([ebe87b6](https://github.com/eavam/use-debouncy/commit/ebe87b6e073dae1bac3bc54696b11f104724f54f))

# [1.6.0](https://github.com/eavam/use-debouncy/compare/v1.5.0...v1.6.0) (2020-06-23)

### Features

- add codesandbox link ([3792fef](https://github.com/eavam/use-debouncy/commit/3792fefab1f5fa0a7fcce09c8acbbd9f30dc6c73))

# [1.5.0](https://github.com/eavam/use-debouncy/compare/v1.4.0...v1.5.0) (2020-06-23)

### Features

- add codesandbox link ([8c8e569](https://github.com/eavam/use-debouncy/commit/8c8e569aae0ece784a8758b8f1917fb28f270f2e))

# [1.4.0](https://github.com/eavam/use-debouncy/compare/v1.3.0...v1.4.0) (2020-06-23)

### Bug Fixes

- move size-limit workflows ([2ea23f5](https://github.com/eavam/use-debouncy/commit/2ea23f51f8fe167165b797397197830576e9a6ee))

### Features

- add size-limit ([2dcd81d](https://github.com/eavam/use-debouncy/commit/2dcd81d935c24d337e46b7fb0ebbdd81bcc51bee))

# [1.3.0](https://github.com/eavam/use-debouncy/compare/v1.2.1...v1.3.0) (2020-06-23)

### Features

- add disable call debounce on first mount ([dd5b41f](https://github.com/eavam/use-debouncy/commit/dd5b41f3d2802451a78533da5b90772efb9c5e27))

## [1.2.1](https://github.com/eavam/use-debouncy/compare/v1.2.0...v1.2.1) (2020-06-23)

### Bug Fixes

- automate release ([#11](https://github.com/eavam/use-debouncy/issues/11)) ([2d70dab](https://github.com/eavam/use-debouncy/commit/2d70dab9d164469d64d9d4fc381a985edfbb85b7))
- automate release ([#11](https://github.com/eavam/use-debouncy/issues/11)) ([4521a86](https://github.com/eavam/use-debouncy/commit/4521a862d3b97d83e2a6869fbf2eef9279718ee5))
- removed semantic-release from deps ([b5ff7a1](https://github.com/eavam/use-debouncy/commit/b5ff7a1cb027c583dad8b4310bbba08fa24a1eee))
- removed semantic-release from deps ([0b8a36d](https://github.com/eavam/use-debouncy/commit/0b8a36da618acc98bbd9013641aa5555ef31d3b0))

# [1.2.0](https://github.com/eavam/use-debouncy/compare/v1.1.0...v1.2.0) (2020-06-23)

### Bug Fixes

- add github token in cmd ([9cf7da5](https://github.com/eavam/use-debouncy/commit/9cf7da516594c6e4ce13a9923a54700234e7e1cd))
- add persist-credentials for correct push semantic-release ([c175f74](https://github.com/eavam/use-debouncy/commit/c175f7422e50a9ee40ef394bc3bedfe50dfa452f))
- add semantic-release in deps ([97ff8b6](https://github.com/eavam/use-debouncy/commit/97ff8b625db46d8a808241b38dc9cc432ef01593))
- change env name ([85a122d](https://github.com/eavam/use-debouncy/commit/85a122d09671325b71212409211c557db4ef5847))
- change token on admin token for semantic-release ([73efa66](https://github.com/eavam/use-debouncy/commit/73efa66e016594f30042df415bac3b6d213268a4))

### Features

- add readme ([fbb6d9b](https://github.com/eavam/use-debouncy/commit/fbb6d9b7da22d9ae9cb4d70a515af323e54f9e04))
