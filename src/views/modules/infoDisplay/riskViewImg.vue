<template>
  <div class="viewBox" @click="imgHide()">
    <img class="changeImg" @click.stop :src='showImg'/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showImg: '',
        isShow: true
      }
    },
    methods: {
      getRiskImg (item) {
        console.log(item)
        this.showImg = item.attachmentPath
      },
      imgHide () {
        this.$emit('riskImgHide')
      }
    }
  }
</script>

<style>
  .viewBox {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, .8);
    z-index: 9999;
    left: 0;
    top: 0;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .changeImg {
    width: auto;
    max-width: 90%;
    height: auto;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
</style>
