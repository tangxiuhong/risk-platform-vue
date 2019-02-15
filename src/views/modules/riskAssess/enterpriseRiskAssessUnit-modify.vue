<template>
  <el-dialog
    :title="!dataForm.id ? '辨识' : '辨识'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">

      <el-form-item label="编号" prop="doId">
        <el-input-number v-model="dataForm.doId" controls-position="right" :min="0"
                         label="编号"></el-input-number>
      </el-form-item>
      <el-form-item label="评估编号" prop="assessNo">
        <el-input v-model="dataForm.assessNo" :disabled="true" placeholder="评估编号"></el-input>
      </el-form-item>
      <el-form-item label="风险单元" prop="riskUnit">
        <el-input v-model="dataForm.riskUnit" placeholder="风险单元"></el-input>
      </el-form-item>

      <el-form-item label="单元确认人" filterable prop="listPerson">
        <el-select v-model="dataForm.listPerson" placeholder="单元确认人">
          <el-option
            v-for="item in listPersonList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元确认时间" prop="listDate">
        <el-date-picker type="datetime" v-model="dataForm.listDate" placeholder="确认时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
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
          eId: '',
          doId: '',
          assessNo: '',
          riskUnit: '',
          assessValue: '',
          assessLevel: '',
          listPerson: '',
          listPersonName: '',
          listDate: '',
          assessPerson: '',
          assessPersonName: '',
          assessDate: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: ''
        },
        listPersonList: [],
        dataRule: {
          assessNo: [
            {required: true, message: '评估编号不能为空', trigger: 'blur'}
          ],
          riskUnit: [
            {required: true, message: '风险单元不能为空', trigger: 'blur'}
          ],
          listPerson: [
            {required: true, message: '风险单元确认人不能为空', trigger: 'blur'}
          ],
          listDate: [
            {required: true, message: '风险单元确认时间不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessUnit/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eId = data.enterpriseRiskAssessUnit.eid
                this.dataForm.doId = data.enterpriseRiskAssessUnit.doId
                this.dataForm.assessNo = data.enterpriseRiskAssessUnit.assessNo
                this.dataForm.riskUnit = data.enterpriseRiskAssessUnit.riskUnit
                this.dataForm.assessValue = data.enterpriseRiskAssessUnit.assessValue
                this.dataForm.assessLevel = data.enterpriseRiskAssessUnit.assessLevel
                this.dataForm.listPerson = data.enterpriseRiskAssessUnit.listPerson

                this.dataForm.listDate = data.enterpriseRiskAssessUnit.listDate
                this.dataForm.assessPerson = data.enterpriseRiskAssessUnit.assessPerson

                this.dataForm.assessDate = data.enterpriseRiskAssessUnit.assessDate
                this.dataForm.createTime = data.enterpriseRiskAssessUnit.createTime
                this.dataForm.updateTime = data.enterpriseRiskAssessUnit.updateTime
                this.dataForm.createUser = data.enterpriseRiskAssessUnit.createUser
                this.dataForm.updateUser = data.enterpriseRiskAssessUnit.updateUser
                var eId = data.enterpriseRiskAssessUnit.eid
                this.initListPersonList(eId);
              }
            })
          }
        })

      },
      initListPersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.listPersonList = data.list;
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessUnit/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eId': this.dataForm.eId,
                'doId': this.dataForm.doId,
                'assessNo': this.dataForm.assessNo,
                'riskUnit': this.dataForm.riskUnit,
                'assessValue': this.dataForm.assessValue,
                'assessLevel': this.dataForm.assessLevel,
                'listPerson': this.dataForm.listPerson,
                'listDate': this.dataForm.listDate,
                'assessPerson': this.dataForm.assessPerson,
                'assessDate': this.dataForm.assessDate,
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
