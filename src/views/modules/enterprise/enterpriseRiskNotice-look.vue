<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-row :gutter="10">
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="dataForm.enterpriseName" placeholder="企业名称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险类型" prop="riskGroup">
            <el-input v-model="dataForm.riskGroup" placeholder="风险类型" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="环节或部位" prop="riskPosition">
            <el-input v-model="dataForm.riskPosition" placeholder="环节或部位" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="可能导致的后果" prop="riskResult">
            <el-input type="textarea" v-model="dataForm.riskResult" style="border-radius:5px;"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险等级" prop="riskLevel">
            <el-radio-group v-model="dataForm.riskLevel" :disabled="true">
              <el-radio :label="1">重大风险</el-radio>
              <el-radio :label="2">较大风险</el-radio>
              <el-radio :label="3">一般风险</el-radio>
              <el-radio :label="4">低风险</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险管控措施" prop="measures">
            <el-input type="textarea" v-model="dataForm.measures" style="border-radius:5px;"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="责任部门" prop="department">
            <el-input v-model="dataForm.department" placeholder="责任部门" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="责任人" prop="person">
            <el-input v-model="dataForm.person" placeholder="责任人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
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
          riskGroup: '',
          riskPosition: '',
          riskResult: '',
          riskLevel: 1,
          measures: '',
          emergencyMeasures: '',
          department: '',
          person: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: 0,
          enterpriseName: ''
        },
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskNotice/lookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.dataMap.dataList[0].id
                this.dataForm.enterpriseName = data.dataMap.dataList[0].enterpriseName
                this.dataForm.riskGroup = data.dataMap.dataList[0].riskGroup
                this.dataForm.riskPosition = data.dataMap.dataList[0].riskPosition
                this.dataForm.riskResult = data.dataMap.dataList[0].riskResult
                this.dataForm.riskLevel = data.dataMap.dataList[0].riskLevel
                this.dataForm.measures = data.dataMap.dataList[0].measures
                this.dataForm.department = data.dataMap.dataList[0].department
                this.dataForm.person = data.dataMap.dataList[0].person
              }
            })
          }
        })
      }
    }
  }
</script>
