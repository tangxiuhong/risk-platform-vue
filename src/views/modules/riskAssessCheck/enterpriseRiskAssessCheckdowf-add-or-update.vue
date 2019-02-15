<template>
  <el-dialog
    :title="'检查异常处理'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             width="60%">
      <el-row>
        <el-col :span="12">
          <p>风险单元：{{dataForm.riskUnit}}</p>
        </el-col>
        <el-col :span="12">
          <p>风险点：{{dataForm.riskPoint}}</p>
        </el-col>
      </el-row>
      <el-table
        :data="dataList"
        border
        style="width: 100%;"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="riskFactor"
          header-align="center"
          align="center"
          label="危害因素">
        </el-table-column>
        <el-table-column
          prop="riskDo"
          header-align="center"
          align="center"
          label="管控措施">
        </el-table-column>
        <el-table-column
          prop="parameter3"
          header-align="center"
          align="center"
          label="措施是否有效">
          <template slot-scope="scope">
            <sapn v-if="scope.row.parameter3 === 0">有效</sapn>
            <span v-if="scope.row.parameter3 === 1">失效</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="parameter2"
          header-align="center"
          align="center"
          label="说明">
        </el-table-column>
      </el-table>
      <!--<el-row style="margin-top: 30px">-->
      <!--<el-col :span="24">-->
      <!--<el-form-item label="检查说明：" prop="checkDo" label-width="82px">-->
      <!--<el-input type="textarea" v-model="dataForm.checkDo" :disabled="true"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <el-row class="checkFoot">
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>检查部门：{{dataForm.checkDepartmentName}}</p>
        </el-col>
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>检查人：{{dataForm.checkMan}}</p>
        </el-col>
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>检查类型：{{dataForm.checkType == 1 ? '安全综合检查' : dataForm.checkType == 2 ? '专业安全检查' :
            dataForm.checkType == 3 ? '专业安全检查' : dataForm.checkType == 4 ? '日常检查': ''}}</p>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="24">
          <el-form-item label="上报说明：" prop="checkDo" label-width="82px">
            <el-input type="textarea" v-model="dataForm.reqDesc" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col style="line-height: 4em;">上报图片:</el-col>
        <el-col>
          <el-form-item prop="imgReportList" label-width="0px">
            <el-carousel :interval="3000" type="card" class="reportImg" v-if="imgReportList.length>0">
              <el-carousel-item v-for="item in imgReportList" :key="item.id">
                <!-- 图片 -->
                <div style="width:100%;height:100%;">
                  <img :src="item.attachmentPath" style="width:100%;height:100%;"/>
                </div>
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="checkFoot">
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>上报部门：{{dataForm.reqDepartmentName}}</p>
        </el-col>
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>上报人：{{dataForm.reqManName}}</p>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="24">
          <el-form-item label="处理说明：" prop="checkDo" label-width="95px">
            <el-input type="textarea" maxlength="512" autosize v-model="dataForm.respDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="处理图片:" style="margin-top: 30px;" label-width="72px">
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
      </el-row>
      <el-row class="checkFoot">
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>处理部门：{{dataForm.respDepartmentName}}</p>
        </el-col>
        <el-col style="padding: 5px 0;" :sm="12" :md="12" :lg="12" :xl="6">
          <p>处理人：{{dataForm.respPersonName}}</p>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="addTrouble(checkDowfList, dataForm.riskPointId, dataForm.riskUnitId)"
                 v-show="troubleBtn">产生隐患</el-button>
      <el-button type="primary" @click="addReport(checkDowfList, dataForm.checkId)" v-show="reportBtn">上报</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-show="submitBtn">提交</el-button>
    </span>
    <!-- 产生隐患 -->
    <add-trouble v-if="addTroubleVisible" ref="addTrouble" @close="closeWindow"></add-trouble>
    <!-- 上报 -->
    <add-report v-if="addReportVisible" ref="addReport" @close="closeWindow"></add-report>
  </el-dialog>

