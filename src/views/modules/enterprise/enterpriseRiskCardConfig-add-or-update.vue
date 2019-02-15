<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="岗位名称" prop="positionName">
        <el-input v-model="dataForm.positionName" placeholder="岗位名称"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="workContent">
        <el-input v-model="dataForm.workContent" placeholder="工作内容" ></el-input>
      </el-form-item>
      <el-form-item label="工作场所" prop="workplace">
        <el-input v-model="dataForm.workplace" placeholder="工作场所"></el-input>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-radio-group v-model="dataForm.riskLevel">
          <el-radio :label="1">一级</el-radio>
          <el-radio :label="2">二级</el-radio>
          <el-radio :label="3">三级</el-radio>
          <el-radio :label="4">四级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="应急措施" prop="emergencyMeasure">
        <el-input v-model="dataForm.emergencyMeasure" placeholder="应急措施"></el-input>
      </el-form-item>
      <el-form-item label="事故模式" prop="accidentModel">
        <el-input v-model="dataForm.accidentModel" placeholder="事故模式"></el-input>
      </el-form-item>
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
          riskCardId: '',
          positionName: '',
          workContent: '',
          workplace: '',
          riskLevel: '',
          emergencyMeasure: '',
          accidentModel: ''
        },
        // 选择企业eid
        eidOptions: [],
        dataRule: {
          positionName: [
            {required: true, message: '岗位名称不能为空', trigger: 'blur'}
          ],
          workContent: [
            {required: true, message: '工作内容不能为空', trigger: 'blur'}
          ],
          workplace: [
            {required: true, message: '工作场所不能为空', trigger: 'blur'}
          ],
          riskLevel: [
            {required: true, message: '风险等级不能为空', trigger: 'blur'}
          ],
          emergencyMeasure: [
            {required: true, message: '应急措施不能为空', trigger: 'blur'}
          ],
          accidentModel: [
            {required: true, message: '事故模式不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, riskCardId) {
        this.dataForm.riskCardId = riskCardId
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCardConfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.positionName = data.enterpriseRiskCardConfig.positionName
                this.dataForm.workContent = data.enterpriseRiskCardConfig.workContent
                this.dataForm.workplace = data.enterpriseRiskCardConfig.workplace
                this.dataForm.riskLevel = data.enterpriseRiskCardConfig.riskLevel
                this.dataForm.emergencyMeasure = data.enterpriseRiskCardConfig.emergencyMeasure
                this.dataForm.accidentModel = data.enterpriseRiskCardConfig.accidentModel
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCardConfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'positionName': this.dataForm.positionName,
                'workContent': this.dataForm.workContent,
                'workplace': this.dataForm.workplace,
                'riskLevel': this.dataForm.riskLevel,
                'emergencyMeasure': this.dataForm.emergencyMeasure,
                'accidentModel': this.dataForm.accidentModel
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
