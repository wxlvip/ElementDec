<template>
  <div style="margin: 20px;">
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-hello-world class="el-hello-world" name="world" url="https://www.wxlvip.com/">我是新组件 hello-world 插槽内容</el-hello-world>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: 'Hello Element UI!'
      };
    }
  };
</script>
