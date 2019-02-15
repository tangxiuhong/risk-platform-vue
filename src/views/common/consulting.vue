<template>
  <div class="consulting">
    <div class="consult-icon">
      <i style="color: #fff; font-size: 30px;" @click="show=true" class="el-icon-service"></i>
    </div>
    <div class="consultBox" v-if="show">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px"
               @keyup.enter.native="dataFormSubmit()">
        <el-form-item label="公司名称" prop="enterpriseName">
          <el-input v-model="dataForm.enterpriseName" auto-complete="off" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="dataForm.contacts" auto-complete="off" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="dataForm.qq" auto-complete="off" placeholder="QQ"></el-input>
        </el-form-item>
        <el-form-item label="咨询内容" prop="content">
          <el-input type="textarea" :rows="4" placeholder="请输入咨询内容" v-model="dataForm.content"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex">
        <el-col style="text-align: center">
          <el-button @click="show=false">取 消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
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
        show: false,
        dataForm: {
          enterpriseName: '',
          contacts: '',
          email: '',
          mobile: '',
          content: '',
          qq: ''
        },
        dataRule: {
          enterpriseName: [
            {required: true, message: '公司名称不能为空', trigger: 'blur'}
          ],
          contacts: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '电话不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '电话不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          content: [
            {required: true, message: '咨询内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 问题咨询提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/notice/sysIsuse/saveMsg'),
              method: 'post',
              data: this.$http.adornData({
                'enterpriseName': this.dataForm.enterpriseName,
                'contacts': this.dataForm.contacts,
                'mobile': this.dataForm.mobile,
                'email': this.dataForm.email,
                'qq': this.dataForm.qq,
                'content': this.dataForm.content
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.show = false
                    this.dataForm = {}
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

<style>
  .consult-icon {
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    background: rgba(23, 179, 163, .6);
    padding: 12px;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, .3);
    cursor: pointer;
    position: fixed;
    top: 40%;
    left: 2%;
  }

  .consult-icon:hover {
    background: rgba(23, 179, 163, 1);
  }

  .consultBox {
    background: #f3f6f9;
    padding: 25px;
    border-radius: 5px;
    position: fixed;
    left: 20px;
    bottom: 20px;
    width: 400px;
    z-index: 999999;
    box-shadow: 0 0 15px rgba(0, 0, 0, .3);
  }

  .consultBox .el-form-item {
    margin-bottom: 15px;
  }

  .consultBox .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
</style>
