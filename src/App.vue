<script>
export default {
  onLaunch: function () {
    console.log("App Launch");

    wx.cloud.init({
      env: "yudicloud-4gpvpsju0d42411d",
    });
  },
  onShow: function () {
    console.log("App Show");
	// const db = wx.cloud.database({})
	// db.collection('user').where({}).get({
	// 	success:function(res){
	// 		console.log(res)
	// 	}
	// })
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
@import "/wxcomponents/vant/dist/common/index.wxss";
/*每个页面公共css */
page {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    Segoe UI, Arial, Roboto, "PingFang SC", "miui", "Hiragino Sans GB",
    "Microsoft Yahei", sans-serif;
}
/*每个页面公共css */
.content {
  min-height: 100vh;
  /* background-color: #f9e9ea; */
}
.button-hover {
  opacity: 0.9;
}
.icon {
  width: 64rpx;
  height: 64rpx;
}
.text-left {
  text-align: start;
}
.text-center {
  text-align: center;
}
.text-line {
  margin: 0;
  padding: 32rpx 16rpx 16rpx;
  color: rgba(69, 90, 100, 0.6);
  font-weight: 400;
  font-size: 0.8rem;
  /* line-height: 16rpx; */
}
.card-title {
  padding: 8rpx;
  color: #353535;
  font-weight: 400;
  font-size: 1rem;
  /* line-height: 16rpx; */
}
.card-title-second {
  padding: 8rpx;
  color: #999999;
  font-weight: 300;
  font-size: 0.8rem;
  /* line-height: 16rpx; */
}
.flex-col {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: baseline;
}
.flex-col-center {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.flex-row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-row-start {
  display: flex;
  justify-content: start;
  align-items: center;
}
.flex-row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
