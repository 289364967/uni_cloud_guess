<template>
  <view class="content">
    <view class="text-line">添加图片</view>
    <van-uploader v-if="!file" :file-list="fileList" @after-read="afterRead" />
    <van-image v-else width="7rem" height="7rem" fit="contain" :src="file" />

    <view class="text-line">设置名称</view>

    <van-field
      :value="name"
      label="队伍名称"
      placeholder="请输入队伍名称"
      :border="false"
      input-align="right"
      @change="
        (e) => {
          onChange(e, 'name');
        }
      "
    />
    <view class="text-line">设置汇率</view>

    <van-field
      :value="rate"
      type="number"
      label="设置汇率"
      placeholder="请输入队伍汇率，例：5即是1：5"
      :border="false"
      input-align="right"
      @change="
        (e) => {
          onChange(e, 'rate');
        }
      "
    />
    <van-submit-bar
      :button-text="type == 'change' ? '确认修改' : '确认添加'"
      @submit="addCity"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      file: null,
      name: null,
      rate: null,
      type: null,
      _id: null,
    };
  },
  onLoad: function (option) {
    this.type = option.type;
    this._id = option._id;
  },
  onShow: function () {},
  methods: {
    onChange(event, p) {
      this[p] = event.detail;
    },
    addCity() {
      const that = this;
      if (this.type == "add") {
        wx.cloud
          .callFunction({
            // 要调用的云函数名称
            name: "city",
            // 传递给云函数的 event 参数
            data: {
              type: "add",
              name: that.name,
              img: that.file,
              rate: that.rate,
            },
          })
          .then((res) => {
            if (!!res.result._id) {
              console.log("add ok");
              uni.navigateBack({
                delta: 1,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (this.type == "change") {
        wx.cloud
          .callFunction({
            // 要调用的云函数名称
            name: "city",
            // 传递给云函数的 event 参数
            data: {
              type: "changeCity",
              _id: that._id,
              name: that.name,
              img: that.file,
              rate: that.rate,
            },
          })
          .then((res) => {
            if (!!res.result.data.success) {
              console.log("change ok");
              uni.navigateBack({
                delta: 1,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    afterRead(event) {
      const that = this;
      const { file } = event.detail;
      wx.cloud.uploadFile({
        cloudPath:
          "yudicloud-4gpvpsju0d42411d/" + Math.floor(Math.random() * 1000000),
        filePath: file.url,
        success(res) {
          console.log("成功", res);
          that.file = res.fileID;
          // const { fileList = [] } = this.data;
          // fileList.push({ ...file, url: res.fileID });
          // this.fileList = fileList;
        },
      });
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      // wx.uploadFile({
      //   url: "https://example.weixin.qq.com/upload", // 仅为示例，非真实的接口地址
      //   filePath: file.url,
      //   name: "file",
      //   formData: { user: "test" },
      //   success(res) {
      //     // 上传完成需要更新 fileList
      //     const { fileList = [] } = this.data;
      //     fileList.push({ ...file, url: res.data });
      //     this.setData({ fileList });
      //   },
      // });
    },
  },
};
</script>

<style scoped>
</style>
