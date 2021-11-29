### name
`"name": "element-ui"` 项目名称

### version
`"version": "2.15.7"` 项目版本号

### description
`"description": "A Component Library for Vue.js."` 项目描述

### main
`"main": "lib/element-ui.common.js"` 项目入口文件 `import Element from 'element-ui'`时引入的就是main中的文件
当使用require('module')时返回的主文件也是这个,lib/element-ui.common.js是commonjs规范，而lib/index.js是umd规范

### files
指定npm publish发包时需要包含的文件/目录。
模块下的文件名或者是文件夹名,如果是文件夹,则文件夹下所有文件也会被包含(除非文件被另一些配置排除)
```shell
"files": [
"lib",
"src",
"packages",
"types"
]
```
### typings
`"typings": "types/index.d.ts"` TypeScript入口文件。

### Scripts对象
如果说package.json是学习框架的第一部分,那么其中scripts对象则是重中之重.script里边指定了项目的生命周期个各个环节需要执行的命令,体现了项目的开发、测试、打包、部署等架构关系.
其中scripts对象的key是生命周期中的事件,而value是要执行的shell命令.
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

#### bootstrap 安装依赖
`"bootstrap": "yarn || npm i"`此处 bootstrap 不是 bootstrap UI，而是引导程序的意思，即初始化项目,是用来安装依赖的

#### build:file 自动生成文件
该指令主要用来自动化生成一些文件。
```shell
"build:file": 
"node build/bin/iconInit.js 
& node build/bin/build-entry.js 
& node build/bin/i18n.js 
& node build/bin/version.js"
```
- `node build/bin/iconInit.js` 用于将 `packages/theme-chalk/src/icon.scss` 的图标样式名称提取出来，并写入到 `examples/icon.json` 文件中
最后遍历 icon.json, 效果如下：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/23/172df2c66e5798d4~tplv-t2oaga2asx-watermark.awebp)
- `node build/bin/build-entry.js` 用于根据components.json文件，生成src/index.js文件，核心就是json-templater/string插件的使用。因此在新增UI组件的时候要更新该文件。
- `node build/bin/i18n.js` 根据 examples/i18n/page.json 和模版，生成不同语言的 demo，也就是官网 demo 展示国际化的处理。
- `node build/bin/version.js` 根据package.json中的version,生成examples/versions.json，对应就是完整的版本列表

#### build:theme 生成样式
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

