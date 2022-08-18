<template>
	<view>
		<button v-if="cancelButton == true" class="back" @tap="back" type="primary">取消扫码</button>
		<button v-if="confirmButton == true" class="back" style="margin-left: 300upx;" @tap="affirm" type="primary">完成</button>
	</view>
</template>

<script>
	import permision from "@/plugins/permission.js";
	import helper from "@/plugins/helper.js";

	export default {
		data() {
			return {
				domain:"www.zunkr.com",
				callbackurl:'',
				confirmButton:true,
				cancelButton:true,
				callbackurl:'',
				count:0,
				codeArray:[]
			}
		},
		onLoad:function(option){
			this.callbackurl = option.callbackurl;// 回调地址
			if(option.count){
				this.count = option.count;
			}
			if(option.confirmButton){
				this.confirmButton = option.confirmButton;
			}
			
			if(option.cancelButton){
				this.cancelButton = option.cancelButton;
			}
			this.scanplus();
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			affirm(){
				var that = this
				that.parsQrcode(this.codeArray);
			},
			// #ifdef APP-PLUS
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			// #endif
			async scanplus(){
				var that = this
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				 var barcode = await this.createBarcode();
				 barcode.setFlash(false)
				 barcode.start()//开始识别二维码  
				 var codeArray=that.codeArray;
				 barcode.onmarked = function(type, code, file){//扫码成功后进行的事件 
				 console.log(code)
					codeArray.push(code);
					that.codeArray = codeArray;
					// 根据需要数量
					if(that.count == 0){
						uni.showToast({
							title:"成功:"+codeArray.length+"次",
							duration:1500
						})
						setTimeout(function(){
							barcode.start()//开始识别二维码 
						},2000)
					}else{
						if(that.count <= codeArray.length){
							barcode.close()
							that.parsQrcode(codeArray)
						}else{
							uni.showToast({
								title:"成功:"+codeArray.length+"次",
								duration:1500
							})
							barcode.start()//开始识别二维码 
						}
					}
				 }
			}
			,
			parsQrcode(codeArray = []){
				var that = this
				console.log("codeArray: " + JSON.stringify(codeArray));
				if(that.callbackurl){
					// 处理isurl
					var uuidArray = [];
					for (var i = 0; i < codeArray.length; i++) {
						if(helper.IsURL(codeArray[i])){
							// 解析内部地址
							var domain = helper.AnalysisURL(codeArray[i])[2]
							switch (domain){
								case that.domain:
									// 分解参数
									var param = codeArray[i].split("?");
									var uuid = param[1];
									uuidArray.push(uuid)
									break;
								default:
									break;
							}
						}
					}
					console.log("uuidArray: " + JSON.stringify(uuidArray));
					if(uuidArray.length > 0){
						// 检测是否传参传递
						var callbackurl = decodeURIComponent(that.callbackurl);
						var param = callbackurl.split("?");
						console.log("callbackurl: " + JSON.stringify(callbackurl));
						if(param[1]){
							var callbackurls = callbackurl+'&item='+encodeURIComponent(uuidArray);
						}else{
							var callbackurls = param[0]+'?item='+encodeURIComponent(uuidArray);
						}
						uni.redirectTo({
							url:callbackurls,
						})
					}else{
						that.back();
					}
				}else{
					that.back();
				}
			},
			// 创建Barcode扫码控件
			async createBarcode() {
				const currentWebview = this.$mp.page.$getAppWebview();
				// #ifdef APP-PLUS  
				var barcode = null;
				if(!barcode){
					barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
						frameColor:'#2B9505',
						scanbarColor:'#2B9505',
						top:'0px',
						left:'0px',
						width: '100%',
						height: '500px',
						position: 'static'
					});
					currentWebview.append(barcode);
				}
				// #endif
				return barcode;
			}
		}
	}
</script>

<style>
	.back{
		position: fixed;
		bottom: 5%;
		left: 100upx;
	}
</style>
