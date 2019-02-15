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
          <el-form-item label="告知卡分类" prop="positionGroup">
            <el-radio-group v-model="dataForm.positionGroup" :disabled="true">
              <el-radio :label="0">场所</el-radio>
              <el-radio :label="1">设备设施</el-radio>
              <el-radio :label="2">岗位</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险点名称" prop="riskPosition">
            <el-input v-model="dataForm.riskPosition" placeholder="风险点名称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险类型" prop="riskClassify">
            <el-input v-model="dataForm.riskClassify" placeholder="风险类型" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="可能导致的后果" prop="riskResult">
            <el-input type="textarea" v-model="dataForm.riskResult" style="border-radius:5px;"
                      placeholder="请输入可能导致的后果" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="风险管控措施" prop="measures">
            <el-input type="textarea" v-model="dataForm.measures" style="border-radius:5px;"
                      placeholder="请输入风险管控措施" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="操作规程" prop="disposeRule">
            <el-input type="textarea" v-model="dataForm.disposeRule" style="border-radius:5px;"
                      placeholder="请输入操作(处理)规程" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="责任人" prop="person">
            <el-input v-model="dataForm.person" placeholder="责任人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="应急电话" prop="telephone">
            <el-input v-model="dataForm.telephone" placeholder="应急电话" :disabled="true"></el-input>
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
          positionGroup: 0,
          riskPosition: '',
          riskClassify: '',
          riskResult: '',
          measures: '',
          disposeRule: '',
          warningMark: '',
          person: '',
          telephone: '',
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCard/lookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.dataMap.dataList[0].id
                this.dataForm.enterpriseName = data.dataMap.dataList[0].enterpriseName
                this.dataForm.positionGroup = data.dataMap.dataList[0].positionGroup
                this.dataForm.riskPosition = data.dataMap.dataList[0].riskPosition
                this.dataForm.riskClassify = data.dataMap.dataList[0].riskClassify
                this.dataForm.riskResult = data.dataMap.dataList[0].riskResult
                this.dataForm.measures = data.dataMap.dataList[0].measures
                this.dataForm.disposeRule = data.dataMap.dataList[0].disposeRule
                this.dataForm.person = data.dataMap.dataList[0].person
                this.dataForm.telephone = data.dataMap.dataList[0].telephone
              }
            })
          }
        })
      }
    }
  }
</script>
