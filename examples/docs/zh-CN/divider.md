## Divider 分割线

区隔内容的分割线。

### 基础用法

对不同章节的文本段落进行分割。

:::demo
```html
<template>
  <div>
    <span>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</span>
    <el-divider></el-divider>
    <span>少量的邪恶足以抵消全部高贵的品质, 害得人声名狼藉</span>
      <el-divider line-type="dashed" ></el-divider>
    <span> 一个人毕其一生的努力,就是在整合他自童年时代起就已形成的性格。</span>
  </div>
</template>
```
:::

### 设置文案

可以在分割线上自定义文案内容。


:::demo
```html
<template>
  <div>
    <span>头上一片晴天，心中一个想念</span>
    <el-divider content-position="left">少年包青天</el-divider>
    <span>没有所谓玩笑，所有的玩笑都有认真的成分。</span>
    <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
    <span>要对这残缺的世界保持耐性,也别高估自己的完美。</span>
    <el-divider content-position="right">魔都</el-divider>
    <span>工匠精神，不会一味强调把客户当上帝</span>
    <el-divider line-type="dashed" content-position="left">帝都</el-divider>
    <span>世界上唯一不变的，就是一切都在变。</span>
    <el-divider line-type="dashed" >羊城</el-divider>
    <span>人生如果错了方向，停止就是进步。</span>
    <el-divider line-type="dashed" content-position="right">上帝之眼</el-divider>
    <span>人生没有彩排，每一天都是现场直播。</span>
  </div>
</template>
```
:::

### 垂直分割

:::demo
```html
<template>
  <div>
    <span>雨纷纷</span>
    <el-divider direction="vertical"></el-divider>
    <span>旧故里</span>
    <el-divider direction="vertical"></el-divider>
    <span>草木深</span>
  </div>
</template>
```
:::

### Divider Attributes
| 参数          | 说明        | 类型            | 可选值                 | 默认值   |
|-------------  |-----------|---------------- |---------------------|-------- |
| direction      | 设置分割线方向   | string  | horizontal / vertical |    horizontal     |
| content-position| 设置分割线文案的位置 | string  | left / right / center |  center |
| line-type      | 设置分割线的样式  | string  | solid / dashed |  solid |
