<script>
import objectAssign from 'object-assign';
import * as blobUtil from 'blob-util';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import generateColors from '../color';
import bus from '../../../bus.js';
import Loading from './loading';
import DocStyle from './docStyle';
// import { updateVars } from './api.js';
import { updateDomHeadStyle } from '../utils.js';
import {
  ACTION_APPLY_THEME,
  ACTION_DOWNLOAD_THEME,
  ACTION_USER_CONFIG_UPDATE
} from '../constant.js';
import {
  loadUserThemeFromLocal,
  loadPreviewFromLocal
} from '../localstorage.js';
import { getActionDisplayName } from '../../theme-configurator/utils/utils';

export default {
  mixins: [Loading, DocStyle],
  created() {
    this.getIndexStyle();
    this.getSeparatedStyles();
    // this.getFontFiles();
  },
  mounted() {
    this.checkLocalThemeConfig();
    bus.$on(ACTION_APPLY_THEME, (val, dfConfig) => {
      this.userConfig = val;
      this.defaultConfig = dfConfig;
      this.onAction();
    });
    // 定义 ACTION_DOWNLOAD_THEME 事件
    bus.$on(ACTION_DOWNLOAD_THEME, (themeConfig, themeName) => {
      this.onDownload(themeConfig, themeName);
    });
  },
  data() {
    return {
      userConfig: {},
      finaAttrConfig: {},
      lastApply: 0,
      originalStyle: '', // 主题模板
      styleFiles: [], // 所有模板数据
      fontFiles: ['element-icons.ttf', 'element-icons.woff'],
      zip: null
    };
  },
  methods: {
    // 获取到新主题后操作的方法
    applyStyle(res, time) {
      if (time < this.lastApply) return;
      this.updateDocs(() => {
        // 将样式动态插入到 head 标签的底部一个 id 为 chalk-style 的样式标签中，达到更新页面样式效果
        // 方法路径 examples/components/theme/utils.js
        updateDomHeadStyle('chalk-style', res);
      });
      this.lastApply = time;
    },
    // 初始化JS打包工具并下载字体文件
    resetZip() {
      this.zip = new JSZip();
      // this.fonts.forEach((font, index) => {
      //   console.log(font, index);
      //   // this.zip.file(`fonts/${this.fontFiles[index]}`, font.data);
      // });
    },
    // 配置数据 要保存的主题名称
    onDownload(themeConfig, themeName) {
      let userConfig = this.finaAttrConfig;
      this.resetZip();
      this.styleFiles.forEach(file => {
        let cssText = file.data;
        Object.keys(userConfig).forEach(key => {
          // console.log(key + '==》' + userConfig[key]);
          const value = userConfig[key];
          cssText = cssText.split(key).join(value);
          // cssText = cssText.replace(new RegExp(key, 'g'), value);
        });
        // console.log(cssText);
        const css = blobUtil.createBlob([cssText], { type: 'text/css' });
        this.zip.file(file.name, css);
      });
      this.zip.generateAsync({ type: 'blob' })
        .then(blob => {
          FileSaver.saveAs(blob, `element-${this.primaryColor}.zip`);
        });
      // this.triggertProgressBar(true);
      // // 访问的更新的方法，但参数传了 download: true 则是下载，不传则返回 css 样式数据
      // updateVars(
      //   Object.assign({}, themeConfig, { download: true }),
      //   xhr => {
      //     xhr.responseType = 'blob';
      //   }
      // ).then()
      //   .catch((err) => {
      //     this.onError(err);
      //   })
      //   .then(() => {
      //     this.triggertProgressBar(false);
      //   });
      // examples/extension/src/app.js 定义的 window 方法 打印参数
      // ga('send', 'event', 'ThemeConfigurator', 'Download', themeName);
    },
    /**
     *  this.userConfig:
     * {
     *     "global": {
     *         "$--color-primary": "#3EEA09"
     *     },
     *     "local": {}
     * }
     *
     */
    onAction() {
      // 提交变更的配置值作为参数并请求返回改变后的css样式值 参数 this.userConfig
      const time = +new Date();
      console.log('this.userConfig:', this.userConfig, this.userConfig.global['$--color-primary']);
      // this.primaryColor = this.colors.primary; // #9FF50B
      this.primaryColor = this.userConfig.global['$--color-primary']; // #9FF50B
      this.colors = objectAssign({}, this.colors, generateColors(this.primaryColor));
      console.log('93行');
      /* 此时生成 finaAttrConfig 最终合并好的属性配置*/
      // 默认值在该页面 examples/components/theme-configurator/index.vue
      // 将用户属性配置同默认属性配置进行合并
      // console.log('golbalColor-134:', this.defaultConfig);
      // 处理默认属性配置及值
      // let defaultConfig = {};
      if (this.defaultConfig) {
        let global = {};
        let local = {};
        // const globalArr = ['color', 'typography', 'border'];
        this.defaultConfig.forEach((item) => {
          if (item.name === 'color' || item.name === 'typography' || item.name === 'border') {
            item.config.forEach((c) => {
              global[c['key']] = c['value'];
            });
          } else {
            item.config.forEach((c) => {
              local[c['key']] = c['value'];
            });
          }
        });
        // defaultConfig.global = global;
        // defaultConfig.local = local;
        // console.log('defaultConfig默认值的:', defaultConfig);
        // 将系统生成的用户数据 转换成 所需要的数据格式
        // let userConfig = this.userConfig ? {...this.userConfig.global, ...this.userConfig.local} : {};
        for (var i in this.userConfig.global) {
          // 如果存在则直接替换掉值 不存在值为-1 如果不存在则追加
          if (JSON.stringify(global).indexOf(i) !== -1) {
            global[i] = this.userConfig.global[i];
          } else {
            global[i] = this.userConfig.global[i];
          }
        }
        local = {...local, ...this.userConfig.local};
        // 因为 local 中存在 引用 global 的变量 所以要替换掉
        for (var l in global) {
          for (var f in local) {
            if (l === local[f]) {
              local[f] = global[l];
            }
          }
        }
        this.finaAttrConfig = {...global, ...local};
        // let finaAttrConfig = this.finaAttrConfig ? {...this.finaAttrConfig.global, ...this.finaAttrConfig.local} : {};
        // for (var j in this.userConfig.local) {
        //   // 如果存在则直接替换掉值 不存在值为-1 如果不存在则追加
        //   if (JSON.stringify(defaultConfig['local']).indexOf(j) !== -1) {
        //     defaultConfig['local'][j] = this.userConfig.local[j];
        //   } else {
        //     defaultConfig['local'][j] = this.userConfig.local[j];
        //   }
        // }
        // console.log('defaultConfig替换后的:', defaultConfig);
        // 最终用于生成主题的配置
        // this.finaAttrConfig = defaultConfig;
        let res = this.NewStyle();
        this.applyStyle(res, time);
      }
      /* this.triggertProgressBar(true);
      const time = +new Date();
      updateVars(this.userConfig)
        .then(res => {
          this.applyStyle(res, time);
        })
        .catch(err => {
          this.onError(err);
        })
        .then(() => {
          this.triggertProgressBar(false);
        });*/
    },
    // 更改页面主题样式 通过将新生成的样式写入到页面覆盖掉原有样式达到样式的修改效果
    NewStyle() {
      // let cssText = this.originalStyle;
      // // console.log('writeNewStyle-cssText-处理前:', cssText); // 主题色是用 primary 占位符
      // Object.keys(this.colors).forEach(key => {
      //   cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]);
      // });
      // console.log('writeNewStyle-cssText-处理后:', cssText); // 主题色是用正则匹配将 primary 占位符给替换掉
      /* 新的处理方案 */
      // 1.this.styleFiles 由它来生成 index.css 样式模板
      // console.log(this.styleFiles);
      let indexTpl = '';
      // console.log(this.defaultConfig, this.styleFiles);

      Object.keys(this.defaultConfig).forEach(key => {
        // console.log(this.defaultConfig[key]['name'] + '.css');
        Object.keys(this.styleFiles).forEach(i => {
          if (this.defaultConfig[key]['name'] + '.css' === this.styleFiles[i]['name']) {
            // console.log(this.styleFiles[i]['name']);
            indexTpl += this.styleFiles[i].data.split('@charset "UTF-8";').join('');
          }
        });
      });
      // for (var i in this.styleFiles) {
      //   indexTpl += this.styleFiles[i].data.split('@charset "UTF-8";').join('');
      // }
      indexTpl = '@charset "UTF-8";' + indexTpl;
      // console.log(indexTpl);
      // 2.将处理好的新用户数据 应用于模板中 替换数据 需要配置(this.finaAttrConfig) && 模板(indexTpl)
      // console.log(this.finaAttrConfig);
      // for (var l in this.finaAttrConfig['global']) {
      //   for (var f in this.finaAttrConfig['local']) {
      //
      //     if (l === this.finaAttrConfig['local'][f]) {
      //       this.finaAttrConfig['local'][f] = this.finaAttrConfig['global'][l];
      //     }
      //   }
      // }
      // let finaAttrConfig = this.finaAttrConfig ? {...this.finaAttrConfig.global, ...this.finaAttrConfig.local} : {};
      // console.log(this.finaAttrConfig);
      // eslint-disable-next-line no-unused-vars
      var cssText = indexTpl;
      /*
      for (var key in finaAttrConfig) {
        console.log(key, '==>', finaAttrConfig[key]);
        // let regExp = new RegExp(key, 'g'); // 正则表达式方法，完全匹配对应的关键字，且声明全局
        // cssText = indexTpl.replace(regExp, finaAttrConfig[key]);
        cssText = indexTpl.split(key).join(finaAttrConfig[key]);
      }*/
      Object.keys(this.finaAttrConfig).forEach(key => {

        // cssText = cssText.split(key).join(finaAttrConfig[key]);
        cssText = cssText.replace(new RegExp(key, 'gi'), this.finaAttrConfig[key]);
        // cssText = JSON.stringify(indexTpl).split(key).join(finaAttrConfig[key]);
        // cssText = JSON.stringify(indexTpl).replace(new RegExp('(:|\\s+)' + key, 'g'), finaAttrConfig[key]);
      });
      // console.log('cssText-2:', cssText);
      /* for (var keyed in this.finaAttrConfig['global']) {
       console.log(keyed, '==>', this.finaAttrConfig['global'][keyed]);
       let regExp = new RegExp(keyed, 'g'); // 正则表达式方法，完全匹配对应的关键字，且声明全局
       cssText = cssText.replace(regExp, this.finaAttrConfig['global'][keyed]);
       // cssText = cssText.split(keyed).join(this.finaAttrConfig['global'][keyed]);
     }*/
      // Object.keys(this.finaAttrConfig['local']).forEach(key => {
      //   const value = this.finaAttrConfig['local'][key];
      //   cssText = indexTpl.split(key).join(value);
      //   // cssText = indexTpl.replace(new RegExp(key, 'g'), value);
      // });
      // console.log('cssText-1:', cssText);
      // Object.keys(this.finaAttrConfig['global']).forEach(keyed => {
      //   console.log(keyed + '==local==》' + this.finaAttrConfig['local'][keyed]);
      //   // console.log(key + '==》' + this.finaAttrConfig[key]);
      //   const valued = this.finaAttrConfig['global'][keyed];
      //   cssText = cssText.split(keyed).join(valued);
      //   // cssText = cssText.replace(new RegExp(key, 'g'), value);
      // });

      // 3.将已处理模板拼接成 cssText 并返回
      /* 新的处理方案 */
      return cssText;
      // return '';
      // if (this.originalStylesheetCount === document.styleSheets.length) {
      //   const style = document.createElement('style')
      //   style.innerText = cssText
      //   document.head.appendChild(style)
      // } else {
      //   document.head.lastChild.innerText = cssText
      // }
    },
    // 获取远程官方主题并生成主题模板文件
    getIndexStyle() {
      this.getFile('//unpkg.com/element-ui/lib/theme-chalk/index.css')
        .then(({ data }) => {
          this.originalStyle = this.getStyleTemplate(data);
        });
      // 获取 css 模板文件，并合并成 index.css 模板文件
      // var path = require('path');
      // var fs = require('fs');
      // var content = fs.readFileSync(path.join(__dirname, '../tpl/alert.css'), 'utf8');
      // console.log('content:', content);
    },
    // 初始化页面的时候，获取所有组件的 css 样式模板，并生成 index.css 样式模板
    getSeparatedStyles() {
      var path = require('path');
      // var content = fs.readFileSync(path.join(__dirname, '../tpl/alert.css'), 'utf8');
      this.getFile('//unpkg.com/element-ui/lib/theme-chalk/')
        .then(({ data }) => {
          // console.log('getSeparatedStyles:', data); // 获取页面内容
          // 通过正则匹配 提取页面中的 css 文件名
          return data.match(/href="[\w-]+\.css"/g).map(str => str.split('"')[1]);
        })
        .then(styleFiles => {
          // console.log('getSeparatedStyles:', styleFiles);
          return window.Promise.all(styleFiles.map(file => {
            return this.getFile(path.join(__dirname, `../tpl/${file}`));
          }));
        })
        .then(files => {
          // console.log('getSeparatedStyles:', files);
          // let cssText = '';
          this.styleFiles = files.map(file => {
            // 合并 css 模板样式，形成 index.css 样式模板
            // console.log(file.data);
            // eslint-disable-next-line
            // cssText.concat(file.data.split('@charset "UTF-8";').join(''));
            // console.log(cssText);
            return {
              name: file.url,
              // data: this.getStyleTemplate(file.data)
              data: file.data
            };
          });
        });
    },
    getFile(url, isBlob = false) {
      return new window.Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.responseType = isBlob ? 'blob' : '';
        client.onreadystatechange = () => {
          if (client.readyState !== 4) {
            return;
          }
          if (client.status === 200) {
            const urlArr = client.responseURL.split('/');
            resolve({
              data: client.response,
              url: urlArr[urlArr.length - 1]
            });
          } else {
            reject(new Error(client.statusText));
          }
        };
        client.open('GET', url);
        client.send();
      });
    },
    // 将官方主题 色调用占位符替换掉生成模板
    getStyleTemplate(data) {
      const colorMap = {
        '#3a8ee6': 'shade-1',
        '#409eff': 'primary',
        '#53a8ff': 'light-1',
        '#66b1ff': 'light-2',
        '#79bbff': 'light-3',
        '#8cc5ff': 'light-4',
        '#a0cfff': 'light-5',
        '#b3d8ff': 'light-6',
        '#c6e2ff': 'light-7',
        '#d9ecff': 'light-8',
        '#ecf5ff': 'light-9'
      };
      Object.keys(colorMap).forEach(key => {
        const value = colorMap[key];
        data = data.replace(new RegExp(key, 'ig'), value);
      });
      return data;
    },
    onError(err) {
      let message;
      try {
        message = JSON.parse(err).message;
      } catch (e) {
        message = err;
      }
      this.$message.error(message);
    },
    triggertProgressBar(isLoading) {
      bus.$emit('user-theme-config-loading', isLoading);
    },
    updateDocs(cb) {
      window.userThemeConfig = JSON.parse(JSON.stringify(this.userConfig));
      bus.$emit(ACTION_USER_CONFIG_UPDATE, this.userConfig);
      this.updateDocStyle(this.userConfig, cb);
    },
    checkLocalThemeConfig() {
      // load user local theme
      const previewConfig = loadPreviewFromLocal();
      if (previewConfig.type === 'user') {
        const userConfig = loadUserThemeFromLocal();
        this.$message(getActionDisplayName('load-local-theme-config'));
        const config = userConfig.filter(theme => (theme.name === previewConfig.name));
        if (config && config[0]) {
          this.userConfig = JSON.parse(config[0].theme);
          this.onAction();
        }
      }
    }
  }
};
</script>
