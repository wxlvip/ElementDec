<template>
  <div style="margin: 20px;">
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <mti-hello-world effect="dark" name="world" url="https://www.wxlvip.com/">我是新组件 hello-world 插槽内容
      <el-button class="mti-alert__btn">主题测试</el-button>
    </mti-hello-world>
    <el-button type="primary">提交</el-button>
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
