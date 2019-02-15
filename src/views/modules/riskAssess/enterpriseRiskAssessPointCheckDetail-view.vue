<template>
  <el-dialog
    :title="!dataForm.id ? '评估' : '评估'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="50%">
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险评估编号" prop="assessNo">
            <el-input v-model="dataForm.assessNo" :disabled="true" placeholder="风险点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险单元" prop="riskUnit">
            <el-input v-model="dataForm.riskUnit" :disabled="true" placeholder="风险点"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险点" prop="riskPoint">
            <el-input v-model="dataForm.riskPoint" :disabled="true" placeholder="风险点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="事故/伤害类型" prop="riskType">
            <el-input v-model="dataForm.riskType" :disabled="true" placeholder="事故/伤害类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="危险有害因素" prop="riskName">
            <el-input v-model="dataForm.riskName" :disabled="true" placeholder="危险有害因素"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地点及部位" prop="riskResult">
            <el-input v-model="dataForm.riskResult" :disabled="true" placeholder="地点及部位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="发生的可能性" prop="riskProbability">
            <el-select v-model="dataForm.riskProbability" placeholder="发生的可能性" :disabled="true">
              <el-option
                v-for="item in riskProbabilityList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="后果严重性" prop="riskSeverity">
            <el-select v-model="dataForm.riskSeverity" placeholder="后果严重性" :disabled="true">
              <el-option
                v-for="item in riskSeverityList"
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
          <el-form-item label="暴露的频繁程度" prop="riskDegree">
            <el-select v-model="dataForm.riskDegree" placeholder="暴露的频繁程度" :disabled="true">
              <el-option
                v-for="item in riskDegreeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险值" prop="riskValue">
            <el-input v-model="dataForm.riskValue" :disabled="true" placeholder="风险值"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险级别" prop="riskLevel">
            <el-select v-model="dataForm.riskLevel" placeholder="风险级别" :disabled="true">
              <el-option
                v-for="item in [{id:1,name:'1级'},{id:2,name:'2级'},{id:3,name:'3级'},{id:4,name:'4级'},{id:5,name:'5级'}]"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="检查周期" prop="checkPeriod">
            <el-radio-group v-model="dataForm.checkPeriod" size="small">
              <el-radio-button :label=1>周</el-radio-button>
              <el-radio-button :label=2>月</el-radio-button>
              <el-radio-button :label=3>季</el-radio-button>
              <el-radio-button :label=4>年</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="责任部门" prop="department">
            <el-select v-model="dataForm.department"  filterable placeholder="责任部门" :disabled="true">
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
            <el-select v-model="dataForm.person"  filterable placeholder="责任人" :disabled="true">
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
          <el-form-item label="评估人" prop="assessPerson">
            <el-select v-model="dataForm.assessPerson"  filterable placeholder="评估人" :disabled="true">
              <el-option
                v-for="item in assessPersonList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="评估时间" prop="assessDate">
            <el-date-picker type="datetime" v-model="dataForm.assessDate" placeholder="评估时间"
                            value-format="yyyy-MM-dd HH:mm:ss" :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
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
          riskDegree: '',
          riskSeverity: '',
          riskValue: '',
          riskLevel: '',
          department: '',
          person: '',
          analyzePerson: '',
          analyzeDate: '',
          assessPerson: '',
          assessDate: '',
          status: 2,
          checkPeriod: 1,
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: ''
        },
        departmentList: [],
        personList: [],
        assessPersonList: [],
        riskProbabilityList: [{id: 10, name: '完全可以预料'},
          {id: 6, name: '相当可能'},
          {id: 3, name: '可能但不经常'},
          {id: 1, name: '可能性小完全意外'},
          {id: 0.5, name: '很不可能可以设想'},
          {id: 0.2, name: '极不可能'},
          {id: 0.1, name: '实际不可能'}],
        riskSeverityList: [{id: 100, name: '10人以上的死亡'},
          {id: 40, name: '3～9人死亡'},
          {id: 15, name: '1～2人死亡'},
          {id: 7, name: '严重'},
          {id: 3, name: '重大，伤残'},
          {id: 1, name: '引起注意'}],
        riskDegreeList: [{id: 10, name: '连续暴露'},
          {id: 6, name: '每天工作时间内暴露'},
          {id: 3, name: '每周一次或偶然暴露'},
          {id: 2, name: '每月一次暴露'},
          {id: 1, name: '每年几次暴露'},
          {id: 0.5, name: '非常罕见暴露'}],
        assessPersonList: [],
        dataRule: {}
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
                this.dataForm.unitId = data.enterpriseRiskAssessPoint.unitId

                this.dataForm.assessNo = data.enterpriseRiskAssessPoint.assessNo
                this.dataForm.riskUnit = data.enterpriseRiskAssessPoint.riskUnit

                this.dataForm.riskPoint = data.enterpriseRiskAssessPoint.riskPoint
                this.dataForm.riskType = data.enterpriseRiskAssessPoint.riskType
                this.dataForm.riskName = data.enterpriseRiskAssessPoint.riskName
                this.dataForm.riskResult = data.enterpriseRiskAssessPoint.riskResult
                this.dataForm.riskProbability = data.enterpriseRiskAssessPoint.riskProbability
                this.dataForm.riskDegree = data.enterpriseRiskAssessPoint.riskDegree
                this.dataForm.riskSeverity = data.enterpriseRiskAssessPoint.riskSeverity
                this.dataForm.riskValue = data.enterpriseRiskAssessPoint.riskValue
                this.dataForm.riskLevel = data.enterpriseRiskAssessPoint.riskLevel
                this.dataForm.department = data.enterpriseRiskAssessPoint.department
                this.dataForm.person = data.enterpriseRiskAssessPoint.person
                this.dataForm.analyzePerson = data.enterpriseRiskAssessPoint.analyzePerson
                this.dataForm.analyzeDate = data.enterpriseRiskAssessPoint.analyzeDate
                this.dataForm.assessPerson = data.enterpriseRiskAssessPoint.assessPerson
                this.dataForm.assessDate = data.enterpriseRiskAssessPoint.assessDate
                //this.dataForm.status = data.enterpriseRiskAssessPoint.status
                this.dataForm.createTime = data.enterpriseRiskAssessPoint.createTime
                this.dataForm.updateTime = data.enterpriseRiskAssessPoint.updateTime
                this.dataForm.createUser = data.enterpriseRiskAssessPoint.createUser
                this.dataForm.updateUser = data.enterpriseRiskAssessPoint.updateUser

                this.dataForm.checkPeriod = data.enterpriseRiskAssessPoint.checkPeriod

                var eId = data.enterpriseRiskAssessPoint.parameter1
                var department = data.enterpriseRiskAssessPoint.department
                this.initDepartmentList(eId)
                this.initPersonList(department);
                //this.initAnalyzePersonList(eId)
                this.initAssessPersonList(eId);
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

      initAssessPersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.assessPersonList = data.list;
          }
        })
      }
    }
  }
</script>

