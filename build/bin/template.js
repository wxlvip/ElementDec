/**
 * tpl后缀模板文件的处理 当文件有所改变的时候，执行 `npm run i18n` 进行文件国际化处理
 */
const path = require('path');
// 加载页面模板
const templates = path.resolve(process.cwd(), './examples/pages/template');
// Chokidar 是一个极简高效的跨平台文件查看器。
const chokidar = require('chokidar');
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