#### clean 删除文件
`"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage"`
使用npm run clean会删除之前打包生成的文件，这里直接使用了一个node包：rimraf，类似于linux下的rm -rf。
- `rimraf lib` 清空lib文件夹
- `rimraf packages/*/lib` 清空 packages/*/lib 下文件夹
- `rimraf test/**/coverage` 清空 rimraf test/**/coverage 文件夹

#### deploy:build 编译文档
`"deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME"`
 编译成功后可以部署在 Nginx 服务器上进行访问，生成的文档涉及到一些网络资源可以下载到本地进行部署 https://blog.csdn.net/txyzqc/article/details/109700596
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
官网开发模式
`"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js"`
- `npm run bootstrap` 参考 bootstrap 命令 ↑ 安装依赖
- `npm run build:file` 生成index.js，主要用来自动化生成一些文件用于生成Element的入口js：先是读取根目录的components.json，这个json文件维护着Element所有的组件路径映射关系，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行import，对外暴露install方法，把所有import的组件通过Vue.component(name, component)方式注册为全局组件，并且把一些弹窗类的组件挂载到Vue的原型链上（这个在上面介绍scripts相关脚本时有详细说明）。
- `cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js`  webpack 启动，热更新用于跑Element官网的基础配置
- `node build/bin/template.js` tpl后缀模板文件的处理

#### dev:play
组件开发模式

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
检查以下文件目录下的文件是否符合语法规则
`eslint src/**/* test/**/* packages/**/* build/**/* --quiet` 代码检查:使用 eslint 检测 src、test、packages、build 下的所有文件

#### pub

`"pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js"`

主要是通过运行一系列的 bash 脚本，实现了代码的提交、合并、版本管理、npm 发布、官网发布等，让整个发布流程自动化完成，脚本具体内容感兴趣的同学可自行查看。



#### test
`"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run"`
用karma来做测试的,CI环境的单元测试,会启动浏览器

#### test:watch
`"test:watch": "npm run build:theme && cross-env BABEL_ENV=test karma start test/unit/karma.conf.js"`
仅单元测试

### repository
git仓库地址
```shell
"repository": {
"type": "git",
"url": "git@github.com:ElemeFE/element.git"
}
```

### homepage
`"homepage": "http://element.eleme.io"` 主页地址，通过gh-pages发布到github的主页地址

### keywords
npm搜索时的关键词
```shell
"keywords": [
"eleme",
"vue",
"components"
]
```

### license
`"license": "MIT"` MIT开源协议

### bugs
bugs 提交地址
```shell
"bugs": {
    "url": "https://github.com/ElemeFE/element/issues"
}
```

### 依赖关系
```
"dependencies": {
    "async-validator": "~1.8.1",#异步数据验证插件
    "babel-helper-vue-jsx-merge-props": "^2.0.0",#jsx和vue合并插件
    "deepmerge": "^1.2.0", #对象深度合并插件
    "normalize-wheel": "^1.0.1", #浏览器滚轮兼容插件
    "resize-observer-polyfill": "^1.5.0",#监听元素变化插件
    "throttle-debounce": "^1.0.1"#节流防抖插件
},
"peerDependencies": { #宿主依赖包
    "vue": "^2.5.17"
},
"devDependencies": {
    "@vue/component-compiler-utils": "^2.6.0",
    "algoliasearch": "^3.24.5", #实时托管全文搜索引擎
    "babel-cli": "^6.26.0",#babel系列
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-istanbul": "^4.1.1",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-regenerator-runtime": "^6.5.0",
    "chai": "^4.2.0",#断言插件
    "chokidar": "^1.7.0", #node检查文件变化插件
    "copy-webpack-plugin": "^5.0.0",#webpack拷贝文件插件
    "coveralls": "^3.0.3", #测试覆盖率插件
    "cp-cli": "^1.0.2",#node中使用UNIX的cp命令插件
    "cross-env": "^3.1.3",#跨平台地设置及使用环境变量
    "css-loader": "^2.1.0",#css加载插件
    "es6-promise": "^4.0.5", #promise语法插件
    "eslint": "4.18.2", #eslint系列
    "eslint-config-elemefe": "0.1.1",
    "eslint-loader": "^2.0.0",
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
    "file-loader": "^1.1.11",#文件加载插件
    "file-save": "^0.2.0",#文件保存插件
    "gulp": "^4.0.0", #gulp打包系列
    "gulp-autoprefixer": "^6.0.0",
    "gulp-cssmin": "^0.2.0",
    "gulp-dart-sass": "^1.0.2",
    "highlight.js": "^9.3.0",#高亮插件
    "html-webpack-plugin": "^3.2.0",#webpack的HTML生成插件
    "json-loader": "^0.5.7",#json加载器
    "json-templater": "^1.0.4", #json模板语法插件
    "karma": "^4.0.1",#karma测试框架系列
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.2",
    "karma-mocha": "^1.3.0",
    "karma-sinon-chai": "^2.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "^0.0.32",
    "karma-webpack": "^3.0.5",
    "markdown-it": "^8.4.1",#markdown解析器
    "markdown-it-anchor": "^5.0.2",
    "markdown-it-chain": "^1.3.0",
    "markdown-it-container": "^2.0.0",
    "mini-css-extract-plugin": "^0.4.1",
    "mocha": "^6.0.2",#mocha测试库
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss": "^7.0.14", #postcss系列
    "progress-bar-webpack-plugin": "^1.11.0",
    "rimraf": "^2.5.4",#node深度删除模块
    "sass": "^1.34.0",#sass语法必备插件
    "sass-loader": "^10.1.1",#sass加载器
    "select-version-cli": "^0.0.2",
    "sinon": "^7.2.7",#sinon测试插件
    "sinon-chai": "^3.3.0",
    "style-loader": "^0.23.1", #样式加载器
    "transliteration": "^1.1.11",
    "uglifyjs-webpack-plugin": "^2.1.1",
    "uppercamelcase": "^1.1.0",#驼峰命名插件
    "url-loader": "^1.0.1",#url加载器
    "vue": "2.5.21", #vue系列
    "vue-loader": "^15.7.0",
    "vue-router": "^3.0.1",
    "vue-template-compiler": "2.5.21",
    "vue-template-es2015-compiler": "^1.6.0",
    "webpack": "^4.14.0", #webpack系列
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.11",
    "webpack-node-externals": "^1.7.2"
}
 "cheerio": "^0.18.0",  #服务器高效操作DOM插件
 "gh-pages": "^0.11.0",  #自动发布到gh-pages
 "gulp-sass": "^3.1.0" => "gulp-dart-sass": "^1.0.2"
 "html-loader": "^0.5.1",  #html加载器
 "inject-loader": "^3.0.1",
 "isparta-loader": "^2.0.0",
 "lolex": "^1.5.1",  #时间模拟插件
 "postcss-loader": "0.11.1",
 "postcss-salad": "^1.0.8",
 
```
