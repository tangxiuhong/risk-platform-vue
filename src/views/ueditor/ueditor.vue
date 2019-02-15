<template>
  <div class="mod-demo-ueditor">
    <script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">{{ ueContent }}</script>
  </div>
</template>

<script>
  import ueditor from 'ueditor'
  export default {
    data () {
      return {
        ue: null,
        ueId: `J_ueditorBox_${new Date().getTime()}`,
        ueContent: ''
      }
    },
    mounted () {
      this.ue = ueditor.getEditor(this.ueId, {
        serverUrl: this.$http.adornUrl(`/notice/sysNews/upload?token=` + this.$cookie.get('token')), // 服务器统一请求接口路径
        autoClearinitialContent: true,
        zIndex: 3000
      })
    },
    deactivated () {
      this.ue.destroy()
    },
    methods: {
      init (content) {
        this.ueContent = content
        this.ue.ready(() => {
          this.ue.setContent(this.ueContent)
        })
      },
      getContent () {
        this.ue.ready(() => {
          this.ueContent = this.ue.getContent()
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-ueditor {
    position: relative;
    z-index: 510;
    > .el-alert {
      margin-bottom: 10px;
    }
  }
</style>
