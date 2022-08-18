<template>
  <view class="content">
    <image class="bg-image" src="../../static/bg.jpg" mode="scaleToFill" />
    <view class="top flex-col-center">
      <image
        class="top-bg"
        src="cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/swipe (5).jpg"
        mode="aspectFit"
      />

      <view class="home-title-1"> 强强对决 </view>
      <view class="home-title-2"> 你说谁赢就谁赢 </view>
    </view>

    <scroll-view @scroll="onScroll" scroll-y id="scroller" class="scroller">
      <view class="item flex-row" v-for="(item, index) in list" :key="index">
        <view class="left flex-row">
          <van-image fit="contain" width="4rem" height="4rem" :src="item.img" />
          <view class="">
            <view class="card-title">{{ item.name }}</view>
            <view class="card-title-second"> 艾尔啤酒+{{ item.rate }}箱 </view>
          </view>
        </view>
        <view class="right flex-row">
          <image
            class="button-bg"
            src="../../static/guess.jpg"
            mode="aspectFit"
          />

          <van-button
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
            round
            size="small"
            type="info"
            @click="guess(item)"
            >我要预测他</van-button
          >
        </view>
      </view>
    </scroll-view>

    <!-- <view class="bottom"></view> -->
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
        name: "city",
        // 传递给云函数的 event 参数
        data: {
          type: "getList",
        },
      })
      .then((res) => {
        that.list = res.result.data;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  onShow: function () {},
  methods: {
    onScroll(event) {
      wx.createSelectorQuery()
        .select("#scroller")
        .boundingClientRect((res) => {})
        .exec();
    },
    guess(city) {
      wx.showLoading({
        title: "正在执行",
      });

      const that = this;
      wx.cloud
        .callFunction({
          // 要调用的云函数名称
          name: "business",
          // 传递给云函数的 event 参数
          data: {
            type: "addGuess",
            city_id: city._id,
            city_name: city.name,
            city_img: city.img,
            city_rate: city.rate,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.result.message) {
            wx.showToast({
              title: "积分不足",
              icon: "error",
              duration: 2000,
            });
          } else {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          wx.showToast({
            title: "失败",
            icon: "error",
            duration: 2000,
          });
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100vh;
  /* background-color: brown; */
}
.top {
  height: 20vh;
}
.top-bg {
  width: 100%;
  position: absolute;
  z-index: -88;
}
.scroller {
  height: 75vh;
}
.item {
  height: 120rpx;
  margin: 0 20rpx 10rpx;
}
.left {
  background-color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height: 100%;
  width: 70%;
}
.right {
  position: relative;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 100%;
  /* background-color: pink; */
  width: 30%;
}
.button-bg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -88;
}
.bottom {
  height: 10vh;
  background-color: aquamarine;
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
</style>
