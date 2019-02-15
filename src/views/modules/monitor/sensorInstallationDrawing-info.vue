<template>
  <el-dialog
    :title="'监测点安装图查看:'"
    :close-on-click-modal="true"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm"
             label-width="120px">
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="dataForm.enterpriseName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="传感器名称" prop="drawingName">
        <el-input v-model="dataForm.drawingName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="安装位置" prop="drawingSite">
        <el-input v-model="dataForm.drawingSite" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="drawingDescription">
        <el-input v-model="dataForm.drawingDescription" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="是否同步" prop="isSync">
        <el-radio-group v-model="dataForm.isSync" :disabled="true">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监测点安装图" prop="imgList">
        <el-carousel :interval="3000" type="card" height="330px" v-if="imgList.length>0">
          <el-carousel-item v-for="(item,key) in imgList" :key="item.id">
            <!-- 图片 -->
            <div style="width:100%;height:100%;">
              <img :src="item.attachmentPath" style="width:100%;height:100%;"/>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        imgList: [],
        dataForm: {
          id: 0,
          eid: '',
          enterpriseName: '',
          drawingName: '',
          drawingSite: '',
          drawingDescription: '',
          isSync: 0
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/sensorInstallationDrawing/lookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.map.dataList[0].id
                this.dataForm.eid = data.map.dataList[0].eid
                this.dataForm.enterpriseName = data.map.dataList[0].enterpriseName
                this.dataForm.drawingName = data.map.dataList[0].drawingName
                this.dataForm.drawingSite = data.map.dataList[0].drawingSite
                this.dataForm.drawingDescription = data.map.dataList[0].drawingDescription
                this.dataForm.isSync = data.map.dataList[0].isSync
                this.imgList = data.map.imgList
              }
            })
          }
        })
      }
    }
  }
</script>
