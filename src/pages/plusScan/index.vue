<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="bu">
			<button @tap="scan('browser')" type="primary">浏览器模式</button>
		</view>
		<view class="bu">
			<button @tap="scan('pda')" type="primary">PDA兼容模式扫码</button>
		</view>
		<view class="bu">
			<button @tap="scanPlusDemo()" type="primary">流程演示</button>
		</view>
		<view class="bu">
			<button @tap="scanPlusNoCancel()" type="primary">不允许返回</button>
		</view>
		<view class="bu">
			<button @tap="scanPlusNoConfirm()" type="primary">不允许确定</button>
		</view>
		<view class="bu">
			<button @tap="scanPlus()" type="primary">连续扫码1次</button>
		</view>
		<view class="bu">
			<button @tap="scanPluss()" type="primary">连续扫码无限次</button>
		</view>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		
	</view>
</template>

<script>
	import permision from "@/plugins/permission.js";
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad:function(option){
			this.title = "option: " + JSON.stringify(option);
			console.log("option: " + JSON.stringify(option));
		},
		methods: {
			scanPlusNoConfirm(){
				console.log(123);
				uni.showToast({
					title: '流程演示',
					success:function(){
						setTimeout(function() {
							uni.hideToast()
						}, 2000);
						uni.navigateTo({
							url:"./scanQrcodePlus?callbackurl="+encodeURIComponent("/pages/scan/demo?name=传输的文字")+"&count=1&confirmButton=false" 
						})
					},
					mask:true
				});
				
			},
			scanPlusNoCancel(){
				uni.showToast({
					title: '流程演示',
					success:function(){
						setTimeout(function() {
							uni.hideToast()
						}, 2000);
						uni.navigateTo({
							url:"./scanQrcodePlus?callbackurl="+encodeURIComponent("/pages/scan/demo?name=传输的文字")+"&count=1&cancelButton=false" 
						})
						
					},
					mask:true
				});
				
			},
			scanPlus(){
				uni.showToast({
					title: '跳转-使用连续扫码',
					success:function(){
						setTimeout(function() {
							uni.hideToast()
						}, 2000);
						uni.navigateTo({
							url:"./scanQrcodePlus?callbackurl="+encodeURIComponent("/pages/scan/index?1=2")+"&count=1" 
						})
						
					},
					mask:true
				});
				
			},
			scanPlusDemo(){
				uni.showToast({
					title: '流程演示',
					success:function(){
						setTimeout(function() {
							uni.hideToast()
						}, 2000);
						uni.navigateTo({
							url:"./scanQrcodePlus?callbackurl="+encodeURIComponent("/pages/scan/demo?name=传输的文字")+"&count=1" 
						})
						
					},
					mask:true
				});
				
			},
			scanPluss(){
				uni.showToast({
					title: '跳转-使用连续扫码',
					success:function(){
						setTimeout(function() {
							uni.hideToast()
						}, 2000);
						uni.navigateTo({
							url:"./scanQrcodePlus?callbackurl="+encodeURIComponent("/pages/scan/index?1=2")+"=1" 
						})
						
					},
					mask:true
				});
				
			},
			async scan(model = 'pda') {
				uni.scanCode({
					scanType:["qrCode"],
					onlyFromCamera: false,
					success: (res) => {
						console.log("res: " + JSON.stringify(res));
						// 获取的数据给固定方法处理
						uni.navigateTo({
							url:"./scanCode?code="+encodeURIComponent(res.result)+"&callbackurl="+encodeURIComponent("/pages/scan/index")+"&model="+model
						})
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要使用您的相机，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				});
			}
			// #ifdef APP-PLUS
			,
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
			}
			// #endif
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	.text-area {
		display: flex;
		justify-content: center;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.bu {
		margin-top: 20upx;
	}
</style>

