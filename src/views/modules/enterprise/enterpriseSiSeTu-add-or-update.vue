<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '新增/修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <div class="enterpriseSiSeTu_content">
        <p class="enterpriseSiSeTu_title" align="center" style="font-weight: bold;font-size: 18px;"><span
          v-text="enterpriseName"></span></p>
        <div class="enterpriseSiSeTu_button">
          <div class="enterpriseSiSeTu_left">
            <el-carousel :interval="4000" arrow="always" height="400px" v-if="carouselVisible"
                         style="border:1px solid #fff">
              <el-carousel-item v-for="item in imgList" :key="item.name">
                <h3>{{ item.name }}</h3>
                <img :src="item.url" alt="picture" width="100%" height="80%">
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="enterpriseSiSeTu_right">
            <el-form-item label="风险分布图类型: " prop="">
              <el-select v-model="dataForm.riskType" placeholder="风险分布图类型" @change="changeEnterprise">
                <el-option
                  v-for="item in Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件上传: " prop="">
              <el-upload
                ref="upload"
                class="upload-recordDetail"
                :action="uploadUrl"
                name="file"
                :auto-upload="false"
                multiple
                :file-list="fileList"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                :on-change="handleChange">
                <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        enterpriseName: '',
        imgList: [],
        dataForm: {
          id: 0,
          riskType: 1
        },
        Options: [{
          value: 1,
          label: '四色分布图'
        }, {
          value: 2,
          label: '作业比较图'
        }],
        dataRule: {}
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/enterprise/sysEnterprise/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysEnterprise/listFile/1/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr =getLocalAddr(sysFiles[x].attachmentPath); 
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
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/enterprise/sysEnterprise/getEnterpriseNameById/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  var list = data.list
                  var y
                  for (y in list) {
                    this.enterpriseName = list[y].enterpriseName
                  }
                }
              })
            })
          }
        })
      },
      submitUpload () {
        this.$refs.upload.submit()
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
      },
      changeEnterprise () {
        this.dataForm.riskType = this.dataForm.riskType
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/enterprise/sysEnterprise/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysEnterprise/listFile/${this.dataForm.riskType}/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr =getLocalAddr(sysFiles[x].attachmentPath); 
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
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysEnterprise/saveAttachment/${this.dataForm.riskType}/${this.dataForm.id}`),
              method: 'post',
              data: this.$http.adornData()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .enterpriseSiSeTu_content {
    width: 100%;
    height: 450px;
  }

  .enterpriseSiSeTu_title {
    width: 100%;
    height: 30px;
  }

  .enterpriseSiSeTu_button {
    width: 100%;
    height: 420px;
  }

  .enterpriseSiSeTu_left {
    width: 60%;
    height: 420px;
    float: left;
  }

  .enterpriseSiSeTu_right {
    width: 40%;
    height: 420px;
    float: left;
  }
</style>
