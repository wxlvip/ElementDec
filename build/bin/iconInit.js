'use strict';

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
// 获取 packages/theme-chalk/src/icon.scss 文件内容
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
// postcss 解析 css 返回对象的 nodes 属性
/* 解析后的值样式
[Rule {
    raws: { before: '\n\n', between: ' ', semicolon: true, after: '\n' },
    type: 'rule',
    nodes: [ [Declaration] ],
    parent: Root {
      raws: [Object],
      type: 'root',
      nodes: [Circular *1],
      source: [Object]
    },
    source: { start: [Object], input: [Input], end: [Object] },
    selector: '.el-icon-chat-dot-round:before'
  },
  Rule {
    raws: { before: '\n\n', between: ' ', semicolon: true, after: '\n' },
    type: 'rule',
    nodes: [ [Declaration] ],
    parent: Root {
      raws: [Object],
      type: 'root',
      nodes: [Circular *1],
      source: [Object]
    },
    source: { start: [Object], input: [Input], end: [Object] },
    selector: '.el-icon-chat-square:before'
  }]
 */
var nodes = postcss.parse(fontFile).nodes;
var classList = [];
// console.log('node父节点：', nodes);
nodes.forEach((node) => {
  // 对应值：.el-icon-user:before
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);
  /* 以下为 arr 的值，用于提取 .el-icon-user:before 的非公共部分 user
  [
  '.el-icon-user:before',
  'user',
  index: 0,
  input: '.el-icon-user:before',
  groups: undefined
 ]
 */
  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列
// 生成 examples/icon.json 文件，用于后续页面图标遍历展示
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
