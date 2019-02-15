<template>
  <el-dialog
    :title="'产生隐患'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <div>
        <!-- 标题部分 -->
        <div class="title"><span>事故隐患整改指令书</span></div>
        <!-- 第一行 -->
        <div class="record_content clear">
          <el-row>
            <!-- 第一行 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="安全检查任务编号" prop="planNo">
                <el-select v-model="dataForm.planNo" placeholder="安全检查任务编号" :disabled="true">
                  <el-option
                    v-for="item in planNoList"
                    :key="item.planNo"
                    :label="item.planNo"
                    :value="item.planNo">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="安全检查类型" prop="checkType">
                <el-select v-model="dataForm.checkType" placeholder="安全检查类型" :disabled="true">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 插入行 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="风险单元" prop="riskUnit" v-if="dataForm.checkType ==6">
                <el-select v-model="dataForm.riskUnit" placeholder="风险单元" :disabled="true">
                  <el-option
                    v-for="item in riskUnitList"
                    :key="item.id"
                    :label="item.riskUnit"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="风险点" prop="riskPoint" v-if="dataForm.checkType == 6">
                <el-select v-model="dataForm.riskPoint" placeholder="风险点"
                           :disabled="true">
                  <el-option
                    v-for="item in riskPointList"
                    :key="item.id"
                    :label="item.riskPoint"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 第二行 -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="隐患编号" prop="troubleNum">
                <el-input v-model="dataForm.troubleNum" placeholder="隐患编号" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!-- 第三行 -->
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="责任单位" prop="departmentName">
                <el-select v-model="dataForm.departmentName" clearable filterable placeholder="请选择责任单位" @change=departmentChange>
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.departmentName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="责任人" prop="person">
                <el-select v-model="dataForm.person" :disabled="this.dataForm.status==1"  filterable>
                  <el-option
                    v-for="item in personList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="" prop="bookNo">
                <div style="float:left;">第</div>
                <div style="float:left;margin:0 10px;width:50%;">
                  <el-input v-model="dataForm.bookNo" placeholder="" :disabled="this.dataForm.status==1"></el-input>
                </div>
                <div sytle="float:left;">号</div>
              </el-form-item>
            </el-col>
            <!-- 第四行 -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="" prop="checkTime">
                <span> 在分公司(分公司、工区)</span>
                <el-date-picker
                  v-model="dataForm.checkTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="" :disabled="this.dataForm.status==1">
                </el-date-picker>
                <span>定期(日常)</span>
                <span style="color:blue;">{{dataForm.checkType==1 ? '安全综合检查': dataForm.checkType==2 ?
                  '专业安全检查': dataForm.checkType==3 ? '专项安全检查': dataForm.checkType==4 ? '日常检查':
                  dataForm.checkType==5 ? '自主管理': dataForm.checkType==6 ? '风险日常检查': '' }}</span>
                <span>中,发现您单位存在以下隐患(问题)：</span>
              </el-form-item>
            </el-col>
            <!-- 第五行 -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="" prop="troubleDescription">
                <el-input type="textarea" v-model="dataForm.troubleDescription" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </el-col>
            <!-- 第六行 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="临时控制措施" prop="measure">
                <el-input type="textarea" v-model="dataForm.measure" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="整改要求" prop="memo">
                <el-input type="textarea" v-model="dataForm.memo" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </el-col>
            <!-- 第七行 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="整改期限" prop="timeAffirm">
                <el-date-picker
                  v-model="dataForm.timeAffirm"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="" :disabled="this.dataForm.status==1">
                </el-date-picker>
                <span>之前</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="隐患级别" prop="troubleType">
                <el-select v-model="dataForm.troubleType" :disabled="this.dataForm.status==1">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 第八行 -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="隐患图片" prop="">
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
                  <el-button slot="trigger" size="small" type="primary" :disabled="this.dataForm.status==1">点击上传
                  </el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"
                             :disabled="this.dataForm.status==1">上传到服务器
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
            </el-col>
            <!-- 第九行 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="检查单位" prop="checkDepartmentName">
                <el-input v-model="dataForm.checkDepartmentName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="检查人" prop="checkManName">
                <el-input v-model="dataForm.checkManName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="填写人" prop="createUserName">
                <el-input v-model="dataForm.createUserName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit(0)" :disabled="this.dataForm.status==1">保存</el-button>
      <el-button type="primary" @click="dataFormSubmit(1)" :disabled="this.dataForm.status==1">发起整改</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import {getLocalAddr} from '@/utils'
  Date.prototype.format = function (format) {
    var o = {
      'M+': this.getMonth() + 1, // month
      'd+': this.getDate(), // day
      'h+': this.getHours(), // hour
      'm+': this.getMinutes(), // minute
      's+': this.getSeconds(), // second
      'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
      S: this.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  }

  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        imgList: [],
        riskUnitList: [],
        riskPointList: [],
        dataForm: {
          id: 0,
          planNo: '',
          checkType: 6,
          troubleNum: '',
          department: '',
          departmentName: '',
          person: '',
          bookNo: '',
          checkTime: '',
          troubleDescription: '',
          riskUnit: '',
          riskPoint: '',
          measure: '',
          memo: '',
          timeAffirm: '',
          troubleType: '',
          checkDepartment: '',
          checkDepartmentName: '',
          checkMan: '',
          checkManName: '',
          createUser: '',
          createUserName: '',
          status: '',
          checkDowfId: '',
          respMan: '',
          respDepartmentId: ''
        },
        dataRule: {
         
          departmentName: [
            {required: true, message: '责任单位不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '责任人不能为空', trigger: 'blur'}
          ],
          timeAffirm: [
            {required: true, message: '整改期限不能为空', trigger: 'blur'}
          ],
          troubleType: [
            {required: true, message: '隐患级别不能为空', trigger: 'blur'}
          ]
        },
        planNoList: [],
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
        }, {
          value: 6,
          label: '风险日常检查'
        }],
        options1: [{
          value: 1,
          label: '一般隐患'
        }, {
          value: 2,
          label: '重大隐患'
        }],
        personList: [],
        checkManList: [],
        //  企业单位
        deptList: []
      }
    },
    methods: {
      // 获取隐患流水号
      getTroubleNum (prex) {
        this.$http({
          url: this.$http.adornUrl(
            `/riskAssess/enterpriseRiskAssessResult/listEnterprisePrefix`
          ),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            var dt = new Date()
            var no = this.rnd(10, 99)
            this.dataForm.troubleNum = prex + dt.format('yyyyMMddhhmmss')
          }
        })
      },
      rnd (n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n)
        return random
      },
      // 获取安全检查任务编号
      getPlanNo () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getPlanNo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            for (var x in data.dataList) {
              if (data.dataList[x].checkType === 6) {
                this.dataForm.planNo = data.dataList[x].planNo
              }
            }
            this.planNoList = data.dataList
          }
        })
      },
      // 获取风险单元
      getRiskUnit () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getRiskUnit`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.dataList
          }
        })
      },
      // 获取风险点
      getRiskPoint () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getRiskPoint`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.dataList
          }
        })
      },

       getBookNo()
      {
        this.dataForm.bookNo = ''
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getBookNo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.bookNo = data.bookno
          }
        })
      },
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      init (checkDowfList, riskPointId, riskUnitId) {
        this.resetForm('dataForm')
        this.dataForm.checkDowfId = checkDowfList.id
        this.dataForm.respMan = checkDowfList.respMan
        this.dataForm.respDepartmentId = checkDowfList.respDepartmentId
        this.dataForm.riskPoint = riskPointId
        this.dataForm.riskUnit = riskUnitId
        this.visible = true
        // 通过风险点id查询风险单元id
        this.getRiskUnit()
        this.getRiskPoint()
        this.getTroubleNum('y')
        this.getPlanNo()
        this.getBookNo()
        // 获取部门及用户
        this.getUserAndDepartment()
        this.initDepartmentList()
       
          // 隐患图片上传内容开始
          this.uploadUrl = this.$http.adornUrl(`/trouble/enterpriseTroublerecord/uploadTroubleFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/checkLookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                //  放隐患图片列表
                var list1 = data.dataList[0].list1
                var x
                for (x in list1) {
                  var localAddr =getLocalAddr(list1[x].attachmentPath); 
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
      },
      getUserAndDepartment () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getUserAndDepartment`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.checkMan = data.dataMap.userId
            this.dataForm.checkManName = data.dataMap.userName
            this.dataForm.checkDepartmentName = data.dataMap.departmentName
            this.dataForm.checkDepartment = data.dataMap.department
            this.dataForm.createUser = data.dataMap.userId
            this.dataForm.createUserName = data.dataMap.userName
          }
        })
      },

      initDepartmentList () {
        this.actionDepartmentList = []
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/listDepartments'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            this.deptList = data.list;
          }
        })
      },
      departmentChange (eventId) {
        this.dataForm.department = eventId;
        this.initManList();
      },
      initManList () {
        this.personList = [];
        if (this.dataForm.department && this.dataForm.department != '') {
          var orgId = this.dataForm.department;
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/listUsersByDepartment/' + orgId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0 && data.list) {
              this.personList = data.list;
            }
          })
        }
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/trouble/enterpriseTroublerecord/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseTroublerecord/deleteFileByName/' + fileName
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
      // 表单提交
      dataFormSubmit (status) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'planNo': this.dataForm.planNo,
                'checkType': this.dataForm.checkType,
                'troubleNum': this.dataForm.troubleNum,
                'department': this.dataForm.department,
                'person': this.dataForm.person,
                'bookNo': this.dataForm.bookNo,
                'checkTime': this.dataForm.checkTime,
                'troubleDescription': this.dataForm.troubleDescription,
                'measure': this.dataForm.measure,
                'memo': this.dataForm.memo,
                'timeAffirm': this.dataForm.timeAffirm,
                'troubleType': this.dataForm.troubleType,
                'checkDepartment': this.dataForm.checkDepartment,
                'checkMan': this.dataForm.checkMan,
                'createUser': this.dataForm.createUser,
                'riskId': this.dataForm.riskPoint,
                'status': status
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                // 保存隐患编号
                this.saveTroubleNum()
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
          }
        })
      },
      // 保存隐患编号到检查异常流程表
      saveTroubleNum () {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/update`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.checkDowfId,
            'troubleNum': this.dataForm.troubleNum,
            'status': 3,
            'respMan': this.dataForm.respMan,
            'respDepartmentId': this.dataForm.respDepartmentId
          })
        })
      }
    }
  }
</script>
<style>
  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
  }

  .record_content {
    margin-top: 30px;
    width: 100%;
  }

  .record_content .img_size {
    width: 100%;
    height: 100%;
  }
</style>
