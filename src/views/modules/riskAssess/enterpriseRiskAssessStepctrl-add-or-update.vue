<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险单元" prop="riskUnit">
            <el-select v-model="dataForm.riskUnit"  filterable placeholder="风险单元" @change=riskUnitChg>
              <el-option
                v-for="item in riskUnitList"
                :key="item.id"
                :label="item.riskUnit"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="企业风险点" prop="pointId">
            <el-select v-model="dataForm.pointId"  filterable placeholder="企业风险点">
              <el-option
                v-for="item in pointIdList"
                :key="item.id"
                :label="item.riskPoint"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="检查部门" prop="checkDepartmentId">
            <el-select v-model="dataForm.checkDepartmentId"  filterable placeholder="检查部门" @change=departmentChg>
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
          <el-form-item label="检查人" prop="checkMan">
            <el-select v-model="dataForm.checkMan"  filterable placeholder="检查人">
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
          <el-form-item label="检查开始日" prop="dayMin">
            <el-input-number v-model="dataForm.dayMin" controls-position="right" :min="0"
               :max="31" label="检查开始日"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="检查截止日" prop="dayMax">
            <el-input-number v-model="dataForm.dayMax" controls-position="right" :min="0"
                             :max="31" label="检查截止日"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="检查类型" prop="checkType">
            <el-radio-group v-model="dataForm.checkType" size="small">
              <el-radio-button :label=1>月</el-radio-button>
              <el-radio-button :label=2>两周</el-radio-button>
              <el-radio-button :label=3>一周</el-radio-button>
              <el-radio-button :label=4>天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="检查次数" prop="checks">
            <el-input-number v-model="dataForm.checks" controls-position="right" :min="0"
                              label="检查次数"></el-input-number>
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
        dataForm: {
          id: 0,
          pointId: '',
          checkDepartmentId: '',
          checkMan: '',
          checkType: '',
          dayMax: '',
          dayMin: '',
          checks: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          issync: '',
          riskUnit: ''
        },
        pointIdList: [],
        departmentList: [],
        riskUnitList: [],
        personList: [],
        dataRule: {
          pointId: [
            { required: true, message: '企业风险点不能为空', trigger: 'blur' }
          ],
          checkDepartmentId: [
            { required: true, message: '检查部门不能为空', trigger: 'blur' }
          ],
          checkMan: [
            { required: true, message: '检查人不能为空', trigger: 'blur' }
          ],
          checkType: [
            { required: true, message: '检查类型不能为空', trigger: 'blur' }
          ],
          dayMax: [
            { required: true, message: '检查截止日不能为空', trigger: 'blur' }
          ],
          dayMin: [
            { required: true, message: '检查开始日不能为空', trigger: 'blur' }
          ],
          checks: [
            { required: true, message: '检查次数不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                for (var x in data.list) {
                  this.dataForm.pointId = data.list[x].pointId
                  this.dataForm.checkDepartmentId = data.list[x].checkDepartmentId
                  this.dataForm.checkMan = data.list[x].checkMan
                  this.dataForm.checkType = data.list[x].checkType
                  this.dataForm.dayMax = data.list[x].dayMax
                  this.dataForm.dayMin = data.list[x].dayMin
                  this.dataForm.checks = data.list[x].checks
                  this.dataForm.createTime = data.list[x].createTime
                  this.dataForm.updateTime = data.list[x].updateTime
                  this.dataForm.createUser = data.list[x].createUser
                  this.dataForm.updateUser = data.list[x].updateUser
                  this.dataForm.parameter1 = data.list[x].parameter1
                  this.dataForm.parameter2 = data.list[x].parameter2
                  this.dataForm.issync = data.list[x].issync
                  this.dataForm.riskUnit = data.list[x].riskUnit
                  var eId = data.list[x].eId
                  this.initpointIdList(eId)
                  this.initDepartmentList(eId)
                  this.initPersonList(eId)
                  this.initRiskUnitList(eId)
                }
              }
            })
          } else {
            this.initpointIdList("")
            this.initDepartmentList("")
            this.initRiskUnitList("")
          }
        })
      },
      initRiskUnitList(e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.list
          }
        })
      },
      riskUnitChg (){
        this.dataForm.pointId = '';
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/listPointIdByRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({unitId: this.dataForm.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.pointIdList = data.list
          }
        })

      },
      initpointIdList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/listPointId`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.pointIdList = data.list
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
            this.departmentList = data.list
          }
        })
      },
      departmentChg (e) {
        this.dataForm.checkMan = ''
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({orgId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list
          }
        })
      },
      initPersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'pointId': this.dataForm.pointId,
                'checkDepartmentId': this.dataForm.checkDepartmentId,
                'checkMan': this.dataForm.checkMan,
                'checkType': this.dataForm.checkType,
                'dayMax': this.dataForm.dayMax,
                'dayMin': this.dataForm.dayMin,
                'checks': this.dataForm.checks,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
                'issync': this.dataForm.issync
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
