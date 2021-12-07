<template>
  <aside class="el-aside" :style="{ width, margin, padding }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'ElAside',

    componentName: 'ElAside',

    props: {
      width: {
        type: String,
        default: '300px'
      },
      margin: {
        type: String,
        default: '0'
      },
      padding: {
        type: String,
        default: '0'
      }
    }
  };
</script>
