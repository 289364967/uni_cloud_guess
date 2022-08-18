<template>
  <view class="content">
    <view>
      <van-cell>
        <view slot="title" class="van-cell-text cell-title"
          >查看指定操作员核销记录</view
        >
        <view @click="showGoods = true">{{
          relation ? relation : "选择您的商品"
        }}</view>
      </van-cell>
      <van-action-sheet
        :actions="goodsList"
        :show="showGoods"
        @close="showGoods = false"
        @select="onSelect"
        cancel-text="取消"
      >
      </van-action-sheet>
    </view>

    <view class="card-box">
      <view class="flex-row-between card-item">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view style="width: 40%">
          <view class="card-title">username</view>
          <view class="card-title-second">vertify date</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title">积分 -100</view>
          <view class="card-title">操作员 XXX</view>
        </view>
      </view>
      <view class="flex-row-between card-item">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view style="width: 40%">
          <view class="card-title">us操作员ame</view>
          <view class="card-title-second">vertify date</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title">积分 -100</view>
          <view class="card-title">操作员 XXX</view>
        </view>
      </view>
      <view class="flex-row-between card-item">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <view style="width: 40%">
          <view class="card-title">操e</view>
          <view class="card-title-second">vertify date</view>
        </view>
        <view style="text-align: right; width: 30%">
          <view class="card-title">积分 -100</view>
          <view class="card-title">操作员 X作员namXX</view>
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
    return {};
  },
  onLoad: function (option) {},
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
