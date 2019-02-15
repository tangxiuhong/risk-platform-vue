<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="检查位置" prop="troublePosition">
      <el-input v-model="dataForm.troublePosition" placeholder="检查位置" :disabled="dataForm.id && dataForm.status!=0"></el-input>
    </el-form-item>
    <el-form-item label="问题" prop="troubleDescription">
      <el-input type="textarea" v-model="dataForm.troubleDescription" placeholder="问题" :disabled="dataForm.id && dataForm.status!=0"></el-input>
    </el-form-item>
    <el-form-item label="临时控制措施" prop="measure">
      <el-input type="textarea" v-model="dataForm.measure" placeholder="临时控制措施" :disabled="dataForm.id && dataForm.status!=0"></el-input>
    </el-form-item>
    <el-form-item label="安全检查类型" prop="checkType">
      <el-input  v-model="dataForm.checkTypeName" placeholder="问题" disabled></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="">
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
          <el-button slot="trigger" size="small" type="primary"  :disabled="dataForm.id && dataForm.status!=0">点击上传
          </el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="dataForm.id && dataForm.status!=0">上传到服务器
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
        </el-upload>

        <el-carousel :interval="4000" type="card" height="330px" v-if="imgList.length>0"
                     style="border:1px solid #fff;">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.name }}</h3>
            <img :src="item.url" alt="picture" style="width:100%;height:80%;">
          </el-carousel-item>
        </el-carousel>
    </el-form-item>
    <el-form-item label="检查时间" prop="checkTime">
      <el-date-picker
        v-model="dataForm.checkTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder=""  :disabled="dataForm.id && dataForm.status!=0" >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="报送到部门" prop="departmentId">
      <el-select v-model="dataForm.departmentName" clearable filterable placeholder="请选择上报部门" :disabled="dataForm.id && dataForm.status!=0" @change=departmentChange>
        <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="接受人" prop="manId">
      <el-select v-model="dataForm.manId"   filterable :disabled="dataForm.id && dataForm.status!=0" >
        <el-option
          v-for="item in manList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="检查人" prop="checkMan">
        <el-input v-model="dataForm.checkManName" placeholder="检查人" disabled ></el-input>
    </el-form-item>
      <el-form-item label="辨识说明" prop="state" v-if="dataForm.status ==1 || dataForm.status ==2">
       <el-input type="textarea" v-model="dataForm.state" placeholder="辨识说明" :disabled="dataForm.id && dataForm.status ==2"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" :readonly="!btnView">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit('0')" v-if="dataForm.status ==0 " :disabled="dataForm.id && dataForm.status!=0">保存</el-button>
      <el-button type="primary" @click="dataFormSubmit('1')" v-if="dataForm.status ==0 " :disabled="dataForm.id && dataForm.status!=0">提交</el-button>
      <el-button type="primary"  @click="addTroubleHandle(dataForm.id)" v-if="dataForm.status ==1 && btnView" :disabled="dataForm.id && dataForm.status ==2 ">生成隐患</el-button>
      <el-button type="primary"  @click="dataFormSubmit('2')" v-if="dataForm.status ==1 && !btnView" :disabled="dataForm.id && dataForm.status ==2 ">保存隐患</el-button>
      <el-button type="primary" @click="dataFormSubmit('3')" v-if="dataForm.status ==1 " :disabled="(dataForm.id && dataForm.status ==3) || !btnView">关闭</el-button>
    </span>
    <!-- 弹窗, 新增 -->
    <addTrouble v-if="addTroubleVisible" ref="addTrouble"   @troubleHides="troubleHide" @getTroubleNum="getTroubleNums"></addTrouble>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate, getLocalAddr} from '@/utils'
  import AddTrouble from './enterpriseRiskassessTroublecheck-addTrouble'
  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        imgList: [],
        addOrUpdateVisible: false,
        addTroubleVisible: false,
        btnView: true,
        dataForm: {
          id: 0,
          troublePosition: '',
          troubleDescription: '',
          measure: '',
          checkMan: '',
          checkManName: '',
          troubleNum: '',
          checkType: 5,
          checkTypeName: '自主管理',
          checkTime: '',
          departmentId: '',
          departmentName: '',
          manId: '',
          status: 0,
          state: ''
        },
        dataRule: {
          troublePosition: [
            { required: true, message: '检查位置不能为空', trigger: 'blur' }
          ],
          troubleDescription: [
            { required: true, message: '问题不能为空', trigger: 'blur' }
          ],
          checkMan: [
            { required: true, message: '检查人不能为空', trigger: 'blur' }
          ],
          checkType: [
            { required: true, message: '安全检查类型不能为空', trigger: 'blur' }
          ],
          checkTime: [
            { required: true, message: '检查时间不能为空', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '报送到部门不能为空', trigger: 'blur' }
          ],
          manId: [
            { required: true, message: '接受人不能为空', trigger: 'blur' }
          ]
        },
        options: [{
          value: 1,
          label: '安全综合检查'
        }, {
          value: 2,
          label: '专业安全检查'
        }, {
          value: 3,
          label: '专项安全检查'
        }, {
          value: 4,
          label: '日常检查'
        }],
        options1: [{
          value: 1,
          label: '一般隐患'
        }, {
          value: 2,
          label: '重大隐患'
        }],
        manList: [],
        //  企业单位
        deptList: []
      }
    },
    components: {
      AddTrouble
    },
    methods: {
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      //  获取当前时间
      getNowFormatDate () {
        var date = new Date()
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + ' ' + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds()
        return currentdate
      },
      init (id) {
        this.manList = []
        this.resetForm('dataForm')
        this.dataForm.status = 0
        this.dataForm.checkTime = this.getNowFormatDate()
        this.dataForm.departmentName = ''
        this.dataForm.id = id || 0
        this.visible = true
        if (!this.dataForm.id) {
         // 获取部门及用户
          this.getUserAndDepartment()
        }
        this.initDepartmentList()
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseRiskassessTroublecheck/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.enterpriseRiskassessTroublecheck.id
                this.dataForm.troublePosition = data.enterpriseRiskassessTroublecheck.troublePosition
                this.dataForm.troubleDescription = data.enterpriseRiskassessTroublecheck.troubleDescription
                this.dataForm.measure = data.enterpriseRiskassessTroublecheck.measure
                this.dataForm.checkMan = data.enterpriseRiskassessTroublecheck.checkMan
                this.dataForm.checkManName = data.enterpriseRiskassessTroublecheck.checkManName
                this.dataForm.checkType = data.enterpriseRiskassessTroublecheck.checkType
                this.dataForm.checkTime = data.enterpriseRiskassessTroublecheck.checkTime
                this.dataForm.departmentId = data.enterpriseRiskassessTroublecheck.departmentId
                this.dataForm.manId = data.enterpriseRiskassessTroublecheck.manId
                this.dataForm.status = data.enterpriseRiskassessTroublecheck.status
                this.dataForm.state = data.enterpriseRiskassessTroublecheck.state
                this.deptListTreeSetCurrentNode()
                this.getPerson(this.dataForm.departmentId, 0)
              }
            })
          }
          // 隐患图片上传内容开始
          this.uploadUrl = this.$http.adornUrl(`/trouble/enterpriseRiskassessTroublecheck/uploadTroubleFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseRiskassessTroublecheck/checkLookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                //  放隐患图片列表
                var list1 = data.dataList[0].list1
                var x
                for (x in list1) {
                  var localAddr = getLocalAddr(list1[x].attachmentPath)
                  var f = {name: list1[x].attachmentName, url: localAddr, id: list1[x].id}
                  this.fileList.push(f)
                  var fi = {name: list1[x].attachmentName, url: localAddr}
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(list1[x].attachmentName)) {
                    this.imgList.push(fi)
                  }
                }
              }
              console.log('imgList:' + this.imgList)
            })
          }
          // 隐患图片上传内容结束
        })
      },
      troubleHide () {
        this.addTroubleVisible = false
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/trouble/enterpriseRiskassessTroublecheck/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseRiskassessTroublecheck/deleteFileByName?fileName=' + fileName
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
      },
       initDepartmentList () {
        this.deptList = []
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseRiskassessTroublecheck/listDepartments'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            this.deptList = data.list;
          }
        })
      },

      departmentChange (eventId) {
        this.dataForm.departmentId = eventId;
        this.initManList();
      },

      initManList () {
        this.manList = [];
        if (this.dataForm.departmentId && this.dataForm.departmentId != '') {
          var orgId = this.dataForm.departmentId;
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseRiskassessTroublecheck/listUsersByDepartment/' + orgId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0 && data.list) {
              this.manList = data.list;
            }
          })
        }
      },
      // 获取用户信息
      getUserAndDepartment () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getUserAndDepartment`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.checkMan = data.dataMap.userId
            this.dataForm.checkManName = data.dataMap.userName
          }
        })
      },
      //  进入到新增页面
      addTroubleHandle (id) {
        this.addTroubleVisible = true
        this.$nextTick(() => {
          this.$refs.addTrouble.init(id)
        })
      },
      // 获取隐患单号
      getTroubleNums (troubleNum) {
        this.btnView = false
        this.dataForm.troubleNum = troubleNum
      },
      // 表单提交
      dataFormSubmit (status) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseRiskassessTroublecheck/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'troublePosition': this.dataForm.troublePosition,
                'troubleDescription': this.dataForm.troubleDescription,
                'measure': this.dataForm.measure,
                'checkMan': this.dataForm.checkMan,
                'checkType': this.dataForm.checkType,
                'troubleNum': this.dataForm.troubleNum,
                'checkTime': this.dataForm.checkTime,
                'departmentId': this.dataForm.departmentId,
                'manId': this.dataForm.manId,
                'state': this.dataForm.state,
                'status': status
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
