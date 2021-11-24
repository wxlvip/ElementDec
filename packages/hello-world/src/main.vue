<template>
  <div class="el-hello-world">
    Hello, <a :href="url" target="_blank">{{ name }}</a>
    <span><slot></slot></span>
  </div>
</template>
<script>
export default {
  name: 'ElHelloWorld',
  props: ['name', 'url'],
  // props: {
  //   name: String,
  //   url: String
  // },
  data() {
    return {};
  }
};
</script>
