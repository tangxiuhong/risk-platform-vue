<template>
  <div class="center_right">
    <el-carousel indicator-position="outside" height="730px">
      <el-carousel-item v-for="item in imgList" :key="item">
        <img :src="item" style="width:100%;height:100%;"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        imgList: [],
        dataRule: {}
      }
    },
    methods: {
      init (id) {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/getAnQuanTulistFiles'),
          method: 'get',
          params: this.$http.adornParams({recordId: id})
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.sysFiles != null && data.sysFiles.length > 0) {
              for (var i = 0; i < data.sysFiles.length; i++) {
                var localAddr =getLocalAddr(data.sysFiles[i].attachmentPath); 
                this.imgList.push(localAddr);
              }
            }
          }
        })
      }
    }
  }
</script>

