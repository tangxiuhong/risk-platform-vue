<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="公告标题"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input type="textarea" :rows="2" v-model="dataForm.content" placeholder="公告内容"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="isuseDate">
        <el-date-picker type="datetime" v-model="dataForm.isuseDate" placeholder="发布日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布单位" prop="department">
        <el-input v-model="dataForm.department" placeholder="发布单位"></el-input>
      </el-form-item>
      <el-form-item label="发布人" prop="person">
        <el-input v-model="dataForm.person" placeholder="发布人"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">保存</el-radio>
          <el-radio :label="1">发布</el-radio>
          <el-radio :label="2">撤销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失效时间" prop="endDate">
        <el-date-picker type="datetime" v-model="dataForm.endDate" placeholder="失效时间"
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
          title: '',
          content: '',
          isuseDate: '',
          department: '',
          person: '',
          status: '',
          endDate: '',
          createUser: '',
          createDate: '',
          updateUser: '',
          updateDate: ''
        },
        dataRule: {
          title: [
            {required: true, message: '公告标题不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '公告内容不能为空', trigger: 'blur'}
          ],
          isuseDate: [
            {required: true, message: '发布日期不能为空', trigger: 'blur'}
          ],
          department: [
            {required: true, message: '发布单位不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '发布人不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态(0：保存，1：发布，2：撤销)不能为空', trigger: 'blur'}
          ],
          endDate: [
            {required: true, message: '失效时间不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/notice/sysNotice/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.title = data.sysNotice.title
                this.dataForm.content = data.sysNotice.content
                this.dataForm.isuseDate = data.sysNotice.isuseDate
                this.dataForm.department = data.sysNotice.department
                this.dataForm.person = data.sysNotice.person
                this.dataForm.status = data.sysNotice.status
                this.dataForm.endDate = data.sysNotice.endDate
                this.dataForm.createUser = data.sysNotice.createUser
                this.dataForm.createDate = data.sysNotice.createDate
                this.dataForm.updateUser = data.sysNotice.updateUser
                this.dataForm.updateDate = data.sysNotice.updateDate
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
              url: this.$http.adornUrl(`/notice/sysNotice/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'title': this.dataForm.title,
                'content': this.dataForm.content,
                'isuseDate': this.dataForm.isuseDate,
                'department': this.dataForm.department,
                'person': this.dataForm.person,
                'status': this.dataForm.status,
                'endDate': this.dataForm.endDate,
                'createUser': this.dataForm.createUser,
                'createDate': this.dataForm.createDate,
                'updateUser': this.dataForm.updateUser,
                'updateDate': this.dataForm.updateDate
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
