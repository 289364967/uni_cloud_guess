<template>
  <view class="content">
    <view class="text-line">球队设置</view>

    <view class="flex-row">
      <van-button type="info" @click="add">新增球队</van-button>
    </view>
    <view class="text-line">汇率管理</view>
    <view>
      <view class="flex-row" v-for="(item, index) in list" :key="index">
        <van-image width="7rem" height="7rem" fit="contain" :src="item.img" />
        <view style="width: 25%">
          <view> {{ item.name }} </view>
          <view>汇率 1：{{ item.rate }}</view>
        </view>
        <view class="flex-row" style="width: 55%">
          <van-button type="warning" size="small" @click="change(item)"
            >修改</van-button
          >
          <van-button type="danger" size="small" @click="remove(item._id)"
            >删除</van-button
          >
          <van-button color="#7232dd" size="small">选它开奖</van-button>
        </view>
      </view>
      <!-- <view class="flex-row">
        <van-image
          width="7rem"
          height="7rem"
          fit="contain"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view>汇率</view>
        <view class="flex-row" style="width: 45%">
          <view>1</view>
          <view>：</view>
          <view class="setting-box flex-row">
            <van-field
              :value="rate"
              placeholder="汇率"
              type="number"
              :border="true"
              @change="onChange"
            />
          </view>
        </view>
      </view> -->
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
    remove(id) {
      const that = this;
      wx.cloud
        .callFunction({
          name: "city",
          data: {
            type: "remove",
            _id: id,
          },
        })
        .then((res) => {
          that.loadData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    change(item) {
      uni.navigateTo({
        url: "/pages/account/cityAdd?type=change&_id=" + item._id,
      });
    },
    add() {
      uni.navigateTo({
        url: "/pages/account/cityAdd?type=add",
      });
    },
  },
};
</script>

<style scoped>
.setting-box {
  width: 120rpx;
  height: 120rpx;
  border: 1px solid #ddd;
}
</style>
