<template>
  <el-dialog
    :title="dataForm.id ===0 ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="Class名称" prop="className">
        <el-input v-model="dataForm.className" placeholder="如: com.hdw.job.util.TestJob"></el-input>
      </el-form-item>
      <el-form-item label="方法名称" prop="methodName">
        <el-input v-model="dataForm.methodName" placeholder="方法名称"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="如: */5 * * * * ?"></el-input>
      </el-form-item>
      <el-form-item label="任务名" prop="jobName">
        <el-input v-model="dataForm.jobName" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="任务组" prop="jobGroup">
        <el-input v-model="dataForm.jobGroup" placeholder="参数"></el-input>
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
          className: '',
          methodName: '',
          jobName: '',
          jobGroup: '',
          cronExpression: ''
        },
        dataRule: {
          className: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          methodName: [
            {required: true, message: '方法名称不能为空', trigger: 'blur'}
          ],
          jobName: [
            {required: true, message: '任务名称不能为空', trigger: 'blur'}
          ],
          jobGroup: [
            {required: true, message: '任务组名称不能为空', trigger: 'blur'}
          ],
          cronExpression: [
            {required: true, message: 'cron表达式不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, jobName, jobGroup) {
        this.dataForm.jobName = jobName
        this.dataForm.jobGroup = jobGroup
        this.dataForm.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id === 1) {
            this.$http({
              url: this.$http.adornUrl(`/sys/schedule/info/${this.dataForm.jobName}/${this.dataForm.jobGroup}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.className = data.schedule.className
                this.dataForm.methodName = data.schedule.methodName
                this.dataForm.jobName = data.schedule.jobName
                this.dataForm.jobGroup = data.schedule.jobGroup
                this.dataForm.cronExpression = data.schedule.cronExpression
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
              url: this.$http.adornUrl(`/sys/schedule/${this.dataForm.id === 0 ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'className': this.dataForm.className,
                'methodName': this.dataForm.methodName,
                'jobName': this.dataForm.jobName,
                'jobGroup': this.dataForm.jobGroup,
                'cronExpression': this.dataForm.cronExpression
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
