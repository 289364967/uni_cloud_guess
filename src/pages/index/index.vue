<template>
  <view class="content">
    <image class="bg-image" src="../../static/bg.jpg" mode="scaleToFill" />
    <view class="box flex-row">
      <swiper class="swiper" :autoplay="true" interval="3000" duration="500">
        <swiper-item v-for="(item, index) in list" :key="index">
          <view class="swiper-item flex-row">
            <image class="image" :src="item" mode="heightFix" />
            <view class="mask"></view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="box-center">
      <view class="">
        <view class="home-title-1"> 我是预言帝 </view>
        <view class="home-title-2"> 国际米兰精酿啤酒 </view>
      </view>

      <view class="flex-row">
        <view class="button flex-row" hover-class="button-hover" @click="go">
          <!-- <van-image
            class="icon-button"
            width="3rem"
            height="3rem"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          /> -->
          <view class="">参与预言 </view>
        </view>
      </view>

      <view class="">
        <view class="">
          <view class="home-second-1"> 意大利原装进口 金色艾尔啤酒 </view>
          <view class="home-second-2"> 狂欢一夏 ~ 等你来抢 </view>
        </view>
        <view class="rule-title" @click="showRule = true"> 规则玩法 </view>
      </view>
    </view>
    <van-dialog
      use-slot
      title="规则玩法"
      :show="showRule"
      @close="showRule = false"
    >
      <view class="card-title">预测券获取</view>
      <view class="card-title-second">1. 线下消费一箱米兰金色艾尔啤酒</view>
      <view class="card-title-second">2. 找服务前台领取</view>
      <view class="card-title">福利预测</view>
      <view class="card-title-second">1. 消耗一张优惠券即可参与预测</view>
      <view class="card-title-second">2. 世界杯结束即可开奖，获得指定的米兰券</view>
      <view class="card-title-second">3. 一张米兰券可兑换一箱米兰金色艾尔啤酒</view>

    </van-dialog>
  </view>
</template>

<script>
import { getUserProfile, getUser } from "@/plugins/util";
export default {
  data() {
    return {
      title: "Hello",
      code: null,
      login: false,
      showRule: false,

      list: [
        "cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/swipe (5).jpg",
        "cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/swipe (4).jpg",
        "cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/swipe (3).jpg",
        "cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/swipe (2).jpg",
      ],
      user: getUser(),
    };
  },
  onLoad() {
    const that = this;
    uni.login({
      success: function (res) {
        // 获取code
        console.log(JSON.stringify(res));
        that.code = res.code;
      },
    });
  },
  methods: {
    go() {
      var that = this;
      console.log(this.user);
      if (this.user._id) {
        console.log("i m login");
        uni.navigateTo({
          url: "/pages/index/guess",
        });
      } else {
        getUserProfile(that.code).then((res) => {
          that.user = res.result.data;
          uni.hideLoading();
          console.log(res);
        });
        // this.getUserProfile(code);
      }
    },
  },
};
</script>

<style>
.content {
}
.box {
  padding: 20rpx 0;
}
.swiper {
  height: 400rpx;
  width: 90vw;
}
.swiper-item {
  height: 100%;
  position: relative;
}
.mask {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 200rpx;
  width: 100vw;
  /* background: linear-gradient(#ffffff00, #ffffff); */
  background: linear-gradient(#00173600, #0047a3);
}
.image {
  width: 100vw;
  height: 400rpx;
}
.box-center {
  padding: 80rpx 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - 400rpx - 200rpx);
  position: relative;
}
.home-title-1 {
  font-size: 3.5rem;
  text-align: center;
  color: gold;
  letter-spacing: 0.4rem;
  text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777,
    0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333,
    0px 8px 7px #001135;
}
.home-title-2 {
  font-size: 1.5rem;
  text-align: center;
  color: gold;
  letter-spacing: 0.1rem;
  text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777,
    0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333,
    0px 8px 7px #001135;
}
.home-second-1 {
  text-align: center;
  font-size: 1.2rem;
  text-align: center;
  color: #ebf0f3;
  letter-spacing: 0;
}
.home-second-2 {
  font-weight: bold;
  text-align: center;
  font-size: 1.3rem;
  text-align: center;
  color: #ebf0f3;
  letter-spacing: 0;
}
.bg-image {
  width: 100vw;
  height: 100vh;
  /* height: calc( 100vh - 400rpx ); */
  position: absolute;
  top: 0;
  left: 0;
  z-index: -99;
}
.button {
  width: 240rpx;
  height: 80rpx;
  position: relative;
  color: #ebf0f3;
  padding: 10rpx 20rpx;
  /* background-image: linear-gradient(#f5c153, #ea920d); */
  background-image: linear-gradient(#001736, #0047a3);
  padding: 0.3em 0.5em;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3em;
  box-shadow: 0 1px white inset;
  text-align: center;
  text-shadow: 0 1px 1px black;
  color: white;
  font-weight: bold;
  font-size: 1.3rem;
  letter-spacing: 0.3rem;
}
.icon-button {
  position: absolute;
  right: 0;
  top: 0;
}
.rule-title {
  text-align: center;
  font-size: 1rem;
  text-decoration: underline;
  color: orange;
}
</style>
