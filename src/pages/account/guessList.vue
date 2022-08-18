<template>
  <view class="content">
    <view class="card-box">
      <!-- <view class="flex-row-between card-item">
        <van-image
          fit="contain"
          width="4rem"
          height="4rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view style="width: 40%">
          <view class="card-title">巴西 1：5</view>
          <view class="card-title-second">vertify date</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title">积分 - 100</view>
        </view>
      </view> -->

      <view
        class="flex-row-between card-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <van-image
          fit="contain"
          width="4rem"
          height="4rem"
          :src="item.city_img"
        />
        <view style="width: 40%">
          <view class="card-title">{{
            `${item.city_name} ${item.city_rate}`
          }}</view>
          <view class="card-title-second">{{ item.date }}</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title">预测券 - {{ item.intoIntegral }}</view>
        </view>
      </view>
    </view>
    <view></view>
    <view></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  onLoad: function (option) {
    const that = this;
    wx.cloud
      .callFunction({
        // 要调用的云函数名称
        name: "business",
        // 传递给云函数的 event 参数
        data: {
          type: "getGuess",
        },
      })
      .then((res) => {
        console.log(res);
        that.list = res.result;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  onShow: function () {},
  methods: {},
};
</script>

<style scoped>
.card-box {
  margin: 20rpx;
}
.card-item {
  padding: 10rpx;
  margin-bottom: 10rpx;
  border-bottom: 1px solid #ddd;
}
</style>
