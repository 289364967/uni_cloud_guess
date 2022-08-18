<template>
  <view class="content">
    <!-- <view class="text-area">
			<text>{{code}}</text>
			<text class="title">{{result}}</text>
		</view> -->

    <view>
      <view class="text-line">购买用户</view>
      <van-cell-group inset>
        <!-- <van-cell title="下单时间" value="1123212" /> -->
        <van-cell
          title="bigxchen"
          :value="'id 1231'"
          :label="'获得积分 + 3090'"
        />
      </van-cell-group>
    </view>

    <view class="text-line">产品信息</view>
    <van-cell-group>
      <van-cell>
        <view slot="title" class="van-cell-text cell-title">购买商品</view>
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

      <van-field
        :value="password"
        type="number"
        label="数量"
        placeholder="请输入购买数量"
        :border="false"
        input-align="right"
      />
    </van-cell-group>

    <view> </view>

    <van-submit-bar
      button-text="确认录入"
      @submit="addChild"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      code: "默认的内容", // 获取的二维码
      result: "",
      showGoods: false,
      goodsList: [
        {
          name: "one",
        },
        {
          name: "one",
        },
      ],
    };
  },
  onLoad: function (option) {
    var that = this;
    if (!option.code) {
      this.result = "扫码内容为空";
    }
    const code = decodeURIComponent(option.code);
    this.code = code;
    console.log("App Load");
  },
  onShow: function () {
    var that = this;
    console.log("App Show");
  },
  methods: {
    onSelect(e) {
      console.log(e.detail);
    },
  },
};
</script>

<style scoped>
.scan-result {
  min-height: 50upx;
  line-height: 50upx;
}
</style>
