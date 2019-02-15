<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="90px">
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="dataForm.enterpriseName" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="dataForm.contacts" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="咨询的问题" prop="content">
        <el-input type="textarea" :rows="3" v-model="dataForm.content" placeholder="咨询的问题"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="qq号码" prop="qq">
        <el-input v-model="dataForm.qq" placeholder="qq号码"></el-input>
      </el-form-item>
      <el-form-item label="接收者邮箱" prop="receiverEmail">
        <el-input v-model="dataForm.receiverEmail" placeholder="接收者邮箱"></el-input>
      </el-form-item>
      <el-form-item label="接收状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="接收状态（0-成功，1-失败）"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'

  export default {
    data () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          contacts: '',
          content: '',
          mobile: '',
          email: '',
          qq: '',
          enterpriseName: '',
          status: '',
          receiverEmail: ''
        },
        dataRule: {
          contacts: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '咨询的问题不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          qq: [
            {required: true, message: 'qq号码不能为空', trigger: 'blur'}
          ],
          enterpriseName: [
            {required: true, message: '企业名称不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '接收状态不能为空', trigger: 'blur'}
          ],
          receiverEmail: [
            {required: true, message: '接收者邮箱不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
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
              url: this.$http.adornUrl(`/notice/sysIsuse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contacts = data.sysIsuse.contacts
                this.dataForm.content = data.sysIsuse.content
                this.dataForm.mobile = data.sysIsuse.mobile
                this.dataForm.email = data.sysIsuse.email
                this.dataForm.qq = data.sysIsuse.qq
                this.dataForm.enterpriseName = data.sysIsuse.enterpriseName
                this.dataForm.status = data.sysIsuse.status
                this.dataForm.receiverEmail = data.sysIsuse.receiverEmail
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
              url: this.$http.adornUrl(`/notice/sysIsuse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'contacts': this.dataForm.contacts,
                'content': this.dataForm.content,
                'mobile': this.dataForm.mobile,
                'email': this.dataForm.email,
                'qq': this.dataForm.qq,
                'enterpriseName': this.dataForm.enterpriseName,
                'status': this.dataForm.status,
                'receiverEmail': this.dataForm.receiverEmail
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
