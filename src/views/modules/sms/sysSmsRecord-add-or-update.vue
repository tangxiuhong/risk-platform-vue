<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="账号" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="消息id" prop="smsId">
        <el-input v-model="dataForm.smsId" placeholder="消息id"></el-input>
      </el-form-item>
      <el-form-item label="平台类型" prop="appType">
        <el-radio-group v-model="dataForm.appType">
          <el-radio :label="0">平台</el-radio>
          <el-radio :label="1">大屏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="要求推送时间" prop="smsTime">
        <el-input v-model="dataForm.smsTime" placeholder="要求推送时间"></el-input>
      </el-form-item>
      <el-form-item label="要求推送次数" prop="smsCount">
        <el-input v-model="dataForm.smsCount" placeholder="要求推送次数"></el-input>
      </el-form-item>
      <el-form-item label="推送间隔时间" prop="intervalTime">
        <el-input v-model="dataForm.intervalTime" placeholder="推送间隔时间"></el-input>
      </el-form-item>
      <el-form-item label="同一推送Id，推送间隔时间单位(0-秒，1-分，2-时)" prop="intervalUnit">
        <el-input v-model="dataForm.intervalUnit" placeholder="同一推送Id，推送间隔时间单位(0-秒，1-分，2-时)"></el-input>
      </el-form-item>
      <el-form-item label="实际推送次数" prop="realCount">
        <el-input v-model="dataForm.realCount" placeholder="实际推送次数"></el-input>
      </el-form-item>
      <el-form-item label="实际推送时间" prop="realTime">
        <el-input v-model="dataForm.realTime" placeholder="实际推送时间"></el-input>
      </el-form-item>
      <el-form-item label="0:待执行推送；1：推送成功；2：推送失败;3:已读" prop="status">
        <el-input v-model="dataForm.status" placeholder="0:待执行推送；1：推送成功；2：推送失败;3:已读"></el-input>
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
          userId: '',
          smsId: '',
          smsTime: '',
          smsCount: '',
          intervalTime: '',
          intervalUnit: '',
          realCount: '',
          realTime: '',
          status: '',
          appType: 0
        },
        dataRule: {
          userId: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          smsId: [
            {required: true, message: '消息id不能为空', trigger: 'blur'}
          ],
          smsTime: [
            {required: true, message: '要求推送时间不能为空', trigger: 'blur'}
          ],
          smsCount: [
            {required: true, message: '要求推送次数不能为空', trigger: 'blur'}
          ],
          intervalTime: [
            {required: true, message: '同一推送Id，推送间隔时间"不能为空', trigger: 'blur'}
          ],
          intervalUnit: [
            {required: true, message: '同一推送Id，推送间隔时间单位不能为空', trigger: 'blur'}
          ],
          realCount: [
            {required: true, message: '实际推送次数不能为空', trigger: 'blur'}
          ],
          realTime: [
            {required: true, message: '实际推送时间不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '0:待执行推送；1：推送成功；2：推送失败;3:已读不能为空', trigger: 'blur'}
          ],
          appType: [
            {required: true, message: '平台类型，不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/sms/sysSmsRecord/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.sysSmsRecord.userId
                this.dataForm.smsId = data.sysSmsRecord.smsId
                this.dataForm.smsTime = data.sysSmsRecord.smsTime
                this.dataForm.smsCount = data.sysSmsRecord.smsCount
                this.dataForm.intervalTime = data.sysSmsRecord.intervalTime
                this.dataForm.intervalUnit = data.sysSmsRecord.intervalUnit
                this.dataForm.realCount = data.sysSmsRecord.realCount
                this.dataForm.realTime = data.sysSmsRecord.realTime
                this.dataForm.status = data.sysSmsRecord.status
                this.dataForm.appType = data.sysSmsRecord.appType
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
              url: this.$http.adornUrl(`/sms/sysSmsRecord/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userId': this.dataForm.userId,
                'smsId': this.dataForm.smsId,
                'smsTime': this.dataForm.smsTime,
                'smsCount': this.dataForm.smsCount,
                'intervalTime': this.dataForm.intervalTime,
                'intervalUnit': this.dataForm.intervalUnit,
                'realCount': this.dataForm.realCount,
                'realTime': this.dataForm.realTime,
                'status': this.dataForm.status,
                'appType': this.dataForm.appType
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
