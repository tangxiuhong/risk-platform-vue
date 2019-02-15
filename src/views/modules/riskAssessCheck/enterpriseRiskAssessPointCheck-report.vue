<template>
  <el-dialog
    :title="'上报'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">

    <el-form :model="dataForm" ref="dataForm" :rules="dataRule"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="上报说明" prop="reqDesc">
        <el-input type="textarea" maxlength="512" autosize v-model="dataForm.reqDesc" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="上报部门" prop="departmentName">
        
        <el-select v-model="dataForm.departmentName" clearable filterable placeholder="请选择上报部门" @change=departmentChange>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="上报到人" prop="reqMan">
        <el-select v-model="dataForm.reqMan" clearable filterable>
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      class="upload-riskPointDetail"
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

    <el-carousel :interval="4000" type="card" height="200px" v-if="carouselVisible">
      <el-carousel-item v-for="item in imgList" :key="item.name">
        <h3>{{ item.name }}</h3>
        <img :src="item.url" alt="picture" width="100%" height="80%">
      </el-carousel-item>
    </el-carousel>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          checkId: '',
          reqDepartmentId: '',
          reqMan: '',
          reqDesc: '',
          departmentName: ''
        },
        uploadUrl: '',
        fileList: [],
        imgList: [],
        carouselVisible: false,
        deptList: [],
        personList: [],
        checkList: [],
        dataRule: {
         
          departmentName: [
            {required: true, message: '上报部门不能为空', trigger: 'blur'}
          ],
          reqMan: [
            {required: true, message: '上报到人不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    activated () {
    },
    methods: {
      init (checkDowfId, checkId, checkList) {
        this.dataForm.id = checkDowfId || 0
        this.dataForm.checkId = checkId || 0
        this.checkList = checkList
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            //  部门
            this.initDepartmentList();
          }
          // 文件上传
          this.uploadUrl = this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          this.$http({
            url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/listFile/${this.dataForm.id}`),
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
          url = '/riskAssess/enterpriseRiskAssessCheck/deleteFileById?id=' + id
        } else {
          url = '/riskAssess/enterpriseRiskAssessCheck/deleteFileByName?fileName=' + fileName
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
        console.log(file, fileList)
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

      initDepartmentList () {
        this.deptList = []
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/listDepartments'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            this.deptList = data.list;
          }
        })
      },

      departmentChange (eventId) {
        this.dataForm.reqDepartmentId = eventId;
        this.initManList();
      },

      initManList () {
        this.personList = [];
        if (this.dataForm.reqDepartmentId && this.dataForm.reqDepartmentId != '') {
          var orgId = this.dataForm.reqDepartmentId;
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/listUsersByDepartment/' + orgId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0 && data.list) {
              this.personList = data.list;
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/save`),
              method: 'post',
              data: this.checkList
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$http({
                  url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/saveCheckdowf`),
                  method: 'post',
                  data: this.$http.adornData({
                    'id': this.dataForm.id,
                    'checkId': this.dataForm.checkId,
                    'reqDepartmentId': this.dataForm.reqDepartmentId,
                    'reqMan': this.dataForm.reqMan,
                    'reqDesc': this.dataForm.reqDesc
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        this.visible = false
                        this.$emit('close')
                      }
                    })
                  } else {
                    this.$message.error(data.msg)
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

</style>
