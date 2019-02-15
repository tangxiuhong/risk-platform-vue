<template>
  <div class="mesStyle" v-show="mesHide" :class="mesStyle?'mesinto1':'mesinto2'">
    <div class="mesinto">
      <el-row>
        <el-col>
          <el-row>
            <el-col :span="22"><p class="mesTitle">{{ title }}</p></el-col>
            <el-col :span="2"><i class="el-icon-close" style="font-size: 18px;" @click="msgHide()"></i></el-col>
          </el-row>
        </el-col>
        <el-col>
          <div>
            <p>{{ content }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mesHide: true,
        mesStyle: true,
        title: '',
        content: ''
      }
    },
    methods: {
      msgHide () {
        this.$emit('mesHidden')
        this.mesHide = false
      },
      init (data) {
        let _this = this
        this.title = data.title
        this.content = data.content
        clearTimeout(h)
        var h = setTimeout(function time () {
          _this.mesHide = false
          _this.mesStyle = false
        }, 5000)
        this.mesHide = true
        this.mesStyle = true
      }
    }

  }
</script>

<style scoped>
  /*消息提示弹框样式*/
  .mesStyle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 300px;
    z-index:999;
  }

  .mesinto {
    background: #eee;
    padding: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .mesinto .mesTitle {
    font-weight: bold;
    margin: 5px 0 10px !important;
    color: #000;
  }

  .mesinto1 {
    animation: mymes 1s;
    -moz-animation: mymes 1s; /* Firefox */
    -webkit-animation: mymes 1s; /* Safari and Chrome */
    -o-animation: mymes 1s; /* Opera */
  }

  @keyframes mymes {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-moz-keyframes mymes /* Firefox */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-webkit-keyframes mymes /* Safari and Chrome */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-o-keyframes mymes /* Opera */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  .mesinto2 {
    animation: mymes2 1s forwards;
    -moz-animation: mymes2 1s forwards; /* Firefox */
    -webkit-animation: mymes2 1s forwards; /* Safari and Chrome */
    -o-animation: mymes2 1s forwards; /* Opera */
  }

  @keyframes mymes2 {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-moz-keyframes mymes2 /* Firefox */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-webkit-keyframes mymes2 /* Safari and Chrome */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-o-keyframes mymes2 /* Opera */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  #mesPosit p.el-alert__description {
    line-height: 2em !important;
  }

</style>
