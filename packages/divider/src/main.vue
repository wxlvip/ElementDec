<template functional>
  <div
    v-bind="data.attrs"
    v-on="listeners"
    :class="[data.staticClass, 'el-divider', `el-divider--${props.direction}`, props.lineType === 'dashed'
    ?`is-${props.lineType}`:'']"
  >
    <div
      v-if="slots().default && props.direction !== 'vertical'"
      :class="['el-divider__text', `is-${props.contentPosition}`, props.lineType === 'dashed'?`is-${props.lineType}`:'']"
     >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElDivider',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    },
    contentPosition: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].indexOf(val) !== -1;
      }
    },
    // solid (直线式边框 默认) dotted (点线式边框) dashed (破折线式边框) double (双线式边框) groove (槽线式边框) ridge(脊线式边框) inset (内嵌效果的边框) outset (突起效果的边框)
    lineType: {
      type: String,
      default: 'solid',
      validator(val) {
        return ['solid', 'dashed'].indexOf(val) !== -1;
      }
    }
  }
};

</script>
