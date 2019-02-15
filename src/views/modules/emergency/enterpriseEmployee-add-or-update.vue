<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="部门id(对应部门表id)" prop="dId">
        <el-input v-model="dataForm.dId" placeholder="部门id(对应部门表id)"></el-input>
      </el-form-item>
      <el-form-item label="员工账号" prop="employeeCode">
        <el-input v-model="dataForm.employeeCode" placeholder="员工账号"></el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input v-model="dataForm.employeeName" placeholder="员工姓名"></el-input>
      </el-form-item>
      <el-form-item label="1:部门负责人；0：普通员工" prop="isManager">
        <el-input v-model="dataForm.isManager" placeholder="1:部门负责人；0：普通员工"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="1:正常；0：停用" prop="status">
        <el-input v-model="dataForm.status" placeholder="1:正常；0：停用"></el-input>
      </el-form-item>
      <el-form-item label="记录创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="记录创建时间"></el-input>
      </el-form-item>
      <el-form-item label="记录最后修改时间" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="记录最后修改时间"></el-input>
      </el-form-item>
      <el-form-item label="记录创建者(用户)" prop="createUser">
        <el-input v-model="dataForm.createUser" placeholder="记录创建者(用户)"></el-input>
      </el-form-item>
      <el-form-item label="记录最后修改者(用户)" prop="updateUser">
        <el-input v-model="dataForm.updateUser" placeholder="记录最后修改者(用户)"></el-input>
      </el-form-item>
      <el-form-item label="预留1" prop="parameter1">
        <el-input v-model="dataForm.parameter1" placeholder="预留1"></el-input>
      </el-form-item>
      <el-form-item label="预留2" prop="parameter2">
        <el-input v-model="dataForm.parameter2" placeholder="预留2"></el-input>
      </el-form-item>
      <el-form-item label="数据是否同步(0:是,1:否)" prop="isSync">
        <el-input v-model="dataForm.isSync" placeholder="数据是否同步(0:是,1:否)"></el-input>
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
          dId: '',
          employeeCode: '',
          employeeName: '',
          isManager: '',
          mobile: '',
          email: '',
          status: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: 0
        },
        dataRule: {
          dId: [
            {required: true, message: '部门id(对应部门表id)不能为空', trigger: 'blur'}
          ],
          employeeCode: [
            {required: true, message: '员工账号不能为空', trigger: 'blur'}
          ],
          employeeName: [
            {required: true, message: '员工姓名不能为空', trigger: 'blur'}
          ],
          isManager: [
            {required: true, message: '1:部门负责人；0：普通员工不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '1:正常；0：停用不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '记录创建时间不能为空', trigger: 'blur'}
          ],
          updateTime: [
            {required: true, message: '记录最后修改时间不能为空', trigger: 'blur'}
          ],
          createUser: [
            {required: true, message: '记录创建者(用户)不能为空', trigger: 'blur'}
          ],
          updateUser: [
            {required: true, message: '记录最后修改者(用户)不能为空', trigger: 'blur'}
          ],
          parameter1: [
            {required: true, message: '预留1不能为空', trigger: 'blur'}
          ],
          parameter2: [
            {required: true, message: '预留2不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步(0:是,1:否)不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/emergency/enterpriseEmployee/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dId = data.enterpriseEmployee.dId
                this.dataForm.employeeCode = data.enterpriseEmployee.employeeCode
                this.dataForm.employeeName = data.enterpriseEmployee.employeeName
                this.dataForm.isManager = data.enterpriseEmployee.isManager
                this.dataForm.mobile = data.enterpriseEmployee.mobile
                this.dataForm.email = data.enterpriseEmployee.email
                this.dataForm.status = data.enterpriseEmployee.status
                this.dataForm.createTime = data.enterpriseEmployee.createTime
                this.dataForm.updateTime = data.enterpriseEmployee.updateTime
                this.dataForm.createUser = data.enterpriseEmployee.createUser
                this.dataForm.updateUser = data.enterpriseEmployee.updateUser
                this.dataForm.parameter1 = data.enterpriseEmployee.parameter1
                this.dataForm.parameter2 = data.enterpriseEmployee.parameter2
                this.dataForm.isSync = data.enterpriseEmployee.isSync
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
              url: this.$http.adornUrl(`/emergency/enterpriseEmployee/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dId': this.dataForm.dId,
                'employeeCode': this.dataForm.employeeCode,
                'employeeName': this.dataForm.employeeName,
                'isManager': this.dataForm.isManager,
                'mobile': this.dataForm.mobile,
                'email': this.dataForm.email,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
                'isSync': this.dataForm.isSync
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
