<template>
  <div class="mti-hello-world">
    Hello, <a :href="url" target="_blank">{{ name }}</a>
    <span><slot></slot></span>
  </div>
</template>
<script>
export default {
  name: 'MtiHelloWorld',
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
