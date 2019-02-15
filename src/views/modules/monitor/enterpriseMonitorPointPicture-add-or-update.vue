<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px">
    <el-form-item label="企业名称" prop="enterpriseId">
      <el-select v-model="dataForm.enterpriseId" filterable placeholder="企业名称" @focus="getEnterpriseTree()" >
        <el-option
          v-for="item in eidOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="监测点分布图名称" prop="pictureName">
      <el-input v-model="dataForm.pictureName" placeholder="监测点分布图名称"></el-input>
    </el-form-item>
    <el-form-item label="说明" prop="pictureDesc">
      <el-input v-model="dataForm.pictureDesc" placeholder="说明"></el-input>
    </el-form-item>
    <el-form-item label="分布图图" prop="">
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
          enterpriseId: '',
          enterpriseName: '',
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
        eidOptions: [],
        dataRule: {
          enterpriseId: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          pictureName: [
            { required: true, message: '监测点分布图名称不能为空', trigger: 'blur' }
          ],
          pictureDesc: [
            { required: true, message: '说明不能为空', trigger: 'blur' }
          ],
          pictureUrl: [
            { required: true, message: '平面图访问url不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id, enterpriseName) {
        this.dataForm.id = id || 0
        this.dataForm.enterpriseId = enterpriseName
        this.visible = true
        this.uploadUrl = this.$http.adornUrl(`/monitor/enterpriseMonitorPointPicture/uploadSvgFile?token=` + this.$cookie.get('token'))
        this.fileList = []
        this.imgList = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/enterpriseMonitorPointPicture/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.enterpriseId = data.enterpriseMonitorPointPicture.enterpriseId
                this.dataForm.pictureName = data.enterpriseMonitorPointPicture.pictureName
                this.dataForm.pictureDesc = data.enterpriseMonitorPointPicture.pictureDesc
                this.dataForm.pictureUrl = data.enterpriseMonitorPointPicture.pictureUrl
                var sysFile = data.imgList
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
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/monitor/enterpriseMonitorPointPicture/deleteFileById?id=' + id
        } else {
          url = '/monitor/enterpriseMonitorPointPicture/deleteFileByName?fileName=' + fileName
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
        this.fileList = fileList
      },
      handleUpload (file) {
        if (/\.(SVG|svg)$/.test(file.name)) {
          return true
        } else {
          this.$message.error('文件格式错误')
          return false
        }
      },
      // 表单提交
      dataFormSubmit () {
        if (this.fileList.length <= 0) {
          this.$message.error('请上传分布图')
          return
        } else {
          var rt = this.fileList[0].status
          if (!rt ||　rt != 'success') {
            this.$message.error('请上传分布图1')
            return
          }
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/enterpriseMonitorPointPicture/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'enterpriseId': this.dataForm.enterpriseId,
                'pictureName': this.dataForm.pictureName,
                'pictureDesc': this.dataForm.pictureDesc,
                'pictureUrl': this.dataForm.pictureUrl
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
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eidOptions = data.list
          } else {
            this.eidOptions = []
          }
        })
      }
    }
  }
</script>
