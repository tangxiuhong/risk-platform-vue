<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="企业名称" prop="eid">
        <el-select v-model="dataForm.eid" filterable placeholder="企业名称" @focus="getEnterpriseTree()">
          <el-option
            v-for="item in eidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传感器名称" prop="drawingName">
        <el-input v-model="dataForm.drawingName" placeholder="安装的传感器名称"></el-input>
      </el-form-item>
      <el-form-item label="安装位置" prop="drawingSite">
        <el-input v-model="dataForm.drawingSite" placeholder="安装位置"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="drawingDescription">
        <el-input v-model="dataForm.drawingDescription" placeholder="说明"></el-input>
      </el-form-item>
      <el-form-item label="是否同步" prop="isSync">
        <el-radio-group v-model="dataForm.isSync">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监测点安装图" prop="">
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
          <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
        </el-upload>

        <el-carousel :interval="3000" type="card" height="300px" v-if="carouselVisible" style="border:1px solid #fff">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <h3>{{ item.name }}</h3>
            <img :src="item.url" alt="picture" width="100%" height="100%">
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        carouselVisible: false,
        dataForm: {
          id: 0,
          eid: '',
          drawingName: '',
          drawingSite: '',
          drawingDescription: '',
          isSync: 0
        },
        eidOptions: [],
        dataRule: {
          eid: [
            {required: true, message: '所属企业不能为空', trigger: 'blur'}
          ],
          drawingName: [
            {required: true, message: '传感器名称不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          drawingSite: [
            {required: true, message: '安装位置不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          drawingDescription: [
            {required: true, message: '说明不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '是否同步不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/monitor/sensorInstallationDrawing/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/sensorInstallationDrawing/listFileUpload/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var f = {name: sysFiles[x].attachmentName, url: sysFiles[x].attachmentPath, id: sysFiles[x].id}
                  this.fileList.push(f)
                  var fi = {name: sysFiles[x].attachmentName, url: sysFiles[x].attachmentPath}
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                    this.imgList.push(fi)
                  }
                  if (this.imgList.length > 0) {
                    this.carouselVisible = true
                  }
                }
              }
              this.$nextTick(() => {
                if (this.dataForm.id) {
                  this.$http({
                    url: this.$http.adornUrl(`/monitor/sensorInstallationDrawing/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.dataForm.id = data.sensorInstallationDrawing.id
                      this.dataForm.eid = data.sensorInstallationDrawing.eid
                      this.dataForm.drawingName = data.sensorInstallationDrawing.drawingName
                      this.dataForm.drawingSite = data.sensorInstallationDrawing.drawingSite
                      this.dataForm.drawingDescription = data.sensorInstallationDrawing.drawingDescription
                      this.dataForm.isSync = data.sensorInstallationDrawing.isSync
                      this.getEnterpriseTree()
                    }
                  })
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
          url = '/monitor/sensorInstallationDrawing/deleteFileById?id=' + id
        } else {
          url = '/monitor/sensorInstallationDrawing/deleteFileByName?fileName=' + fileName
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/sensorInstallationDrawing/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'drawingName': this.dataForm.drawingName,
                'drawingSite': this.dataForm.drawingSite,
                'drawingDescription': this.dataForm.drawingDescription,
                'isSync': this.dataForm.isSync
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
