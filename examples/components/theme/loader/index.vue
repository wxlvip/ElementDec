<script>
import objectAssign from 'object-assign';
import generateColors from '../color';
import bus from '../../../bus.js';
import Loading from './loading';
import DocStyle from './docStyle';
import { updateVars } from './api.js';
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
    // this.getSeparatedStyles();
    // this.getFontFiles();
  },
  mounted() {
    this.checkLocalThemeConfig();
    bus.$on(ACTION_APPLY_THEME, val => {
      this.userConfig = val;
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
      lastApply: 0,
      originalStyle: '' // 主题模板
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
    // 配置数据 要保存的主题名称
    onDownload(themeConfig, themeName) {
      this.triggertProgressBar(true);
      // 访问的更新的方法，但参数传了 download: true 则是下载，不传则返回 css 样式数据
      updateVars(
        Object.assign({}, themeConfig, { download: true }),
        xhr => {
          xhr.responseType = 'blob';
        }
      ).then()
        .catch((err) => {
          this.onError(err);
        })
        .then(() => {
          this.triggertProgressBar(false);
        });
      // examples/extension/src/app.js 定义的 window 方法 打印参数
      ga('send', 'event', 'ThemeConfigurator', 'Download', themeName);
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
      // this.primaryColor = this.colors.primary // #9FF50B
      this.primaryColor = this.userConfig.global['$--color-primary']; // #9FF50B
      this.colors = objectAssign({}, this.colors, generateColors(this.primaryColor));
      // console.log('this.colors:', this.colors);
      console.log('93行');
      let res = this.NewStyle();
      this.applyStyle(res, time);
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
      let cssText = this.originalStyle;
      // console.log('writeNewStyle-cssText-处理前:', cssText); // 主题色是用 primary 占位符
      Object.keys(this.colors).forEach(key => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]);
      });
      // console.log('writeNewStyle-cssText-处理后:', cssText); // 主题色是用正则匹配将 primary 占位符给替换掉
      return cssText;
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
