<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="信号通道Id" prop="infoId">
        <el-input v-model="dataForm.infoId" placeholder="信号通道Id"></el-input>
      </el-form-item>
      <el-form-item label="监视位置" prop="watchSite">
        <el-input v-model="dataForm.watchSite" placeholder="监视位置"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="dataForm.memo" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="数据是否同步" prop="isSync">
        <el-radio-group v-model="dataForm.isSync">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
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
        vid: '',
        dataForm: {
          id: 0,
          vid: '',
          infoId: '',
          watchSite: '',
          memo: '',
          createDate: '',
          createUser: '',
          updateTime: '',
          updateUser: '',
          isSync: 0
        },
        dataRule: {
          vid: [
            {required: true, message: '对应视频配置表主键不能为空', trigger: 'blur'}
          ],
          infoId: [
            {required: true, message: '信号通道Id不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          watchSite: [
            {required: true, message: '监视位置不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          memo: [
            {required: true, message: '备注不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步(0:是 1否)不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, vid) {
        this.dataForm.id = id || 0
        this.vid = vid
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/videoInfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.vid = data.videoInfo.vid
                this.dataForm.infoId = data.videoInfo.infoId
                this.dataForm.watchSite = data.videoInfo.watchSite
                this.dataForm.memo = data.videoInfo.memo
                this.dataForm.createDate = data.videoInfo.createDate
                this.dataForm.createUser = data.videoInfo.createUser
                this.dataForm.updateTime = data.videoInfo.updateTime
                this.dataForm.updateUser = data.videoInfo.updateUser
                this.dataForm.isSync = data.videoInfo.isSync
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
              url: this.$http.adornUrl(`/monitor/videoInfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'vid': this.vid,
                'infoId': this.dataForm.infoId,
                'watchSite': this.dataForm.watchSite,
                'memo': this.dataForm.memo,
                'createDate': this.dataForm.createDate,
                'createUser': this.dataForm.createUser,
                'updateTime': this.dataForm.updateTime,
                'updateUser': this.dataForm.updateUser,
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
