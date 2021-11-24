<template>
  <div class="el-hello-world">
    Hello, <a href="#">{{ name }}</a>
    <span><slot></slot></span>
  </div>
</template>
<script>
export default {
  name: 'ElHelloWorld',
  props: ['name'],
  data() {
    return {};
  }
};
</script>
