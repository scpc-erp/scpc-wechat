<template>
   <view class="datetime-picker">
      <view
         class="mask"
         :class="{ show: open }"
         @touchmove.stop.prevent
         catchtouchmove="true"
      ></view>
      <view class="wrap" :class="{ show: open }">
         <view class="picker-header" @touchmove.stop.prevent catchtouchmove="true">
            <view
               class="btn-picker cancel"
               :style="{ color: color }"
               @click="open = false"
            >取消</view
            >
            <view
               class="btn-picker submit"
               :style="{ backgroundColor: color }"
               @click="_onSubmit"
            >确定</view
            >
         </view>
         <view class="picker-body">
            <picker-view :value="value" @change="_onChange">
               <picker-view-column>
                  <view class="column-item" v-for="item in years">
                     {{ item }}年
                  </view>
               </picker-view-column>
               <picker-view-column>
                  <view class="column-item" v-for="item in months">
                     {{ item | formatNum }}月
                  </view>
               </picker-view-column>
               <picker-view-column>
                  <view class="column-item" v-for="item in days">
                     {{ item | formatNum }}日
                  </view>
               </picker-view-column>
               <picker-view-column>
                  <view class="column-item" v-for="item in hours">
                     {{ item | formatNum }}时
                  </view>
               </picker-view-column>
               <picker-view-column>
                  <view class="column-item" v-for="item in minutes">
                     {{ item | formatNum }}分
                  </view>
               </picker-view-column>
            </picker-view>
         </view>
      </view>
   </view>
</template>

<script>
const formatNum = num => {
   return num < 10 ? "0" + num : num + "";
};

export default {
   name: "simple-datetime-picker",
   props: {
      startYear: {
         type: Number,
         default: 2000
      },
      endYear: {
         type: Number,
         default: 2030
      },
      color: {
         type: String,
         default: ""
      }
   },
   data() {
      return {
         open: false,
         years: [],
         months: [],
         days: [],
         hours: [],
         minutes: [],

         currentDate: new Date(),
         year: "",
         month: "",
         day: "",
         hour: "",
         minute: "",

         value: [0, 0, 0, 0, 0]
      };
   },

   mounted() {
      this.init();
   },

   watch: {
      month() {
         this.initDays();
      }
   },

   filters: {
      formatNum(num) {
         return formatNum(num);
      }
   },

   methods: {
      init() {
         this.initYears();
         this.initMonths();
         this.initDays();
         this.initHours();
         this.initMinutes();
         this.setSelectValue();
      },

      initYears() {
         let years = [];
         for (let i = this.startYear; i <= this.endYear; i++) {
            years.push(i);
            if (this.currentDate.getFullYear() === i) {
               this.$set(this.value, 0, i - this.startYear);
            }
         }
         this.years = years;
      },

      initMonths() {
         let months = [];
         for (let i = 1; i <= 12; i++) {
            months.push(i);
            if (this.currentDate.getMonth() + 1 === i) {
               this.$set(this.value, 1, i - 1);
            }
         }
         this.months = months;
      },

      initDays() {
         let selectedYear = this.years[this.value[0]];
         let selectedMonth = this.months[this.value[1]];

         let days = [];
         let totalDays = new Date(selectedYear, selectedMonth, 0).getDate();

         for (let i = 1; i <= totalDays; i++) {
            days.push(i);
            if (this.currentDate.getDate() === i) {
               this.$set(this.value, 2, i - 1);
            }
         }
         this.days = days;
      },

      initHours() {
         let hours = [];
         for (let i = 0; i <= 23; i++) {
            hours.push(i);
            if (this.currentDate.getHours() === i) {
               this.$set(this.value, 3, i);
            }
         }
         this.hours = hours;
      },

      initMinutes() {
         let minutes = [];
         for (let i = 0; i < 60; i++) {
            minutes.push(i);
            if (this.currentDate.getMinutes() === i) {
               this.$set(this.value, 4, i);
            }
         }
         this.minutes = minutes;
      },

      show() {
         this.open = true;
      },

      hide() {
         this.open = false;
      },

      _onChange(e) {
         const value = e.detail.value;
         this.value = e.detail.value;
         this.setSelectValue();
      },

      setSelectValue() {
         this.year = this.years[this.value[0]];
         this.month = this.months[this.value[1]];
         this.day = this.days[this.value[2]];
         this.hour = this.hours[this.value[3]];
         this.minute = this.minutes[this.value[4]];
      },

      _onSubmit() {
         const result = {
            year: formatNum(this.year),
            month: formatNum(this.month),
            day: formatNum(this.day),
            hour: formatNum(this.hour),
            minute: formatNum(this.minute)
         };
         this.$emit("submit", result);
         this.hide();
      }
   }
};
</script>

<style lang="scss">
$transition: all 0.3s ease;
$primary: #488ee9;

.datetime-picker {
   position: relative;
   z-index: 999;

   picker-view {
      height: 100%;
   }

   .mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.6);
      visibility: hidden;
      opacity: 0;
      transition: $transition;
      &.show {
         visibility: visible;
         opacity: 1;
      }
   }

   .wrap {
      z-index: 1001;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      transition: $transition;
      transform: translateY(100%);
      &.show {
         transform: translateY(0);
      }
   }

   .picker-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 8px 8px;
      background-color: darken(#fff, 2%);
      background-color: #fff;
   }

   .picker-body {
      width: 100%;
      height: 420rpx;
      overflow: hidden;
      background-color: #fff;
   }

   .column-item {
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
   }

   .btn-picker {
      position: relative;
      display: inline-block;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      text-align: center;
      text-decoration: none;
      line-height: 2;
      -webkit-tap-highlight-color: transparent;
      overflow: hidden;
      background-color: #f8f8f8;
      font-size: 14px;
      border-radius: 2px;
      color: $primary;
   }

   .btn-picker.submit {
      background-color: $primary;
      color: #fff;
   }
}
</style>
