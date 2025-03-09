<template>
<view class="top_nav" :style="{background:bgColor}">
<view class="status_bar" :style="'height: '+ statusBarHeight"></view>
<view class="toBar" :style="'height:'+toBarHeight">
	<view>
		<block v-if="showLeft == true">
			 <!-- <image src="" v-if="leftBg == true" class="left_img"  @tap="toback"></image> -->
			  <u-icon name="arrow-left" @tap="toback" class="left_img" color="#ffffff" ></u-icon>
			  <text class="iconfont icon-fanhui left_icon" @tap="toback" v-if="leftBg == false" style="color: #202020;"></text>
		</block>
	</view>
  
  <!-- #ifndef H5 -->
  <text class="title" :style="'color:' + textcolor" v-if="showTitle == true">{{navTitle}}</text>
  <!-- #endif -->
  <!-- #ifdef H5 -->
  <text class="title bolds" :style="'color:' + textcolor" v-if="showTitle == true">{{navTitle}}</text>
  <!-- #endif -->
</view>
</view>
</template>

<script>

export default {
	
  data() {
    return {
      
    };
  },
	computed:{
		statusBarHeight(){
			return '0px'
		},
		toBarHeight(){
			return  '0px'
		}
	},
  components: {},
  props: {
    textcolor: {
      type: String,
      default: '#fff'
    },
	bgColor:{
		type:String,
		default:''
	},
    showTitle: {
      type: Boolean,
      default: true
    },
    showLeft: {
      type: Boolean,
      default: false
    },
	navTitle: {
	  type: String,
	  default: '登录'
	},
	leftBg:{
		type: Boolean,
		default: true
	}
  },
  methods: {
    toback() {
		let pages = getCurrentPages()
		if(pages.length==1){
			console.log("只有一页");
			uni.switchTab({
				url:"../../pages/index/index"
			})
		}else{
			uni.navigateBack({
				delta: 1
			});
		}
    }

  }
};
</script>
<style lang="scss" scoped>
.status_bar{
  width: 100vw;
  overflow: hidden;
  display: block;
}
.toBar{
  width: 100vw;
  position: relative;
  display: flex;
  align-items: left;
}
.left_icon{
	font-size: 32upx;
	position: absolute;
	left: 20upx;
	font-weight: 500;
	width: 60upx;
	height: 60upx;
	line-height: 60upx;
}
.toBar .title{
  text-align: center;
  color: #fff;
  font-size: 30upx;
  display: block;
  margin: 0 auto;
}
.left_img{
  width: 60upx;
  height: 60upx;
  position: absolute;
  padding: 16upx;
  left: 10upx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  /* background-color: rgba(0, 0, 0, 0.4); */
	background-color:rgba(0, 0, 0, 0);
  border-radius: 50%;
}
.bolds{
	font-weight: bold;
}
.top_nav{
		position: fixed; 
		top: 60upx;
		left: 15upx;
		z-index: 80;
	}
</style>