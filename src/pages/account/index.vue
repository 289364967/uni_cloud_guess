<template>
  <view class="content">
    <view class="top-box">
      <view class="flex-row">
        <van-image
          round
          fit="cover"
          width="4rem"
          height="4rem"
          :src="user.avatar"
        />
        <view class="user-right flex-row-between">
          <view class="">
            <view class="title">{{ user.name }}</view>
            <view class="title">代理商</view>
          </view>
          <view class="title" @click="showID = true">
            <van-icon name="qr" size="2rem" />
          </view>
        </view>
      </view>
      <view class="flex-row" style="margin-bottom: 10rpx">
        <image
          style="width: 2rem; height: 2rem"
          src="../../static/icon2.png"
          mode="scaleToFill"
        />
        <image
          style="width: 2rem; height: 2rem"
          src="../../static/icon1.png"
          mode="scaleToFill"
        />
      </view>
      <view class="flex-row">
        <view class="title">预测券：{{ user.integral }}</view>
        <view class="title">米兰券：{{ user.beer }}</view>
      </view>
    </view>
    <template v-if="user.role != 'USER'">
      <van-grid column-num="3">
        <van-grid-item icon="add-o" text="录入" @click="scan('add')" />
        <van-grid-item icon="scan" text="核销" @click="scan('verification')" />
        <van-grid-item
          icon="completed"
          text="核销记录"
          @click="to('vertifyList')"
        />
      </van-grid>
    </template>
    <template v-if="user.role == 'ADMIN'">
      <van-grid column-num="3">
        <van-grid-item
          icon="apps-o"
          text="汇率管理"
          @click="to('rateConfig')"
        />
        <van-grid-item icon="bill-o" text="账单管理" @click="to('orderList')" />
        <van-grid-item
          icon="friends-o"
          text="用户管理"
          @click="to('userConfig')"
        />
      </van-grid>
    </template>

    <image
      class="tips"
      src="cloud://yudicloud-4gpvpsju0d42411d.7975-yudicloud-4gpvpsju0d42411d-1312463832/swipe/tip.jpg"
      mode="aspectFit"
    />

    <van-cell title="我的预言" is-link value="查看" @click="to('guessList')" />
    <!-- <van-cell
      title="我的积分"
      is-link
      value="查看"
      @click="to('vertifyList')"
    /> -->

    <van-dialog use-slot :show="showID" @close="showID = false">
      <view class="flex-row" style="padding: 20rpx">
        <canvas
          id="qrcode"
          canvas-id="qrcode"
          :style="{ width: `${size}px`, height: `${size}px` }"
        ></canvas>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import uQRCode from "../../wxcomponents/js_sdk/u-qrcode";
import { getUserProfile, getUser, setUser } from "@/plugins/util";
export default {
  data() {
    return {
      user: getUser(),
      showID: false,
      text: "uQRCode",
      size: 256,
    };
  },
  onLoad() {
    const ctx = uni.createCanvasContext("qrcode");
    const uqrcode = new uQRCode(
      {
        text: this.user._id,
        size: this.size,
      },
      ctx
    );
    uqrcode.make();
    uqrcode.draw();
  },

  onShow() {
    const that = this;
    wx.cloud
      .callFunction({
        // 要调用的云函数名称
        name: "test",
        // 传递给云函数的 event 参数
        data: {
          type: "getUser",
        },
      })
      .then((res) => {
        setUser(res.result.data);
        that.user = res.result.data;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    to(p) {
      uni.navigateTo({
        url: "/pages/account/" + p,
      });
    },
    async scan(type) {
      uni.scanCode({
        scanType: ["qrCode"],
        onlyFromCamera: false,
        success: (res) => {
          console.log("res: " + JSON.stringify(res));
          // 获取的数据给固定方法处理
          if (type == "add") {
            uni.navigateTo({
              url:
                "/pages/account/addOrder?code=" +
                encodeURIComponent(res.result),
            });
          } else if (type == "verification") {
            uni.navigateTo({
              url:
                "/pages/account/verification?code=" +
                encodeURIComponent(res.result),
            });
          }
        },
        fail: (err) => {
          // #ifdef MP
          uni.getSetting({
            success: (res) => {
              let authStatus = res.authSetting["scope.camera"];
              if (!authStatus) {
                uni.showModal({
                  title: "授权失败",
                  content: "需要使用您的相机，请在设置界面打开相关权限",
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  },
                });
              }
            },
          });
          // #endif
        },
      });
    },
  },
};
</script>

<style scoped>
.content {
  background-color: #f6f6f6;
}
.top-box {
  color: #fff;
  margin: 20rpx 20rpx 0;
  padding: 20rpx;

  background: linear-gradient(#001736, #0047a3);
  /* background-color: #0047a3; */
  border: 1px solid #ccc;
}
.tips {
  width: 100vw;
  height: 360rpx;
}
.logo {
  height: 200rpx;
  width: 200rpx;
}
.user-right {
  width: calc(100vw - 10rem);
}
</style>
