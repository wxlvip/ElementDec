'use strict';
// 把packages/theme-chalk下的所有scss文件编译为css，按需加载时需要单独引入样式
const { series, src, dest } = require('gulp');
const sass = require('gulp-dart-sass'); // 编译gulp工具
const autoprefixer = require('gulp-autoprefixer'); // 添加厂商前缀
const cssmin = require('gulp-cssmin'); // 压缩css

function compile() {
  return src('./src/*.scss') // src下的所有scss文件
    .pipe(sass.sync().on('error', sass.logError)) // 把scss文件编译成css
    .pipe(autoprefixer({ // 基于目标浏览器版本，添加厂商前缀 根据浏览器的不同版本自动处理浏览器的前缀，实现css浏览器的兼容。
      overrideBrowserslist: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin()) // 压缩css
    .pipe(dest('./lib')); // 输出到lib下
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
