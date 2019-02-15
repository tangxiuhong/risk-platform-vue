<template>
    <div class="notBox" :class="animates?'notAnim':'notOpa'" ref="notBox">
      <div class="notHead">
        <i class="el-icon-close" @click="notClose"></i>
      </div>
      <div class="notContent">
        <h4>{{notTitle}}</h4>
        <div class="notTxt">
          <p>{{notContent}}</p>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          notTitle: '',
          notContent: '',
          animates: false
        }
      },
      methods: {
        notClose () {
          this.$emit('noticeHide')
        },
        // 获取首页公告
        init (title, content) {
          this.notTitle = title
          this.notContent = content
          clearTimeout(this.setNotAnim)
          this.setNotAnim = setTimeout(() => {
            this.animates = true
            // this.$refs.notBox.addEventListener('transitionEnd', this.$emit('noticeHide'))
            clearTimeout(this.setHide)
            this.setHide = setTimeout(() => {
              this.$emit('noticeHide')
            }, 1000)
          }, 5000)
          this.animates = false
        }
      }
    }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
.notBox{
  width: 350px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,.3);
  border-radius: 5px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 20px;
  z-index: 9999;
}
  .notHead{
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 16px;
  }
  .notContent{
    margin-top: 15px;
    line-height: 1.5em;
  }
  .notTxt{
    margin-top: 5px;
    text-indent: 2em;
  }
  .notAnim{
    transition: all 1s;
    opacity: 0;
  }
  .notOpa{ opacity: 1}
</style>
