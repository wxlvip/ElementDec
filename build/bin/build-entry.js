/**
 * 根据components.json文件，生成src/index.js文件，核心就是json-templater/string插件的使用。
 * 可以看下src/index.js文件，他对应的是项目的入口文件，最上面有这样一句： Automatically generated by './build/bin/build-entry.js'
 * 也就是src/index.js文件是由build/bin/build-entry.js脚本自动构建的。
 */
// 引入所有组件的依赖关系
var Components = require('../../components.json');
var fs = require('fs');
// https://www.npmjs.com/package/json-templater 可以让string与变量结合 输出一些内容
var render = require('json-templater/string');
// https://github.com/SamVerschueren/uppercamelcase  转化为驼峰 foo-bar >> FooBar
var uppercamelcase = require('uppercamelcase');
var path = require('path');
// os.EOL属性是一个常量，返回当前操作系统的换行符（Windows系统是\r\n，其他系统是\n）
var endOfLine = require('os').EOL;
// 生成文件的名字和路径
var OUTPUT_PATH = path.join(__dirname, '../../src/index.js');
// 生成文件的模板
var IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\';';
var INSTALL_COMPONENT_TEMPLATE = '  {{name}}';
var MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */
// 导入了packages下的所有组件
{{include}}
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
{{install}},
  CollapseTransition
];
// 提供了install方法，帮我们挂载了一些组件与变量
const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  // 把所有的组件注册到Vue上面
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
// 导出版本号、install方法（插件）、以及一些功能比如国际化功能
export default {
  version: '{{version}}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
{{list}}
};
`;

delete Components.font;

var ComponentNames = Object.keys(Components);

var includeComponentTemplate = [];
var installTemplate = [];
var listTemplate = [];

ComponentNames.forEach(name => {
  // 转化成驼峰命名 foo-bar >> FooBar
  var componentName = uppercamelcase(name);

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  if (['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
});
// 模板拼接
var template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
});
// 结果输出到src/index.js中
fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);

