## HelloWorld 新增组件

组件说明信息

### 组建文档

可以创建各种类型的组件，本组件仅供测试使用


:::demo 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker
```html
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="组件名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item>
   <el-hello-world class="el-hello-world" name="world">我是新组件 hello-world 插槽内容</el-hello-world>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: ''
        }
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
