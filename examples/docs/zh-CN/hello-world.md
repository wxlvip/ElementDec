## HelloWorld 新增组件

组件说明信息

### 组建文档

可以创建各种类型的组件，本组件仅供测试使用


:::demo 在 Hello World组件中，包括 name、url 属性
```html
<el-hello-world class="el-hello-world" name="world" url="https://www.baidu.com/">我是新组件 hello-world 插槽内容</el-hello-world>
<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
```
:::
