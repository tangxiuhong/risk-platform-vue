<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="编号" prop="doId">
            <el-input-number v-model="dataForm.doId" controls-position="right" :min="0"
                             label="编号"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险点" prop="pointId">
            <el-select v-model="dataForm.pointId" placeholder="风险点" :filterable = "true">
              <el-option
                v-for="item in riskPointList"
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
          <el-form-item label="危险有害因素" prop="riskFactor">
            <el-input v-model="dataForm.riskFactor" placeholder="危险有害因素"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="事故伤害类型" prop="riskType">
            <el-input v-model="dataForm.riskType" placeholder="事故伤害类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险地点及部位" prop="riskResult">
            <el-input v-model="dataForm.riskResult" placeholder="风险地点及部位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发生的可能性" prop="2">
            <el-input-number v-model="dataForm.riskProbability" controls-position="right" :min="0.1" :precision="1" label="发生的可能性"></el-input-number>
            <!--
            <el-select v-model="dataForm.riskProbability" placeholder="发生的可能性">
              <el-option
                v-for="item in riskProbabilityoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="后果严重性" prop="riskSeverity">
            <el-input-number v-model="dataForm.riskSeverity" controls-position="right" :min="0.1" :precision="1" label="后果严重性"></el-input-number>
            <!--
            <el-select v-model="dataForm.riskSeverity" placeholder="后果严重性">
              <el-option
                v-for="item in riskSeverityoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="暴露的频繁程度" prop="riskDegree">
            <el-input-number v-model="dataForm.riskDegree" controls-position="right" :min="0.1" :precision="1" label="暴露的频繁程度"></el-input-number>
            <!--
            <el-select v-model="dataForm.riskDegree" placeholder="暴露的频繁程度">
              <el-option
                v-for="item in riskDegreeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险值" prop="riskValue">
            <el-input-number v-model="dataForm.riskValue" controls-position="right" :min="0.1" :precision="1" label="风险值"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险等级" prop="riskLevel">
            <el-select v-model="dataForm.riskLevel" placeholder="风险等级">
              <el-option
                v-for="item in riskLeveloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险计算权重" prop="riskWeight">
            <el-input v-model="dataForm.riskWeight" placeholder="风险计算权重"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态" prop="status">
            <el-select v-model="dataForm.status" placeholder="状态">
              <el-option
                v-for="item in statusoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="检查类型" prop="checkNum">
            <el-radio-group v-model="dataForm.checkNum" size="small">
              <el-radio-button :label=1>班前</el-radio-button>
              <el-radio-button :label=2>班中</el-radio-button>
              <el-radio-button :label=3>班后</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="类型" prop="factorType">
            <el-select v-model="dataForm.factorType" placeholder="类型">
              <el-option
                v-for="item in factorTypeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
        riskPointList: [],
        dataForm: {
          id: '',
          pointId: '',
          doId: '',
          riskFactor: '',
          riskType: '',
          riskResult: '',
          riskProbability: '',
          riskSeverity: '',
          riskDegree: '',
          riskValue: '',
          riskLevel: '',
          factorType: '',
          riskWeight: '',
          analyzePerson: '',
          analyzeDate: '',
          assessPerson: '',
          assessDate: '',
          status: '',
          checkNum: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          issync: ''
        },
        riskProbabilityoptions: [{value: 1, label: '完全可以预料'},
          {value: 2, label: '相当可能'},
          {value: 3, label: '可能但不经常'},
          {value: 4, label: '可能性小完全意外'},
          {value: 5, label: '很不可能可以设想'},
          {value: 6, label: '极不可能'},
          {value: 7, label: '实际不可能'}],
        riskSeverityoptions: [{value: 1, label: '10人以上的死亡'},
          {value: 2, label: '3～9人死亡'},
          {value: 3, label: '1～2人死亡'},
          {value: 4, label: '严重'},
          {value: 5, label: '重大，伤残'},
          {value: 6, label: '引起注意'}],
        riskDegreeoptions: [{value: 1, label: '连续暴露'},
          {value: 2, label: '每天工作时间内暴露'},
          {value: 3, label: '每周一次或偶然暴露'},
          {value: 4, label: '每月一次暴露'},
          {value: 5, label: '每年几次暴露'},
          {value: 6, label: '非常罕见暴露'}],
        statusoptions: [{value: 1, label: '正常'},
          {value: 2, label: '异常'}],
        factorTypeoptions: [{value: 1, label: '管理型'},
          {value: 2, label: '其它'}],
        riskLeveloptions: [{value: 1, label: '一级风险'},
          {value: 2, label: '二级风险'},
          {value: 3, label: '三级风险'},
          {value: 4, label: '四级风险'},
          {value: 5, label: '五级风险'}],
        dataRule: {
          pointId: [
            { required: true, message: '企业风险点表id不能为空', trigger: 'blur' }
          ],
          riskFactor: [
            { required: true, message: '危险有害因素不能为空', trigger: 'blur' }
          ],
          riskType: [
            { required: true, message: '事故伤害类型不能为空', trigger: 'blur' }
          ],
          riskResult: [
            { required: true, message: '风险地点及部位(现场作业地点)不能为空', trigger: 'blur' }
          ],
          riskProbability: [
            { required: true, message: '发生的可能性不能为空', trigger: 'blur' }
          ],
          riskSeverity: [
            { required: true, message: '后果严重性不能为空', trigger: 'blur' }
          ],
          riskDegree: [
            { required: true, message: '暴露的频繁程度不能为空', trigger: 'blur' }
          ],
          riskValue: [
            { required: true, message: '风险值不能为空', trigger: 'blur' }
          ],
          riskLevel: [
            { required: true, message: '风险级别不能为空', trigger: 'blur' }
          ],
          factorType: [
            { required: true, message: '类型(1:管理型)不能为空', trigger: 'blur' }
          ],
          riskWeight: [
            { required: true, message: '风险计算权重不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.doId = data.enterpriseRiskAssessFactor.doId
                this.dataForm.pointId = data.enterpriseRiskAssessFactor.pointId
                this.dataForm.riskFactor = data.enterpriseRiskAssessFactor.riskFactor
                this.dataForm.riskType = data.enterpriseRiskAssessFactor.riskType
                this.dataForm.riskResult = data.enterpriseRiskAssessFactor.riskResult
                this.dataForm.riskProbability = data.enterpriseRiskAssessFactor.riskProbability
                this.dataForm.riskSeverity = data.enterpriseRiskAssessFactor.riskSeverity
                this.dataForm.riskDegree = data.enterpriseRiskAssessFactor.riskDegree
                this.dataForm.riskValue = data.enterpriseRiskAssessFactor.riskValue
                this.dataForm.riskLevel = data.enterpriseRiskAssessFactor.riskLevel
                this.dataForm.factorType = data.enterpriseRiskAssessFactor.factorType
                this.dataForm.riskWeight = data.enterpriseRiskAssessFactor.riskWeight
                this.dataForm.analyzePerson = data.enterpriseRiskAssessFactor.analyzePerson
                this.dataForm.analyzeDate = data.enterpriseRiskAssessFactor.analyzeDate
                this.dataForm.assessPerson = data.enterpriseRiskAssessFactor.assessPerson
                this.dataForm.assessDate = data.enterpriseRiskAssessFactor.assessDate
                this.dataForm.status = data.enterpriseRiskAssessFactor.status
                this.dataForm.checkNum = data.enterpriseRiskAssessFactor.checkNum
              }
            })
          }
        })
        this.initAssessNoList()
      },

      initAssessNoList () {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.list;
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'doId': this.dataForm.doId,
                'pointId': this.dataForm.pointId,
                'riskFactor': this.dataForm.riskFactor,
                'riskType': this.dataForm.riskType,
                'riskResult': this.dataForm.riskResult,
                'riskProbability': this.dataForm.riskProbability,
                'riskSeverity': this.dataForm.riskSeverity,
                'riskDegree': this.dataForm.riskDegree,
                'riskValue': this.dataForm.riskValue,
                'riskLevel': this.dataForm.riskLevel,
                'riskWeight': this.dataForm.riskWeight,
                'status': this.dataForm.status,
                'checkNum': this.dataForm.checkNum,
                'factorType': this.dataForm.factorType
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
