<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-row :gutter="10">
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="所属企业" prop="eid">
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
          <el-form-item label="告知卡分类" prop="positionGroup">
            <!--<el-radio-group v-model="dataForm.positionGroup">
              <el-radio :label="0">场所</el-radio>
              <el-radio :label="1">设备设施</el-radio>
              <el-radio :label="2">岗位</el-radio>
            </el-radio-group>-->
            <el-select v-model="dataForm.positionGroup" placeholder="告知卡分类">
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
          <el-form-item label="风险点名称" prop="riskPosition">
            <el-input v-model="dataForm.riskPosition" placeholder="风险点名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险类型" prop="riskClassify">
            <el-input v-model="dataForm.riskClassify" placeholder="风险类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="可能导致的后果" prop="riskResult">
            <el-input type="textarea" v-model="dataForm.riskResult" style="border-radius:5px;"
                      placeholder="请输入可能导致的后果"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险管控措施" prop="measures">
            <el-input type="textarea" v-model="dataForm.measures" style="border-radius:5px;"
                      placeholder="请输入风险管控措施"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="操作规程" prop="disposeRule">
            <el-input type="textarea" v-model="dataForm.disposeRule" style="border-radius:5px;"
                      placeholder="请输入操作(处理)规程"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="责任人" prop="person">
            <el-input v-model="dataForm.person" placeholder="责任人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="应急电话" prop="telephone">
            <el-input v-model="dataForm.telephone" placeholder="应急电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="警示标志" prop="">
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
  import {isPhone} from '@/utils/validate'
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('固定电话格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        imgList: [],
        carouselVisible: false,
        dataForm: {
          id: 0,
          eid: '',
          positionGroup: 0,
          riskPosition: '',
          riskClassify: '',
          riskResult: '',
          measures: '',
          disposeRule: '',
          warningMark: '',
          person: '',
          telephone: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: 0
        },
        options: [{
          value: 0,
          label: '场所'
        }, {
          value: 1,
          label: '设备设施'
        }, {
          value: 2,
          label: '岗位'
        }],
        // 选择企业eid
        eIdCodeOptions: [],
        dataRule: {
          eid: [
            {required: false, message: '企业不能为空', trigger: 'blur'}
          ],
          positionGroup: [
            {required: true, message: '告知卡分类不能为空', trigger: 'blur'}
          ],
          riskPosition: [
            {required: true, message: '重点部位不能为空', trigger: 'blur'}
          ],
          riskClassify: [
            {required: true, message: '风险类型不能为空', trigger: 'blur'}
          ],
          riskResult: [
            {required: true, message: '可能导致的后果不能为空', trigger: 'blur'}
          ],
          measures: [
            {required: true, message: '风险管控措施不能为空', trigger: 'blur'},
            {max: 800, message: '长度不超过800个字符', trigger: 'blur'}
          ],
          disposeRule: [
            {required: true, message: '操作（处理）规程不能为空', trigger: 'blur'}
          ],
          warningMark: [
            {required: true, message: '警示标志不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '管理（责任）人不能为空', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '应急电话不能为空', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
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
          this.uploadUrl = this.$http.adornUrl(`/enterprise/enterpriseRiskCard/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCard/listFile/${this.dataForm.id}`),
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
                    url: this.$http.adornUrl(`/enterprise/enterpriseRiskCard/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.dataForm.eid = data.enterpriseRiskCard.eid
                      this.dataForm.positionGroup = data.enterpriseRiskCard.positionGroup
                      this.dataForm.riskPosition = data.enterpriseRiskCard.riskPosition
                      this.dataForm.riskClassify = data.enterpriseRiskCard.riskClassify
                      this.dataForm.riskResult = data.enterpriseRiskCard.riskResult
                      this.dataForm.measures = data.enterpriseRiskCard.measures
                      this.dataForm.disposeRule = data.enterpriseRiskCard.disposeRule
                      this.dataForm.warningMark = data.enterpriseRiskCard.warningMark
                      this.dataForm.person = data.enterpriseRiskCard.person
                      this.dataForm.telephone = data.enterpriseRiskCard.telephone
                      this.dataForm.createTime = data.enterpriseRiskCard.createTime
                      this.dataForm.updateTime = data.enterpriseRiskCard.updateTime
                      this.dataForm.createUser = data.enterpriseRiskCard.createUser
                      this.dataForm.updateUser = data.enterpriseRiskCard.updateUser
                      this.dataForm.parameter1 = data.enterpriseRiskCard.parameter1
                      this.dataForm.parameter2 = data.enterpriseRiskCard.parameter2
                      this.dataForm.isSync = data.enterpriseRiskCard.isSync
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
          url = '/enterprise/enterpriseRiskCard/deleteFileById?id=' + id
        } else {
          url = '/enterprise/enterpriseRiskCard/deleteFileByName?fileName=' + fileName
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCard/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'positionGroup': this.dataForm.positionGroup,
                'riskPosition': this.dataForm.riskPosition,
                'riskClassify': this.dataForm.riskClassify,
                'riskResult': this.dataForm.riskResult,
                'measures': this.dataForm.measures,
                'disposeRule': this.dataForm.disposeRule,
                'warningMark': this.dataForm.warningMark,
                'person': this.dataForm.person,
                'telephone': this.dataForm.telephone,
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
<style>
  .el-radio {
    margin: 10px 0 !important;
  }
</style>
