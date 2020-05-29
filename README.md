## Project Description

需要安装一下插件
[vscode eslint 自动格式化插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

以下是项目配置说明

```
editorConfig 编辑器配置文件
Prettier 批量格式化代码
Eslint 代码检查规范，本项目继承于standard
lint-staged 提交到git之前跑一次代码检查
```

[standard 规范](https://standardjs.com/rules-zhcn.html)

```
prettier:
  自定义格式化规则新建 .prettierrc 文件
  过滤格式化规则 .prettierignore 文件
```

```
lint-staged:
git add时执行 ..lintstagedrc
```

[参考链接](https://jsonz1993.github.io/2018/03/%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83%E5%B7%A5%E4%BD%9C%E6%B5%81%E2%80%94%E2%80%94editor%E3%80%81prettier%E3%80%81eslint%E3%80%81git-check/)
[参考链接](https://medium.com/@danielhu95/set-up-eslint-pipeline-zh-tw-990d7d9eb68e)

---

```
git配置约束代码提交规范：husky、conventional-changelog、cz-customizable
```

```
husky:
  git commit时执行 lint-staged .huskyrc 文件
  conventional-changelog 自动生产提交历史
  cz-customizable 自定义提交规范
```

[参考链接](https://zhuanlan.zhihu.com/p/69635847)
[参考链接](https://juejin.im/post/5bd2debfe51d457abc710b57)

---

## Necessary condition

## Environment

## Installation

```bash
$ npm install || yarn
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Submit code

```
1. git add .
2. git cz  // 替代 git commit -a 'xxx'
   git commit --no-verify -m "代码规范强制提交测试"
3. npm version xxx  // 通过npm更改版本号自动触发 npm run version
4. git push
```
