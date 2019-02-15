<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="预案名称" prop="planName">
        <el-input v-model="dataForm.planName" placeholder="预案名称" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="预案编号" prop="planCode">
        <el-input v-model="dataForm.planCode" placeholder="预案编号" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="所属行业" prop="varName">
        <el-input v-model="dataForm.varName" placeholder="所属行业" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="预案描述" prop="planDesc">
        <el-input type="textarea" v-model="dataForm.planDesc" style="border-radius:5px;"
                  placeholder="请输入预案描述" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="提交时间" prop="submitTime">
        <el-date-picker v-model="dataForm.submitTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="提交时间" :disabled="true"></el-date-picker>
      </el-form-item>
      <el-form-item label="上传归属" prop="uploadAscriptionType">
        <el-radio-group v-model="dataForm.uploadAscriptionType" :disabled="true">
          <el-radio :label="0">企业</el-radio>
          <el-radio :label="1">监管部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="附件列表：" prop="imgList">
        <el-upload
          ref="upload"
          class="upload-recordDetail"
          :action="uploadUrl"
          name="file"
          :auto-upload="false"
          :disabled="true"
          multiple
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :on-change="handleChange">
        </el-upload>

        <el-carousel :interval="3000" arrow="always" height="330px" v-if="imgList.length>0">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <!-- 图片 -->
            <div style="width:100%;height:100%;">
              <h3>{{ item.name }}</h3>
              <img :src="item.url" alt="picture" width="100%" height="80%">
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
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        carouselVisible: false,
        dataForm: {
          id: 0,
          planName: '',
          planCode: '',
          businessType: '',
          planDesc: '',
          submitTime: '',
          fileName: '',
          fileUrl: '',
          uploadAscriptionType: 0,
          uploadAscriptionId: '',
          uploadUser: '',
          uploadTime: '',
          isSync: 0,
          varName: ''
        },
        imgList: [],
        dataRule: {}
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/emergency/emergencyPlan/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyPlan/listFile/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr = getLocalAddr(sysFiles[x].attachmentPath) // 判断并变更地址
                  var f = {name: sysFiles[x].attachmentName, url: localAddr, id: sysFiles[x].id}
                  this.fileList.push(f)
                  var fi = {name: sysFiles[x].attachmentName, url: localAddr}
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                    this.imgList.push(fi)
                  }
                  if (this.imgList.length > 0) {
                    this.carouselVisible = true
                  }
                }
              }
              if (this.dataForm.id) {
                this.$http({
                  url: this.$http.adornUrl(`/emergency/emergencyPlan/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (this.dataForm.id) {
                    this.$http({
                      url: this.$http.adornUrl(`/emergency/emergencyPlan/lookInfo/${this.dataForm.id}`),
                      method: 'get',
                      params: this.$http.adornParams()
                    }).then(({data}) => {
                      if (data && data.code === 0) {
                        this.dataForm.id = data.dataMap.dataList[0].id
                        this.dataForm.planName = data.dataMap.dataList[0].planName
                        this.dataForm.planCode = data.dataMap.dataList[0].planCode
                        this.dataForm.varName = data.dataMap.dataList[0].varName
                        this.dataForm.planDesc = data.dataMap.dataList[0].planDesc
                        this.dataForm.submitTime = data.dataMap.dataList[0].submitTime
                        this.dataForm.uploadAscriptionType = data.dataMap.dataList[0].uploadAscriptionType
                      }
                    })
                  }
                })
              }
            })
          }
        })
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/emergency/emergencyPlan/deleteFileById?id=' + id
        } else {
          url = '/emergency/emergencyPlan/deleteFileByName?fileName=' + fileName
        }
        if (url) {
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        this.handleChange(file, fileList)
      },
      handlePreview (file, fileList) {
        // console.log(file, fileList)
        window.open(file.url)
      },
      handleChange (file, fileList) {
        this.imgList = []
        var x
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url}
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.imgList.push(fi)
          }
        }
        if (this.imgList.length > 0) {
          this.carouselVisible = true
        } else {
          this.carouselVisible = false
        }
      }
    }
  }
</script>
