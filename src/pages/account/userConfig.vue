<template>
  <view class="content">
    <view class="flex-row">
      <van-button type="info" @click="scan">新增</van-button>
    </view>
    <view class="card-box">
      <view
        class="flex-row-between card-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view style="width: 40%">
          <view class="card-title">{{ item.name }}</view>
          <view class="card-title-second">{{ item.role }}</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title" @click="remove(item._id)">移除</view>
        </view>
      </view>
    </view>
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
  onLoad: function (option) {},
  onShow: function () {
    this.loadData();
  },
  methods: {
    loadData() {
      const that = this;
      wx.cloud
        .callFunction({
          // 要调用的云函数名称
          name: "test",
          // 传递给云函数的 event 参数
          data: {
            type: "getAgent",
          },
        })
        .then((res) => {
          that.list = res.result.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    remove(id) {
      const that = this;
      wx.cloud
        .callFunction({
          name: "test",
          data: {
            type: "changeRole",
            _id: id,
            role: "USER",
          },
        })
        .then((res) => {
          that.loadData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async scan(type) {
      const that = this;
      uni.scanCode({
        scanType: ["qrCode"],
        onlyFromCamera: false,
        success: (res) => {
          console.log("res: " + JSON.stringify(res));
          let id = res.result;
          wx.cloud
            .callFunction({
              name: "test",
              data: {
                type: "changeRole",
                _id: id,
                role: "AGENT",
              },
            })
            .then((res) => {
              that.loadData();
            })
            .catch((err) => {
              console.error(err);
            });
          // 获取的数据给固定方法处理
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
.card-box {
  margin: 20rpx;
}
.card-item {
  padding: 10rpx;
  margin-bottom: 10rpx;
  border-bottom: 1px solid #ddd;
}
</style>
