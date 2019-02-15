<template>
  <el-dialog
    :title="!dataForm.id ? '辨识' : '辨识'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="50%">
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险评估编号" prop="assessNo">
            <el-input v-model="dataForm.assessNo" disabled placeholder="风险评估编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险单元" prop="riskUnit">
            <el-input v-model="dataForm.riskUnit" disabled placeholder="风险单元"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险点" prop="riskPoint">
            <el-input v-model="dataForm.riskPoint" placeholder="风险点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="事故/伤害类型" prop="riskType">
            <el-input v-model="dataForm.riskType" placeholder="事故/伤害类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="危险有害因素" prop="riskName">
            <el-input v-model="dataForm.riskName" placeholder="危险有害因素"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地点及部位" prop="riskResult">
            <el-input v-model="dataForm.riskResult" placeholder="地点及部位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="责任部门" prop="department">
            <el-select v-model="dataForm.department"  filterable placeholder="责任部门" @change=departmentChg>
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="责任人" prop="person">
            <el-select v-model="dataForm.person" filterable placeholder="责任人">
              <el-option
                v-for="item in personList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="辨识人" prop="analyzePerson">
            <el-select v-model="dataForm.analyzePerson"  filterable placeholder="辨识人">
              <el-option
                v-for="item in analyzePersonList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="辨识时间" prop="analyzeDate">
            <el-date-picker type="datetime" v-model="dataForm.analyzeDate" placeholder="辨识时间"
                            value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
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
  export default {
    data () {
      return {
        visible: false,
        assessNoList: [],
        riskUnitList: [],
        dataForm: {
          id: 0,
          assessNo: '',
          riskUnit: '',
          unitId: '',
          riskPoint: '',
          riskType: '',
          riskName: '',
          riskResult: '',
          riskProbability: '',
          riskSeverity: '',
          riskValue: '',
          riskLevel: '',
          department: '',
          person: '',
          analyzePerson: '',
          analyzeDate: '',
          assessPerson: '',
          assessDate: '',
          measure: '',
          remark: '',
          status: 1,
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: ''
        },
        departmentList: [],
        personList: [],
        analyzePersonList: [],
        dataRule: {
          assessNo: [
            {required: true, message: '风险评估编号不能为空', trigger: 'blur'}
          ],
          riskUnit: [
            {required: true, message: '风险单元不能为空', trigger: 'blur'}
          ],
          riskPoint: [
            {required: true, message: '风险点不能为空', trigger: 'blur'}
          ],
          riskType: [
            {required: true, message: '风险类型不能为空', trigger: 'blur'}
          ],
          riskName: [
            {required: true, message: '危险有害因素不能为空', trigger: 'blur'}
          ],

          department: [
            {required: true, message: '责任部门不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '责任人不能为空', trigger: 'blur'}
          ],
          analyzePerson: [
            {required: true, message: '辨识人不能为空', trigger: 'blur'}
          ],
          analyzeDate: [
            {required: true, message: '辨识时间不能为空', trigger: 'blur'}
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
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.assessNo = data.enterpriseRiskAssessPoint.assessNo
                this.dataForm.riskUnit = data.enterpriseRiskAssessPoint.riskUnit

                this.dataForm.unitId = data.enterpriseRiskAssessPoint.unitId
                this.dataForm.riskPoint = data.enterpriseRiskAssessPoint.riskPoint
                this.dataForm.riskType = data.enterpriseRiskAssessPoint.riskType
                this.dataForm.riskName = data.enterpriseRiskAssessPoint.riskName
                this.dataForm.riskResult = data.enterpriseRiskAssessPoint.riskResult
                this.dataForm.riskProbability = data.enterpriseRiskAssessPoint.riskProbability
                this.dataForm.riskSeverity = data.enterpriseRiskAssessPoint.riskSeverity
                this.dataForm.riskValue = data.enterpriseRiskAssessPoint.riskValue
                this.dataForm.riskLevel = data.enterpriseRiskAssessPoint.riskLevel
                this.dataForm.department = data.enterpriseRiskAssessPoint.department
                this.dataForm.person = data.enterpriseRiskAssessPoint.person
                this.dataForm.analyzePerson = data.enterpriseRiskAssessPoint.analyzePerson
                this.dataForm.analyzeDate = data.enterpriseRiskAssessPoint.analyzeDate
                this.dataForm.assessPerson = data.enterpriseRiskAssessPoint.assessPerson
                this.dataForm.assessDate = data.enterpriseRiskAssessPoint.assessDate
                this.dataForm.measure = data.enterpriseRiskAssessPoint.measure
                this.dataForm.remark = data.enterpriseRiskAssessPoint.remark
                this.dataForm.status = data.enterpriseRiskAssessPoint.status
                this.dataForm.createTime = data.enterpriseRiskAssessPoint.createTime
                this.dataForm.updateTime = data.enterpriseRiskAssessPoint.updateTime
                this.dataForm.createUser = data.enterpriseRiskAssessPoint.createUser
                this.dataForm.updateUser = data.enterpriseRiskAssessPoint.updateUser

                var eId = data.enterpriseRiskAssessPoint.parameter1
                var department = data.enterpriseRiskAssessPoint.department
                this.initDepartmentList(eId)
                this.initPersonList(department);
                this.initAnalyzePersonList(eId)
              }
            })
          }
        })
      },

      initDepartmentList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listDepartments`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.departmentList = data.list;
          }
        })
      },

      departmentChg (e) {
        this.dataForm.person = '';
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({orgId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list;
          }
        })
      },

      initPersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({orgId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list;
          }
        })
      },

      initAnalyzePersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.analyzePersonList = data.list;
          }
        })
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'assessNo': this.dataForm.assessNo,
                'riskUnit': this.dataForm.riskUnit,
                'unitId': this.dataForm.unitId,
                'riskPoint': this.dataForm.riskPoint,
                'riskType': this.dataForm.riskType,
                'riskName': this.dataForm.riskName,
                'riskResult': this.dataForm.riskResult,
                'riskProbability': this.dataForm.riskProbability,
                'riskSeverity': this.dataForm.riskSeverity,
                'riskValue': this.dataForm.riskValue,
                'riskLevel': this.dataForm.riskLevel,
                'department': this.dataForm.department,
                'person': this.dataForm.person,
                'analyzePerson': this.dataForm.analyzePerson,
                'analyzeDate': this.dataForm.analyzeDate,
                'assessPerson': this.dataForm.assessPerson,
                'assessDate': this.dataForm.assessDate,
                'measure': this.dataForm.measure,
                'remark': this.dataForm.remark,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser
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
