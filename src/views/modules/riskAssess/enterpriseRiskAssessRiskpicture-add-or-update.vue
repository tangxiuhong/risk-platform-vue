<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">

    <el-form-item label="平面图名称" prop="pictureName" class="eFormItem">
      <el-input v-model="dataForm.pictureName" placeholder="平面图名称(非空)"></el-input>
    </el-form-item>
    <el-form-item label="平面图说明" prop="pictureDesc">
      <el-input type="textarea"  v-model="dataForm.pictureDesc" placeholder="平面图说明(非空)"></el-input>
    </el-form-item>
    <el-form-item label="平面图" prop="">
                <el-upload
                  ref="upload"
                  class="upload-riskPicture"
                  :action="uploadUrl"
                  name="file"
                  :limit=1
                  :auto-upload="false"
                  multiple
                  :file-list="fileList"
                  :on-remove="handleRemove"
                  :on-preview="handlePreview"
                  :on-change="handleChange"
                  :before-upload="handleUpload"
                  >
                  <el-button slot="trigger" size="small" type="primary" >点击上传</el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的SVG格式文件（viewBox:900X600）</div>
                </el-upload>
                <template v-if="imgList.length>0">
                  <img :src="imgList[0].url" alt="picture" style="width:100%;height:100%;">
                </template>
    </el-form-item>
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
        imgList: [],
        dataForm: {
          id: 0,
          eid: '',
          pictureName: '',
          pictureDesc: '',
          pictureUrl: '',
          createTime: '',
          createUser: '',
          updateTime: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          issync: ''
        },
        dataRule: {

          pictureName: [
            { required: true, message: '', trigger: 'blur' }
          ],
          pictureDesc: [
            { required: true, message: '', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        // 隐患图片上传内容开始
        this.uploadUrl = this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/uploadSvgFile?token=` + this.$cookie.get('token'))
        this.fileList = []
        this.imgList = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eid = data.enterpriseRiskassessRiskpicture.eid
                this.dataForm.pictureName = data.enterpriseRiskassessRiskpicture.pictureName
                this.dataForm.pictureDesc = data.enterpriseRiskassessRiskpicture.pictureDesc
                this.dataForm.pictureUrl = data.enterpriseRiskassessRiskpicture.pictureUrl
                this.dataForm.createTime = data.enterpriseRiskassessRiskpicture.createTime
                this.dataForm.createUser = data.enterpriseRiskassessRiskpicture.createUser
                this.dataForm.updateTime = data.enterpriseRiskassessRiskpicture.updateTime
                this.dataForm.updateUser = data.enterpriseRiskassessRiskpicture.updateUser
                this.dataForm.parameter1 = data.enterpriseRiskassessRiskpicture.parameter1
                this.dataForm.parameter2 = data.enterpriseRiskassessRiskpicture.parameter2
                this.dataForm.issync = data.enterpriseRiskassessRiskpicture.issync

                var sysFile = data.imgList;
                {
                  var localAddr = getLocalAddr(sysFile.attachmentPath)
                  var f = {name: sysFile.attachmentName, url: localAddr, id: sysFile.id}
                  this.fileList.push(f)
                  var fi = {name: sysFile.attachmentName, url: localAddr}
                  if (/\.(SVG|svg)$/.test(sysFile.attachmentName)) {
                    this.imgList.push(fi)
                  }
                }
              }
            })
          }
        })
      },
      submitUpload () {
        this.$refs.upload.submit();
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/riskAssess/enterpriseRiskAssessRiskpicture/deleteFileById?id=' + id
        } else {
          url = '/riskAssess/enterpriseRiskAssessRiskpicture/deleteFileByName?fileName=' + fileName
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
        window.open(file.url)
      },
      handleChange (file, fileList) {
        this.imgList = []
        var x
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url}
          if (/\.(SVG|svg)$/.test(fileList[x].name)) {
            this.imgList.push(fi)
          }
        }
        this.fileList = fileList;
      },
      handleUpload(file)
      {
        if (/\.(SVG|svg)$/.test(file.name)) {
          return true;
        }else{
         this.$message.error("文件格式错误");
          return false;
        }
      },
      // 表单提交
      dataFormSubmit () {
        if(this.fileList.length<=0)
        {
          this.$message.error("上传平面图");
          return;
        }else{
          var rt = this.fileList[0].status;
          if(!rt ||　rt != 'success')
          {
            this.$message.error("上传平面图");
            return;
          }
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'pictureName': this.dataForm.pictureName,
                'pictureDesc': this.dataForm.pictureDesc
              })
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
  .el-eFormItem {
    margin-bottom: 10px;
  }

</style>
