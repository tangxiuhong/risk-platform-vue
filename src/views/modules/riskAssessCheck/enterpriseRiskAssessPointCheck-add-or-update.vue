<template>
  <el-dialog
    :title="'检查'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="12">
          <p>风险单元：{{dataForm.riskUnit}}</p>
        </el-col>
        <el-col :span="12">
          <p>风险点：{{dataForm.riskPoint}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="检查类型:" prop="checkType" label-width="90px">
            <el-select placeholder="检查类型" v-model="dataForm.checkType">
              <el-option label="安全综合检查" value="1"></el-option>
              <el-option label="专业安全检查" value="2"></el-option>
              <el-option label="专项安全检查" value="3"></el-option>
              <el-option label="日常检查" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查班次:" prop="checkNum" label-width="90px">
            <el-select placeholder="检查班次" v-model="dataForm.checkNum" @change="checkNumChg">
              <el-option label="班前" value="1"></el-option>
              <el-option label="班中" value="2"></el-option>
              <el-option label="班后" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-card>
            <el-collapse accordion
                         v-for="item in dataList"
                         v-bind:key="item.riskFactorId"
                         v-if="item.checkNum===(ckNum===0?item.checkNum:ckNum)">
              <el-collapse-item>
                <template slot="title">
                  <span style=" overflow: hidden; display: inline-block">危害因素：</span>
                  <span
                    style="display: inline-block; max-width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{item.riskFactor}}</span>
                </template>
                <el-row class="pointCheck">
                  <el-col v-for="childrenItem in item.childrenList"
                          v-bind:key="childrenItem.id">
                    <el-card style="margin-bottom: 5px;background: rgba(119,165,220,0.1)">
                      <el-row :gutter="8">
                        <el-col :span="8">
                          <el-col :span="6">管控措施：</el-col>
                          <el-col :span="18">{{childrenItem.riskDo}}</el-col>
                        </el-col>
                        <el-col :span="8">
                          <el-col :span="10">措施是否有效：</el-col>
                          <el-col :span="14">
                            <el-form-item v-if="childrenItem.parentId !== ''">
                              <el-radio-group v-model="childrenItem.parameter3" @change="radioChange()">
                                <el-col>
                                  <el-radio :label="0">有效</el-radio>
                                  <el-radio :label="1" :class="{radioCss: childrenItem.parameter3}">无效</el-radio>
                                </el-col>
                              </el-radio-group>
                            </el-form-item>
                          </el-col>
                        </el-col>
                        <el-col :span="8">
                          <el-col :span="5">说明：</el-col>
                          <el-col :span="19">
                            <el-form-item v-if="childrenItem.parentId !== ''">
                              <el-input type="textarea" autosize maxlength="152" v-model="childrenItem.parameter2"
                                        placeholder=""></el-input>
                            </el-form-item>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-card>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="24">
          <el-form-item label="失效说明：" prop="checkDo" label-width="95px">
            <el-input type="textarea" maxlength="152" :class="{areaCol:true}" readonly="true" autosize
                      v-model="dataForm.checkDo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="checkFoot">
        <el-col :span="12">
          <p>检查部门：{{dataForm.departmentName}}</p>
        </el-col>
        <el-col :span="12">
          <p>检查人：{{dataForm.checkName}}</p>
        </el-col>

      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" v-show="cancelBut">取消</el-button>
      <el-button type="primary" v-show="yhBut" @click="danger()">产生隐患</el-button>
      <el-button type="primary" v-show="sbBut" @click="report()">上报</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-show="submitBut">提交</el-button>
    </span>
    <report v-if="reportVisible" ref="report" @close="close"></report>
    <danger v-if="dangerVisible" ref="danger" @close="close"></danger>
    <notice v-if="noticeVisible" ref="notice" @close="close"></notice>
  </el-dialog>
</template>

<script>
  import report from './enterpriseRiskAssessPointCheck-report'
  import danger from './enterpriseRiskAssessPointCheck-danger'
  import notice from './enterpriseRiskAssessPointCheck-notice'

  export default {
    data () {
      return {
        visible: false,
        tableList: [],
        dataForm: {
          id: '',
          riskPoint: '',
          riskUnitId: '',
          riskUnit: '',
          departmentId: '',
          departmentName: '',
          checkUserId: '',
          checkName: '',
          checkDo: '',
          checkType: '4',
          checkResult: 1,
          memo: '',
          status: 0,
          checkNum: '',
          troubleNum: '',
          checkDowfId: '',
          checkId: '',
          userJobCode: '',
          userJobType:''
        },
        dataList: [],
        factorDoList: [],
        factorIdList: [],
        isMeasuresEffectiveList: [],
        factorDangerList: [],
        memoList: [],
        multipleSelection: [],
        multipleSelection2: [],
        checkList: [],
        dataRule: {
          checkType: [
            {required: true, message: '检查类型不能为空', trigger: 'change'}
          ],
          checkNum: [
            {required: true, message: '检查班次不能为空', trigger: 'change'}
          ]
        },
        cancelBut: true,
        submitBut: true,
        radioStatus: '',
        yhBut: false,
        sbBut: false,
        invalidList: [],
        dataListSelections: [],
        reportVisible: false,
        dangerVisible: false,
        noticeVisible: false,
        ckNum: 0
      }
    },
    components: {
      report,
      danger,
      notice
    },
    methods: {
      init (id) {
        this.dataList = []
        this.factorDoList = []
        this.factorIdList = []
        this.isMeasuresEffectiveList = []
        this.memoList = []
        this.invalidList = []
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.submitBut = true
          this.yhBut = false
          this.sbBut = false
          this.dataForm.checkResult = 1
          this.dataForm.status = 0
          this.multipleSelection2 = []
          this.multipleSelection2Size = 0
          this.dataForm.troubleNum = ''
          this.dataList = []
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.riskPoint = data.riskPoint
                this.dataForm.riskUnitId = data.riskUnitId
                this.dataForm.riskUnit = data.riskUnit
                this.dataForm.departmentId = data.departmentId
                this.dataForm.departmentName = data.departmentName
                this.dataForm.checkUserId = data.checkUserId
                this.dataForm.checkName = data.checkName
                this.dataForm.userJobCode = data.userJobCode
                this.dataForm.userJobType = data.userJobType
              }
            }).then(() => {
              // 获取风险点检查ID
              this.$http({
                url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/getCheckId`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                this.getDataList()
                if (data && data.code === 0) {
                  this.dataForm.checkId = data.checkId
                }
              })
            })
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataList = []
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessFactordo/treeGrid'),
          method: 'get',
          params: this.$http.adornParams({
            'riskPointId': this.dataForm.id
          })
        }).then(({data}) => {
          for (var x in data) {
            if (data[x].parentId === '') {
              var a = {}
              a.riskFactor = data[x].riskFactor
              a.riskFactorId = data[x].id
              a.childrenList = []
              a.checkNum = data[x].checkNum
              for (var y in data) {
                if (data[x].id === data[y].parentId) {
                  a.childrenList.push(data[y])
                }
              }
              this.dataList.push(a)
            }
          }
          this.dataListLoading = false
          // 初始化判断是否显示提交按钮
          this.radioChange()
          //  风险点下危害因素对应的管控措施全选，不含危害因素
          var tempArray = []
          tempArray = data
          for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].parentId !== '') {
              this.multipleSelection2.push(tempArray[i])
            }
          }
          this.multipleSelection2Size = this.multipleSelection2.length
        })
      },
      // radio改变
      radioChange () {
        this.invalidList = []
        this.yhBut = false
        this.sbBut = false
        this.submitBut = true
        this.radioStatus = ''
        this.dataToArray()
        for (var y = 0; y < this.isMeasuresEffectiveList.length; y++) {
          // 当有无效选项时显示上报或产生隐患按钮
          if (this.isMeasuresEffectiveList[y] === 1) {
            this.submitBut = false
            // this.radioStatus = 1  带班班长and岗位操作工
            //if (this.dataForm.userJobCode === '0026' || this.dataForm.userJobCode === '0099') 
            if(this.dataForm.userJobType===1)
            {
              this.sbBut = true
              break
            } else {
              this.yhBut = true
              break
            }    
          }
        }
        var message = ''
        var noAcceptTxt = '';
        for (var x in this.dataList) {
          for (var z in this.dataList[x].childrenList) {
            if (this.dataList[x].childrenList[z].parameter3 == 1) {
              var ckNumDesc = '';
              if(this.dataList[x].checkNum===1) ckNumDesc = '班前';
              if(this.dataList[x].checkNum===2) ckNumDesc = '班中';
              if(this.dataList[x].checkNum===3) ckNumDesc = '班后';

              message += ckNumDesc+'危害因素\\' + this.dataList[x].riskFactor + ':' + this.dataList[x].childrenList[z].riskDo + '\r\n'
              if (this.dataList[x].childrenList[z].isAccept === 1) {

                noAcceptTxt = "<h2 style='color:red'>"+ckNumDesc+"危险因素\\" + this.dataList[x].riskFactor + "的措施</br>" + this.dataList[x].childrenList[z].riskDo + "&nbsp;&nbsp;失效</br>该风险点的风险是不可接受的，请立即停止工作，并报告上级！</h2>";
              }
            }

          }
        }
        this.dataForm.checkDo = message
        if (noAcceptTxt != '') this.viewNotice(noAcceptTxt);
      },
      viewNotice (e) {
        this.noticeVisible = true
        this.$nextTick(() => {
          this.$refs.notice.init(e)
        })
      },
      // 将数据放入到数组中
      dataToArray () {
        this.factorDoList = []
        this.factorIdList = []
        this.isMeasuresEffectiveList = []
        this.memoList = []
        for (var x in this.dataList) {
          for (var y in this.dataList[x].childrenList) {
            this.factorDoList.push(this.dataList[x].childrenList[y].id)
            this.factorIdList.push(this.dataList[x].riskFactorId)
            this.isMeasuresEffectiveList.push(this.dataList[x].childrenList[y].parameter3)
            this.memoList.push(this.dataList[x].childrenList[y].parameter2)
          }
        }
      },
      // 选择检查班次
      checkNumChg (e) {
        this.ckNum = parseInt(e);
      },
      // 表单提交
      dataFormSubmit () {
        this.dataToArray()
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessCheck/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.checkId,
                'pointId': this.dataForm.id || undefined,
                'checkDo': this.dataForm.checkDo,
                'department': this.dataForm.departmentId,
                'person': this.dataForm.checkUserId,
                'checkType': this.dataForm.checkType,
                'checkResult': this.dataForm.checkResult,
                'memo': this.dataForm.memo,
                'status': this.dataForm.status,
                'checkNum': this.dataForm.checkNum,
                'troubleNum': this.dataForm.troubleNum,
                'factorDoIdList': this.factorDoList,
                'factorIdList': this.factorIdList,
                'isMeasuresEffectiveList': this.isMeasuresEffectiveList,
                'memoList': this.memoList
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
      report () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
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
              this.reportVisible = true
              this.$nextTick(() => {
                this.saveCheck()
                this.$refs.report.init(this.dataForm.checkDowfId, this.dataForm.checkId, this.checkList)
              })
            })
          }
        })
      },
      // 产生隐患
      danger () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 获取隐患ID
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getTroubleId`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.troubleNum = data.troubleId
              }
            }).then(() => {
              this.dangerVisible = true
              this.$nextTick(() => {
                this.saveCheck()
                this.$refs.danger.init(this.dataForm.id, this.dataForm.riskUnitId, this.dataForm.troubleNum, this.checkList)
              })
            })
          }
        })
      },
      // 保存数据
      saveCheck () {
        this.dataToArray()
        this.checkList = []
        this.checkList = this.$http.adornData({
          'id': this.dataForm.checkId,
          'pointId': this.dataForm.id || undefined,
          'checkDo': this.dataForm.checkDo,
          'department': this.dataForm.departmentId,
          'person': this.dataForm.checkUserId,
          'checkType': this.dataForm.checkType,
          'checkResult': this.dataForm.checkResult,
          'memo': this.dataForm.memo,
          'status': this.dataForm.status,
          'checkNum': this.dataForm.checkNum,
          'troubleNum': this.dataForm.troubleNum,
          'factorDoIdList': this.factorDoList,
          'factorIdList': this.factorIdList,
          'isMeasuresEffectiveList': this.isMeasuresEffectiveList,
          'memoList': this.memoList
        })
      },
      close () {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
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
  .pointCheck .el-form-item{
    margin-bottom: 0!important;
  }
  .pointCheck .el-card__body{
    padding: 15px!important;
  }

  .checkFoot {
    padding-top: 20px;
  }

  .checkFoot p {
    line-height: 3em;
    display: inline-block;
    margin: 0 5px;
  }

  .checkFoot .el-form-item__content {
    margin: 0 !important;
  }

  .radioCss .el-radio__inner {
    border-color: #d00d00 !important;
    background: #d00d00 !important;
  }

  .radioCss .el-radio__label {
    color: #d00d00 !important;
  }

  .areaCol .el-textarea__inner {
    color: #d00d00 !important;
  }

  #cardList .el-card__body {
    padding: 10px 5px !important;
  }

  #cardList .cardRow {
    /*background: rgba(119, 165, 220, 0.1);*/
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 5px;
    padding: 0 5px;
  }

  #cardList .cardRow .el-col:nth-child(1) {
    color: #888 !important;
    margin-bottom: 5px;
  }
</style>

