<template>
   <view class="content">
      <view class="field">
         <view class="name">生日</view>
         <view class="value" @click="openDatetimePicker">{{
            birthday ? birthday : "请选择"
         }}</view>
      </view>

      <!--datetime picker-->
      <simple-datetime-picker
         ref="myPicker"
         @submit="handleSubmit"
         :start-year="2000"
         :end-year="2030"
         color="#488ee9"
      ></simple-datetime-picker>
   </view>
</template>

<script>

import simpleDatetimePicker from '@buuug7/uniapp-components/lib/simple-datetime-picker'

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

      // 监听选择
      handleSubmit(e) {
         console.log(e);
         this.birthday = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
      }
   }
};
</script>

<style>
.field {
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   padding: 5px;
}
</style>
