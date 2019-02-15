<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">

      <el-form-item label="资源来源" prop="qrSource">
        <el-input v-model="dataForm.qrSource" placeholder="资源来源"></el-input>
      </el-form-item>
      <el-form-item label="资源访问地址" prop="qrResource">
        <el-input v-model="dataForm.qrResource" placeholder="资源访问地址"></el-input>
      </el-form-item>
    </el-form>

    <el-card :body-style="{ padding: '10px',height:'300px' }" v-if="imgVisible">
      <img v-bind:src="dataForm.qrFilePath" alt="" width="100%" height="100%">
    </el-card>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<style>
  .image {
    width: 100%;
    display: block;
  }
</style>

<script>
  export default {
    data () {
      return {
        visible: false,
        imgVisible: false,
        dataForm: {
          id: 0,
          eId: '',
          qrSource: '',
          qrResource: '',
          qrFilePath: '',
          createTime: '',
          updateTime: '',
          parameter1: '',
          parameter2: '',
          isSync: '',
          createUser: '',
          updateUser: ''
        },
        dataRule: {

          qrSource: [
            {required: true, message: '资源来源不能为空', trigger: 'blur'}
          ],
          qrResource: [
            {required: true, message: '资源访问地址不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.dataForm.qrFilePath = '';
        this.imgVisible = false;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();

          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/qrcode/enterpriseQrcode/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.qrSource = data.enterpriseQrcode.qrSource;
                this.dataForm.qrResource = data.enterpriseQrcode.qrResource;
                
                this.dataForm.qrFilePath = data.enterpriseQrcode.qrFilePath;
                this.imgVisible = true;
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
              url: this.$http.adornUrl(`/qrcode/enterpriseQrcode/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,

                'qrSource': this.dataForm.qrSource,
                'qrResource': this.dataForm.qrResource

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
