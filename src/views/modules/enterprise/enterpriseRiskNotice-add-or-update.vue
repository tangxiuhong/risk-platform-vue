<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-row>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="环节或岗位" prop="riskPosition">
            <el-input v-model="dataForm.riskPosition" placeholder="环节或岗位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="危险有害因素" prop="riskFactor">
            <el-input  v-model="dataForm.riskFactor" placeholder="危险有害因素"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="事故类型" prop="riskGroup">
            <el-input  v-model="dataForm.riskGroup" style="border-radius:5px;"
                      placeholder="事故类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="后果" prop="riskResult">
            <el-input  v-model="dataForm.riskResult" style="border-radius:5px;"
                       placeholder="后果"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="影响范围" prop="influenceArea">
            <el-input  v-model="dataForm.influenceArea" style="border-radius:5px;"
                       placeholder="影响范围"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险等级" prop="riskLevel">
            <el-select v-model="dataForm.riskLevel" placeholder="风险等级">
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
          <el-form-item label="管控措施" prop="measures">
            <el-input type="textarea" v-model="dataForm.measures" style="border-radius:5px;"
                      placeholder="管控措施"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="应急措施" prop="emergencyMeasures">
            <el-input type="textarea" v-model="dataForm.emergencyMeasures" style="border-radius:5px;"
                      placeholder="应急措施"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="责任人" prop="person">
            <el-input v-model="dataForm.person" placeholder="责任人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="有效期" prop="validity">
            <el-input v-model="dataForm.validity" placeholder="有效期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="报告电话" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="报告电话"></el-input>
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
          eid: '',
          riskPosition: '',
          riskFactor: '',
          riskGroup: '',
          riskResult: '',
          influenceArea: '',
          riskLevel: '',
          measures: '',
          emergencyMeasures: '',
          person: '',
          validity: '',
          phone: ''
        },
        options: [{
          value: 1,
          label: 'I级'
        }, {
          value: 2,
          label: 'II级'
        }, {
          value: 3,
          label: 'III级'
        }, {
          value: 4,
          label: 'IV级'
        }],
        dataRule: {
          riskPosition: [
            {required: true, message: '环节或岗位不能为空', trigger: 'blur'}
          ],
          riskFactor: [
            {required: true, message: '危险有害因素不能为空', trigger: 'blur'}
          ],
          riskGroup: [
            {required: true, message: '事故类型不能为空', trigger: 'blur'}
          ],
          riskResult: [
            {required: true, message: '后果不能为空', trigger: 'blur'}
          ],
          influenceArea: [
            {required: true, message: '影响范围不能为空', trigger: 'blur'}
          ],
          riskLevel: [
            {required: true, message: '风险等级不能为空', trigger: 'blur'}
          ],
          measures: [
            {required: true, message: '管控措施不能为空', trigger: 'blur'}
          ],
          emergencyMeasures: [
            {required: true, message: '应急措施不能为空', trigger: 'blur'}
          ]
        },
        industryList: [],
        industryListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      init (id) {
        this.resetForm('dataForm')
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskNotice/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.riskPosition = data.enterpriseRiskNotice.riskPosition
                this.dataForm.riskFactor = data.enterpriseRiskNotice.riskFactor
                this.dataForm.riskGroup = data.enterpriseRiskNotice.riskGroup
                this.dataForm.riskResult = data.enterpriseRiskNotice.riskResult
                this.dataForm.influenceArea = data.enterpriseRiskNotice.influenceArea
                this.dataForm.riskLevel = data.enterpriseRiskNotice.riskLevel
                this.dataForm.measures = data.enterpriseRiskNotice.measures
                this.dataForm.emergencyMeasures = data.enterpriseRiskNotice.emergencyMeasures
                this.dataForm.person = data.enterpriseRiskNotice.person
                this.dataForm.validity = data.enterpriseRiskNotice.validity
                this.dataForm.phone = data.enterpriseRiskNotice.phone
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskNotice/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'riskPosition': this.dataForm.riskPosition,
                'riskFactor': this.dataForm.riskFactor,
                'riskGroup': this.dataForm.riskGroup,
                'riskResult': this.dataForm.riskResult,
                'influenceArea': this.dataForm.influenceArea,
                'riskLevel': this.dataForm.riskLevel,
                'measures': this.dataForm.measures,
                'emergencyMeasures': this.dataForm.emergencyMeasures,
                'person': this.dataForm.person,
                'validity': this.dataForm.validity,
                'phone': this.dataForm.phone
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
