<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">

      <el-form-item label="危险有害因素" prop="harmfulFactors">
        <el-input type="textarea" v-model="dataForm.harmfulFactors" style="border-radius:5px;"
                  placeholder="危险有害因素"></el-input>
        </el-form-item>
      <el-form-item label="管控措施" prop="controlMeasures">
        <el-input type="textarea" v-model="dataForm.controlMeasures" style="border-radius:5px;"
                  placeholder="管控措施"></el-input>
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
          harmfulFactors: '',
          controlMeasures: ''
        },
        dataRule: {

          harmfulFactors: [
            {required: true, message: '危险有害因素不能为空', trigger: 'blur'}
          ],
          controlMeasures: [
            {required: true, message: '管控措施不能为空', trigger: 'blur'}
          ]
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
      init (id, riskCardId) {
        this.resetForm('dataForm')
        this.dataForm.riskCardId = riskCardId
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCardConfig/relationInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.harmfulFactors = data.enterpriseRiskCardConfigRelation.harmfulFactors
                this.dataForm.controlMeasures = data.enterpriseRiskCardConfigRelation.controlMeasures
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
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCardConfig/${!this.dataForm.id ? 'saveRelation' : 'updateRelation'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'riskCardId': this.dataForm.riskCardId,
                'harmfulFactors': this.dataForm.harmfulFactors,
                'controlMeasures': this.dataForm.controlMeasures
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