</template>
<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddTrouble from './enterpriseTroublerecord-add-or-update'
  import addReport from './enterpriseRiskAssessCheckdowf-addReport'
  import {getLocalAddr} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          checkId: 0,
          riskPointId: '',
          riskPoint: '',
          respPersonId: '',
          respPersonName: '',
          reqDepartmentId: '',
          reqDepartmentName: '',
          reqManName: '',
          reqTime: '',
          reqDesc: '',
          respDepartmentId: '',
          respDepartmentName: '',
          respTime: '',
          status: '',
          troubleNum: '',
          respDesc: '',
          riskUnit: '',
          checkType: '',
          userJob: '',
          jobType:'',
          checkMan: '',
          checkDepartmentName: '',
          checkDo: '',
          memo: '',
          checkDowfId: ''
        },
        submitBtn: false,
        reportBtn: false,
        troubleBtn: false,
        addTroubleVisible: false,
        addReportVisible: false,
        uploadUrl: '',
        rowIndex: [],
        fileList: [],
        imgList: [],
        imgReportList: [],
        carouselVisible: false,
        dataList: [],
        checkDowfList: [],
        dataRule: {
          respDesc: [
            {required: true, message: '处理说明不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      TableTreeColumn,
      AddTrouble,
      addReport
    },
    methods: {
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      init (riskPointId, id, checkId) {
        this.resetForm('dataForm')
        this.dataForm.respDesc = ''
        this.dataForm.id = id
        this.dataForm.riskPointId = riskPointId
        this.dataForm.checkId = checkId
        this.visible = true
        this.getReportImg(id)
        this.$nextTick(() => {
          this.getControlDataList()
          this.$refs['dataForm'].resetFields()
          // 上传图片
          this.uploadUrl = this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/listFileUpload/${id}`),
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
                this.$http({
                  url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/info/${riskPointId}/${id}/${checkId}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm.checkMan = data.checkMan
                    this.dataForm.checkDepartmentName = data.checkDepartmentName
                    this.dataForm.reqManName = data.reqManName
                    this.dataForm.reqDepartmentName = data.reqDepartmentName
                    this.dataForm.respPersonId = data.respPersonId
                    this.dataForm.respPersonName = data.respPersonName
                    this.dataForm.respDepartmentId = data.respDepartmentId
                    this.dataForm.respDepartmentName = data.departmentName
                    this.dataForm.riskPoint = data.riskPoint
                    this.dataForm.riskUnitId = data.riskUnitId
                    this.dataForm.riskUnit = data.riskUnit
                    this.dataForm.userJob = data.userJob
                    this.dataForm.jobType = data.userJobType

                    this.dataForm.reqMan = data.enterpriseRiskAssessCheckdowf.reqMan
                    this.dataForm.reqTime = data.enterpriseRiskAssessCheckdowf.reqTime
                    this.dataForm.reqDesc = data.enterpriseRiskAssessCheckdowf.reqDesc
                    this.dataForm.respTime = data.enterpriseRiskAssessCheckdowf.respTime
                    this.dataForm.status = data.enterpriseRiskAssessCheckdowf.status
                    this.dataForm.id = data.enterpriseRiskAssessCheckdowf.id

                    this.dataForm.checkType = data.enterpriseRiskAssessCheck.checkType
                    this.dataForm.checkDo = data.enterpriseRiskAssessCheck.checkDo
                    this.dataForm.memo = data.enterpriseRiskAssessCheck.memo

                    this.checkDowfList.id = this.dataForm.id
                    this.checkDowfList.respMan = this.dataForm.respPersonId
                    this.checkDowfList.respDepartmentId = this.dataForm.respDepartmentId

                    this.isDisableFn()
                  }
                })
              })
            })
          }
        })
      },
      // 获取上报图片
      getReportImg (id) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/listFile/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.imgReportList = data.sysFiles
          }
        })
      },
      // 获取管控措施数据列表
      getControlDataList () {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessFactordo/riskAssessTreeGrid'),
          method: 'get',
          params: this.$http.adornParams({
            'riskPointId': this.dataForm.riskPointId,
            'checkId': this.dataForm.checkId
          })
        }).then(({data}) => {
          this.dataList = []
          if (data) {
            for (let x in data) {
              if (data[x].parentId === '') {
                for (let y in data) {
                  let a = {}
                  a.riskFactor = data[x].riskFactor
                  if (data[x].id === data[y].parentId) {
                    a.id = data[y].id
                    a.riskDo = data[y].riskDo
                    a.parameter2 = data[y].parameter2
                    a.parameter3 = data[y].parameter3
                    a.isAccept = data[y].isAccept
                    this.dataList.push(a)
                  }
                }
              }
            }
          }
        })
      },
      // 不可接受时行背景颜色为红色
      tableRowClassName ({row, rowIndex}) {
        if (row.isAccept === 1) {
          return 'color-row'
        }
        return ''
      },
      // 关闭窗口
      closeWindow () {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      },
      // 处理图片
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/riskAssess/enterpriseRiskAssessCheckdowf/deleteFileById?id=' + id
        } else {
          url = '/riskAssess/enterpriseRiskAssessCheckdowf/deleteFileByName?fileName=' + fileName
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'respDepartmentId': this.dataForm.respDepartmentId,
                'respMan': this.dataForm.respPersonId,
                'status': 1,
                'respDesc': this.dataForm.respDesc
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
      // 上报
      addReport (checkDowfList, checkId) {
        // 获取检查异常ID
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheckdowf/getCheckDowfId`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.checkDowfId = data.checkDowfId
          }
        }).then(() => {
          this.addReportVisible = true
          this.$nextTick(() => {
            this.$refs.addReport.init(checkDowfList, checkId, this.dataForm.checkDowfId)
          })
        })
      },
      // 产生隐患
      addTrouble (checkDowfList, riskPointId, riskUnitId) {
        this.addTroubleVisible = true
        this.$nextTick(() => {
          this.$refs.addTrouble.init(checkDowfList, riskPointId, riskUnitId)
        })
      },
      // 判断按钮状态
      isDisableFn () {
        // 带班组长
        //if (this.dataForm.userJob === '0026') 
        if(this.dataForm.jobType===1)
        {
          this.submitBtn = true
          this.reportBtn = true
        } else {
          this.submitBtn = true
          this.troubleBtn = true
        }
      }
    }
  }
</script>
<style>
  .pointCheck .el-table_2_column_9:nth-child(1) i.el-icon-caret-right {
    display: block !important;
    width: auto !important;
    height: 100% !important;
  }

  .pointCheck .el-table_2_column_9 i.el-icon-caret-right {
    height: 0 !important;
    width: 0 !important;
  }

  .pointCheck .el-form-item__content {
    margin-left: 0 !important;
  }

  .pointCheck .el-radio {
    margin-left: 0 !important;
    padding-right: 10px;
    line-height: 1.5em;
  }

  .checkFoot p {
    line-height: 3em;
  }

  .checkFoot .el-form-item__content {
    margin: 0 !important;
  }

  .reportImg {
    height: 330px;
    border: 1px solid #eeeeee;
  }

  .reportImg::-webkit-scrollbar {
    width: 8px;
    height: 1px;
  }

  .reportImg::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.51);
    background: rgba(0, 0, 0, 0.2);
  }

  .reportImg::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.31);
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }

  .el-table .color-row {
    background: red;
  }

</style>
