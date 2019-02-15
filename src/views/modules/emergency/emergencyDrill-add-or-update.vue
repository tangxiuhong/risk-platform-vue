<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="演练名称" prop="drillName">
        <el-input v-model="dataForm.drillName" placeholder="演练名称"></el-input>
      </el-form-item>
      <el-form-item label="演练时间" prop="drillTime">
        <el-date-picker v-model="dataForm.drillTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="演练时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="演练方式" prop="drillType">
        <el-select v-model="dataForm.drillType" placeholder="演练方式">
          <el-option
            v-for="item in drillTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="演练备注" prop="drillRemark">
        <el-input type="textarea" v-model="dataForm.drillRemark" style="border-radius:5px;"
                  placeholder="请输入演练备注"></el-input>
      </el-form-item>
      <el-form-item label="上传归属类型" prop="uploadAscriptionType">
        <el-select v-model="dataForm.uploadAscriptionType" placeholder="上传归属类型" @change="changeUpLoadAscriptionType">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传归属" prop="uploadAscriptionId">
        <el-select v-model="dataForm.uploadAscriptionId" filterable placeholder="上传归属">
          <el-option
            v-for="item in AscriptionIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件上传" prop="">
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

        <el-carousel :interval="4000" type="card" height="200px" v-if="carouselVisible" style="border:1px solid #fff">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <h3>{{ item.name }}</h3>
            <img :src="item.url" alt="picture" width="100%" height="80%">
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
  import {getLocalAddr} from '@/utils'
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
          drillName: '',
          drillTime: '',
          drillType: '',
          drillRemark: '',
          drillImgUrl: '',
          uploadAscriptionType: 0,
          uploadAscriptionId: '',
          uploadUser: '',
          uploadTime: '',
          fileNames: '',
          isSync: 0
        },
        AscriptionIdOptions: [],
        options: [{
          value: 0,
          label: '企业'
        }, {
          value: 1,
          label: '监管部门'
        }],
        dataRule: {
          drillName: [
            {required: true, message: '演练名称不能为空', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}
          ],
          drillTime: [
            {required: true, message: '演练时间不能为空', trigger: 'blur'}
          ],
          drillType: [
            {required: true, message: '演练方式不能为空', trigger: 'blur'}
          ],
          drillRemark: [
            {required: true, message: '演练备注不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          drillImgUrl: [
            {required: true, message: '演练记录（上传图片）不能为空', trigger: 'blur'}
          ],
          uploadAscriptionType: [
            {required: true, message: '上传归属类型不能为空', trigger: 'blur'}
          ],
          uploadAscriptionId: [
            {required: true, message: '上传归属不能为空', trigger: 'blur'}
          ],
          uploadUser: [
            {required: true, message: '上传人员不能为空', trigger: 'blur'}
          ],
          uploadTime: [
            {required: true, message: '上传时间不能为空', trigger: 'blur'}
          ],
          fileNames: [
            {required: true, message: '文件名列表不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '是否同步不能为空', trigger: 'blur'}
          ]
        },
        drillTypeOptions: [{
          value: 1,
          label: '桌面演练'
        }, {
          value: 2,
          label: '功能演练'
        }, {
          value: 3,
          label: '全面演练'
        }]
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.AscriptionIdOptions = data.list
          } else {
            this.AscriptionIdOptions = []
          }
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.uploadUrl = this.$http.adornUrl(`/emergency/emergencyDrill/uploadFile?token=` + this.$cookie.get('token'))
            this.fileList = []
            this.imgList = []
            this.carouselVisible = false
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/emergency/emergencyDrill/listFile/${this.dataForm.id}`),
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
                this.$nextTick(() => {
                  if (this.dataForm.id) {
                    this.$http({
                      url: this.$http.adornUrl(`/emergency/emergencyDrill/info/${this.dataForm.id}`),
                      method: 'get',
                      params: this.$http.adornParams()
                    }).then(({data}) => {
                      if (data && data.code === 0) {
                        this.dataForm.drillName = data.emergencyDrill.drillName
                        this.dataForm.drillTime = data.emergencyDrill.drillTime
                        this.dataForm.drillType = data.emergencyDrill.drillType
                        this.dataForm.drillRemark = data.emergencyDrill.drillRemark
                        this.dataForm.drillImgUrl = data.emergencyDrill.drillImgUrl
                        this.dataForm.uploadAscriptionType = data.emergencyDrill.uploadAscriptionType
                        this.dataForm.uploadAscriptionId = data.emergencyDrill.uploadAscriptionId
                        this.dataForm.uploadUser = data.emergencyDrill.uploadUser
                        this.dataForm.uploadTime = data.emergencyDrill.uploadTime
                        this.dataForm.fileNames = data.emergencyDrill.fileNames
                        this.dataForm.isSync = data.emergencyDrill.isSync
                      }
                    })
                  }
                })
              })
            }
          })
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
          url = '/emergency/emergencyDrill/deleteFileById?id=' + id
        } else {
          url = '/emergency/emergencyDrill/deleteFileByName?fileName=' + fileName
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
      changeUpLoadAscriptionType () {
        if (this.dataForm.uploadAscriptionType === 0) { // 说明是企业
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.AscriptionIdOptions = data.list
            } else {
              this.AscriptionIdOptions = []
            }
          })
        } else {  // 监管部门
          this.$http({
            url: this.$http.adornUrl('/sys/dic/selectTree/155'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.AscriptionIdOptions = data.list
            } else {
              this.AscriptionIdOptions = []
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyDrill/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'drillName': this.dataForm.drillName,
                'drillTime': this.dataForm.drillTime,
                'drillType': this.dataForm.drillType,
                'drillRemark': this.dataForm.drillRemark,
                'drillImgUrl': this.dataForm.drillImgUrl,
                'uploadAscriptionType': this.dataForm.uploadAscriptionType,
                'uploadAscriptionId': this.dataForm.uploadAscriptionId,
                'uploadUser': this.dataForm.uploadUser,
                'uploadTime': this.dataForm.uploadTime,
                'fileNames': this.dataForm.fileNames,
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
      }
    }
  }
</script>
