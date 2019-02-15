<template>
  <div class="newsOut" ref="newsout">
    <div class="newsBox">
      <div class="newsHead">
        <div class="backnav">
          <p>
            <span>首页 <i class="el-icon-d-arrow-right"></i> 新闻详情</span>
            <span style="float: right; font-size: 18px; cursor: pointer" @click="offNews()"><i class="el-icon-close"></i></span>
          </p>
        </div>
        <h3>{{newsTitle}}</h3>
        <div class="source">
          <el-col :span="8">新闻来源：<span>程潮矿业双重预防机制信息平台</span></el-col>
          <el-col :span="8">发布人：<span>{{sourceUser}}</span></el-col>
          <el-col :span="8">发布时间：<span>{{sourceTime}}</span></el-col>
        </div>
      </div>
      <div class="newsContent">
        <div class="newsTxt">
          <div>
            <div class="newsImg"><img :src="image"></div>
            <div v-html='content'>{{ content }}</div>
          </div>
        </div>
        <div class="newsBack" @click="offNews()"><i class="el-icon-back"></i> 返回</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      data () {
        return {
          newsTitle: '',
          sourceUser: '',
          sourceTime: '',
          content: '',
          image: ''
        }
      },
      methods: {
        // 获取首页新闻
        init (item) {
          console.log('内容：' + item.content)
          this.newsTitle = item.title
          this.content = item.content
          this.image = item.image
          this.sourceUser = item.createUser
          this.sourceTime = item.createDate
        },
        offNews () {
          this.$emit('newsHide')
        }
      }
    }
</script>

<style scoped>
  .newsOut{
    position: fixed;
    background: #eeeeee;
    height: 100%;
    width: 100%;
    z-index: 9999;
    left: 0;
    top: 0;
  }
.newsBox{
  width: 70%;
  margin: 0 auto;
  background: #fff;
  height: 100%;
  padding: 20px 40px;
  min-width: 900px;
  box-shadow: 0 0 10px rgba(0,0,0,.3);
  overflow: scroll;
}
  .newsBox::-webkit-scrollbar{
    width: 0;
  }
  .newsImg{
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }
  .newsImg img{
    width: 95%;
  }
  .backnav{
    margin-bottom: 15px;
    color: #999;
    background: #fbfbfb;
    line-height: 1.2em;
    padding: 10px;
  }
  .newsHead h3{
    line-height: 2em;
    text-align: center;
    font-size: 1.4em;
  }
  .source{
    margin-top: 20px;
    overflow: hidden;
    font-size: 14px;
    color: #c1c0c0;
    text-align: center;
  }
  .source span{
    color: #606266;
  }
  .newsTxt{
    padding: 20px 0;
    font-size: 15px
  }
  .newsTxt p{
    text-indent: 2em;
    line-height: 1.7em;
    margin: 15px 0;
  }
  .newsBack{
    margin-top: 30px;
    text-align: right;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
  }
</style>
