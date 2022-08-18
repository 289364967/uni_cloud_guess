<template>
	<view class="content">
		<view class="text-area">
			<text>{{code}}</text>
			<text class="title">{{result}}</text>
		</view>
	</view>
</template>

<script>
	import helper from "@/plugins/helper.js";
	
	export default{
		data() {
			return {
				code: '默认的内容',// 获取的二维码
				result: '',
			}
		},
		onLoad:function(option){
			var that = this;
			if(!option.code){
				this.result = "扫码内容为空";
			}
			const code = decodeURIComponent(option.code);
			this.code = code;
			console.log('App Load')
		},
		onShow: function() {
			var that = this;
			console.log('App Show')
		},
		methods:{
		}

	}
</script>

<style>
	.scan-result {
		min-height: 50upx;
		line-height: 50upx;
	}
</style>
