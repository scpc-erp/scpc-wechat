# 简单的日期时间选择器

支持同时选择日期和时间，时间精度只支持选择到分钟。同时推荐我的其他组件[@buuug7/uniapp-components](https://www.npmjs.com/package/@buuug7/uniapp-components)。

## 安装

推荐从 npm 安装

```
npm install @buuug7/uniapp-components
```

或者将下载包 components 目录中的`simple-datetime-picker.vue`复制到你本地的组件目录中。

## 用法

在 template 中：

```vue
<simple-datetime-picker
  ref="myPicker"
  @submit="handleSubmit"
  :start-year="2000"
  :end-year="2030"
  color="red"
></simple-datetime-picker>
```

在 javascript 中：

```javascript
import simpleDatetimePicker from "@buuug7/uniapp-components/lib/simple-datetime-picker";

export default {
  components: {
    simpleDatetimePicker
  },
  data() {
    return {
      birthday: ""
    };
  },
  methods: {
    // 打开picker
    openDatetimePicker() {
      this.$refs.myPicker.show();
    },

    // 关闭picker
    closeDatetimePicker() {
      this.$refs.myPicker.hide();
    },

    handleSubmit(e) {
      console.log(e); // {year: "2019", month: "07", day: "17", hour: "15", minute: "21"}
      this.birthday = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
    }
  }
};
```

可以参考压缩包下面 pages/index/index.vue 中例子，通常情况下打开 picker 需要调用`this.$refs.refName.show()`，在选择完毕后 picker 会自动隐藏，不需要调用`this.$refs.refName.hide()`来手动隐藏。

别把插件放在其它组件里面去用，放最外层 view 下就行，例如不要把组件放 swiper 里面或者 v-for 里面等。

## 属性说明

- `start-year`，类型 `number`，选择开始年份
- `end-year`，类型 `number`, 选择结束年份
- `@submit`, 类型 `function`, 监听选择事件，
- `color`, 类型`string`, 选择按钮颜色
- `ref`，指定该 picker 的引用，方便打开关闭

## CHANGELOG

- 0.3.0
  - 增加`color`属性，可以更换按钮颜色
- 0.2.0
  - 增加从 npm 安装方式

## 插件目录
