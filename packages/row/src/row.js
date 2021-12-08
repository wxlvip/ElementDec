export default {
  name: 'ElRow',

  componentName: 'ElRow',

  props: {
    tag: { // 自定义元素标签
      type: String,
      default: 'div'
    },
    gutter: Number, // 栅格间隔
    type: String, // 布局模式，可选 flex，现代浏览器下有效
    justify: { // flex 布局下的水平排列方式
      type: String,
      default: 'start'
    },
    align: String // flex 布局下的垂直排列方式
  },

  computed: {
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    }
  },

  render(h) {
    return h(this.tag, {
      class: [
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default);
  }
};
