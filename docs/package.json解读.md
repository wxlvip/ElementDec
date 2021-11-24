
### 入口文件
项目的入口文件,`import Element from 'element-ui'`时引入的就是main中的文件
```shell
"main": "lib/element-ui.common.js",
```
lib/element-ui.common.js是commonjs规范，而lib/index.js是umd规范

### files
指定npm publish发包时需要包含的文件/目录。
```shell
"files": [
"lib",
"src",
"packages",
"types"
]
```
### typings
TypeScript入口文件。
```shell
 "typings": "types/index.d.ts",
```
### 启动命令
```shell
  "scripts": {
    "bootstrap": "yarn || npm i",
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
    "build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
    "build:umd": "node build/bin/build-locale.js",
    "clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
    "deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME",
    "deploy:extension": "cross-env NODE_ENV=production webpack --config build/webpack.extension.js",
    "dev:extension": "rimraf examples/extension/dist && cross-env NODE_ENV=development webpack --watch --config build/webpack.extension.js",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "i18n": "node build/bin/i18n.js",
    "lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
    "pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js",
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
    "test:watch": "npm run build:theme && cross-env BABEL_ENV=test karma start test/unit/karma.conf.js"
  },
```

#### bootstrap
`"bootstrap": "yarn || npm i"`此处 bootstrap 不是 bootstrap UI，而是引导程序的意思，即初始化项目,是用来安装依赖的

#### build:file
该指令主要用来自动化生成一些文件。

`"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"`

- `node build/bin/iconInit.js` 用于将 `packages/theme-chalk/src/icon.scss` 的图标样式名称提取出来，并写入到 `examples/icon.json` 文件中
最后遍历 icon.json, 效果如下：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/23/172df2c66e5798d4~tplv-t2oaga2asx-watermark.awebp)
- `node build/bin/build-entry.js` 用于根据components.json文件，生成src/index.js文件，核心就是json-templater/string插件的使用。因此在新增UI组件的时候要更新该文件。
- `node build/bin/i18n.js` 根据 examples/i18n/page.json 和模版，生成不同语言的 demo，也就是官网 demo 展示国际化的处理。
- `node build/bin/version.js` 根据package.json中的version,生成examples/versions.json，对应就是完整的版本列表

#### build:theme
"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
- `node build/bin/gen-cssfile` 这一步是根据components.json，生成package/theme-chalk/index.scss文件，把所有组件的样式都导入到index.scss。
- `gulp build --gulpfile packages/theme-chalk/gulpfile.js` 通过 gulp 把packages/theme-chalk下的所有scss文件编译为css，采用gulp基于工作流去处理会更加方便
- `cp-cli packages/theme-chalk/lib lib/theme-chalk` 将上一步编译好的样式文件，复制到 lib/theme-chalk 下，cp-cli 是一个跨平台的copy工具，和CopyWebpackPlugin类似

#### build:utils
`"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js"`
转译工具方法,把src目录下的除了index.js入口文件外的其他文件通过babel转译，然后移动到lib文件夹下。

#### build:umd
`"build:umd": "node build/bin/build-locale.js"`
语言包，生成umd模块的语言包。把ES6的模块定义转换成umd的模块定义，输出到lib/umd/locale中

#### clean
`"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage"`
使用npm run clean会删除之前打包生成的文件，这里直接使用了一个node包：rimraf，类似于linux下的rm -rf。
- `rimraf lib` 清空lib文件夹
- `rimraf packages/*/lib` 清空 packages/*/lib 下文件夹
- `rimraf test/**/coverage` 清空 rimraf test/**/coverage 文件夹

#### deploy:build
`"deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME"`
编译文档 编译成功后可以部署在 Nginx 服务器上进行访问，生成的文档涉及到一些网络资源可以下载到本地进行部署 https://blog.csdn.net/txyzqc/article/details/109700596
- `npm run build:file` 该指令主要用来自动化生成一些文件,详情见上面说明
- `cross-env NODE_ENV=production webpack --config build/webpack.demo.js` 标准的webpack配置文件。这个其实是文档构建的webpack配置
- `echo element.eleme.io>>examples/element-ui/CNAME` ？不明白想做什么？输出目录是examples/element-ui

#### deploy:extension
`"deploy:extension": "cross-env NODE_ENV=production webpack --config build/webpack.extension.js"`
编译出一个chrome扩展插件，可以在浏览器中直接改element组件的颜色

#### dev:extension
`"dev:extension": "rimraf examples/extension/dist && cross-env NODE_ENV=development webpack --watch --config build/webpack.extension.js"`
参考deploy:extension ↑

#### dev
"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
- `npm run bootstrap` 参考 bootstrap 命令 ↑ 安装依赖
- `npm run build:file` 生成index.js，主要用来自动化生成一些文件用于生成Element的入口js：先是读取根目录的components.json，这个json文件维护着Element所有的组件路径映射关系，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行import，对外暴露install方法，把所有import的组件通过Vue.component(name, component)方式注册为全局组件，并且把一些弹窗类的组件挂载到Vue的原型链上（这个在上面介绍scripts相关脚本时有详细说明）。
- `cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js`  webpack 启动，热更新用于跑Element官网的基础配置
- `node build/bin/template.js` tpl后缀模板文件的处理

#### dev:play
`"dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js"`

#### dist
`"dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme"`
项目构建，生成打包文件，类似vue-cli 的 npm run build

- `npm run clean` 参考 clean 命令 ↑ 删除之前打包的文件
- `npm run build:file` 参考 build:file 命令 ↑ 依次是生成 examples/icon.json；生成 src/index.js；生成 examples/pages下国际化相关vue文件；生成 examples/versions.json；
- `npm run lint` 参考 lint 命令 ↓ 执行eslint检查
- `webpack --config build/webpack.conf.js` 生成umd格式的js文件（index.js）webpack打包，lib目录下打包 index.js文件 （浏览器使用的js包）.
- `webpack --config build/webpack.common.js` 生成commonjs格式的js文件（element-ui.common.js），require时默认加载的是这个文件。webpack打包，lib目录下生成element-ui.common.js 文件（node下使用的文件，对应 package.json 中的 main 字段）
- `webpack --config build/webpack.component.js` 以components.json为入口，将每一个组件打包生成一个文件，用于按需加载。webpack打包，lib下生成组件的 js 文件
- `npm run build:utils` 参考 build:utils 命令 ↑ 执行 build:utils 命令 ，babel 打包src目录下文件至lib，忽略index.js
- `npm run build:umd` 参考 build:umd 命令 ↑ 执行 build:umd 命令 ，lib/locale下生成国际化相关文件
- `npm run build:theme` 参考 build:theme 命令 ↑ 执行 build:theme 命令 ，生成样式

#### i18n
`"i18n": "node build/bin/i18n.js"`参考build:file ↑

#### lint
`"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet"`
`eslint src/**/* test/**/* packages/**/* build/**/* --quiet` 代码检查:使用 eslint 检测 src、test、packages、build 下的所有文件

#### pub
`"pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js"`

#### test
`"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run"`
用karma来做测试的

#### test:watch
"test:watch": "npm run build:theme && cross-env BABEL_ENV=test karma start test/unit/karma.conf.js"
 