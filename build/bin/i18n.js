'use strict';
/**
 * 根据 examples/i18n/page.json 和模版，生成不同语言的 demo，也就是官网 demo 展示国际化的处理。
 * examples/i18n/page.json 里面都有数字标示了需要国际化处理的地方
 *
 */
var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  try {
    // 使用fs.statSync()方法获取路径的详细信息
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    // 对应上 examples/pages/template 下的模板 每个tpl文件又都是符合SFC规范的Vue文件
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];
    // 将需要国际化处理的地方 通过正则匹配将模板中的占位符给替换掉，便于生成完整的 vue 文件
    // 处理流程也很简单：遍历examples/i18n/page.json，根据不同的数据结构把tpl文件的标志位，通过正则匹配出来，并替换成自己预先设定好的字段。
    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    fs.writeFileSync(outputPath, content);
  });
});
