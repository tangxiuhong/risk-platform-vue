<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-row>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="所属企业">
            <el-select v-model="dataForm.eid" filterable placeholder="所属企业" clearable>
              <el-option
                v-for="item in eIdCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="文件类型" prop="fileGroup">
            <!--<el-radio-group v-model="dataForm.fileGroup">
              <el-radio :label="1">管控措施</el-radio>
              <el-radio :label="2">分级管控制度</el-radio>
            </el-radio-group>-->
            <el-select v-model="dataForm.fileGroup" placeholder="文件类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="管控措施名称" prop="planName">
            <el-input v-model="dataForm.planName" placeholder="管控措施名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="dataForm.description" style="border-radius:5px;"
                      placeholder="请输入简介"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="dataForm.memo" style="border-radius:5px;" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业证照" prop="">
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

            <el-carousel :interval="4000" type="card" height="200px" v-if="carouselVisible"
                         style="border:1px solid #fff">
              <el-carousel-item v-for="item in imgList" :key="item.name">
                <h3>{{ item.name }}</h3>
                <img :src="item.url" alt="picture" width="100%" height="80%">
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
        </el-col>
      </el-row>
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
          eid: '',
          fileGroup: 1,
          planName: '',
          description: '',
          memo: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: 0
        },
        options: [{
          value: 1,
          label: '管控措施'
        }, {
          value: 2,
          label: '分级管控制度'
        }],
        // 企业对应主表eid
        eIdCodeOptions: [],
        dataRule: {
          eid: [
            {required: true, message: '企业不能为空', trigger: 'blur'}
          ],
          fileGroup: [
            {required: true, message: '文件类型不能为空', trigger: 'blur'}
          ],
          planName: [
            {required: true, message: '管控措施名称不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '简介不能为空', trigger: 'blur'}
          ],
          memo: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '记录创建时间不能为空', trigger: 'blur'}
          ],
          updateTime: [
            {required: true, message: '记录最后修改时间不能为空', trigger: 'blur'}
          ],
          createUser: [
            {required: true, message: '记录创建者(用户)不能为空', trigger: 'blur'}
          ],
          updateUser: [
            {required: true, message: '记录最后修改者(用户)不能为空', trigger: 'blur'}
          ],
          parameter1: [
            {required: true, message: '预留1不能为空', trigger: 'blur'}
          ],
          parameter2: [
            {required: true, message: '预留2不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/list'),
          method: 'get',
          params: this.$http.adornParams({
            'eId': this.dataForm.eId
          })
        })
      },
      // 获取企业主表id树
      getEIDTree () {
        var _this = this
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),    // -------------------------改成企业eid路径
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.list.length === 1) {
                _this.eIdCodeOptions = data.list
                _this.dataForm.eid = data.list[0].value
              } else {
                _this.eIdCodeOptions = data.list
              }
            } else {
              _this.eIdCodeOptions = []
            }
          })
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getEIDTree()
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/listFile/${this.dataForm.id}`),
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
              this.$nextTick(() => {
                if (this.dataForm.id) {
                  this.$http({
                    url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.dataForm.eid = data.enterpriseRiskPlanning.eid
                      this.dataForm.fileGroup = data.enterpriseRiskPlanning.fileGroup
                      this.dataForm.planName = data.enterpriseRiskPlanning.planName
                      this.dataForm.description = data.enterpriseRiskPlanning.description
                      this.dataForm.memo = data.enterpriseRiskPlanning.memo
                      this.dataForm.createTime = data.enterpriseRiskPlanning.createTime
                      this.dataForm.updateTime = data.enterpriseRiskPlanning.updateTime
                      this.dataForm.createUser = data.enterpriseRiskPlanning.createUser
                      this.dataForm.updateUser = data.enterpriseRiskPlanning.updateUser
                      this.dataForm.parameter1 = data.enterpriseRiskPlanning.parameter1
                      this.dataForm.parameter2 = data.enterpriseRiskPlanning.parameter2
                      this.dataForm.isSync = data.enterpriseRiskPlanning.isSync
                      this.getEIDTree()
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
          url = '/enterprise/enterpriseRiskPlanning/deleteFileById?id=' + id
        } else {
          url = '/enterprise/enterpriseRiskPlanning/deleteFileByName?fileName=' + fileName
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'fileGroup': this.dataForm.fileGroup,
                'planName': this.dataForm.planName,
                'description': this.dataForm.description,
                'memo': this.dataForm.memo,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
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
