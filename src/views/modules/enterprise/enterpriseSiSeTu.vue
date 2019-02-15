<template>
  <div class="center_right">
    <el-row type="flex" class="row-title" justify="right">
      <el-col :span="5">
        <el-select v-model="enterpriseId" filterable placeholder="请选择" clearable @change="changeEnterprise"
                   @focus="getEnterpriseList()">
          <el-option
            v-for="item in enterpriseList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-button v-if="isAuth('enterprise/sysEnterprise/save')" type="primary" @click="addOrUpdateHandle()">新增
      </el-button>
    </el-row>
    <el-carousel indicator-position="outside" height="730px" :autoplay="false">
      <el-carousel-item v-for="item in imgList" :key="item.name">
        <h2 align="center">{{ item.name }}</h2>
        <img @click="imgMove($event)" :data-original="item.url" :src="item.url" style="width:100%;height:100%;"/>
      </el-carousel-item>
    </el-carousel>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './enterpriseSiSeTu-add-or-update'
  import {getLocalAddr} from '@/utils'
  import Viewer from 'viewerjs'
  import 'viewerjs/dist/viewer.css'

  export default {
    data () {
      return {
        enterpriseList: [],
        enterpriseId: '',
        enterpriseName: '',
        imgList: [],
        dataRule: {},
        addOrUpdateVisible: false,
        imgViewVisible: false
      }
    },
    components: {
      AddOrUpdate, Viewer
    },
    mounted () {
      this.getEnterpriseList()
    },
    methods: {
      imgMove (event) {
        const viewer = new Viewer(event.target, {
          url: 'data-original',
          navbar: false,
          title: false,
          viewed() {
            viewer.zoomTo(1)
          }
        })
        viewer.show()
      },
      getEnterpriseList () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.enterpriseList = data.list
            this.enterpriseId = this.enterpriseList[0].value
            this.getImgList()
          } else {
            this.enterpriseList = []
          }
        })
      },
      getImgList () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/getFengXianTuFiles'),
          method: 'get',
          params: this.$http.adornParams({recordId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            var sysFiles = data.sysFiles
            var i
            for (i in sysFiles) {
              var localAddr = getLocalAddr(sysFiles[i].attachmentPath);
              var fi = {name: sysFiles[i].attachmentGroup, url: localAddr}
              this.imgList.push(fi)
            }
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.enterpriseId)
        })
      },
      changeEnterprise () {
        this.enterpriseId = this.enterpriseId
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/getFengXianTuFiles'),
          method: 'get',
          params: this.$http.adornParams({recordId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.imgList = []
            var sysFiles = data.sysFiles
            var i
            for (i in sysFiles) {
              var localAddr = getLocalAddr(sysFiles[i].attachmentPath)
              var fi = {name: sysFiles[i].attachmentGroup, url: localAddr}
              this.imgList.push(fi)
            }
          }
        })
      }
    }
  }
</script>
<style>
  .ui-widget-content {
    position: relative;
  }

  .scrollHide .el-dialog.is-fullscreen {
    overflow: hidden;
  }

  .zoom {
    display: inline-block;
    position: relative;
  }

  .zoom img {
    display: block;
  }

  .viewer-canvas > img {
    margin: 0 auto;
  }
</style>
