<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="所属企业" prop="eid">
        <el-select v-model="dataForm.eid" filterable placeholder="所属企业" @focus="getEnterpriseTree()">
          <el-option
            v-for="item in eidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="codeName">
        <el-input v-model="dataForm.codeName" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="dataForm.pwd" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="ip地址" prop="ip">
        <el-input v-model="dataForm.ip" placeholder="ip地址"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="dataForm.port" placeholder="端口"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频安装位置" prop="addressName">
        <el-input v-model="dataForm.addressName" placeholder="视频安装具体地址位置"></el-input>
      </el-form-item>
      <el-form-item label="是否同步" prop="isSync">
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
  import {isIP, isPort} from '@/utils/validate'

  export default {
    data () {
      var ip = (rule, value, callback) => {
        if (!isIP(value)) {
          callback(new Error('ip格式错误'))
        } else {
          callback()
        }
      }
      var port = (rule, value, callback) => {
        if (!isPort(value)) {
          callback(new Error('端口号错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          eid: '',
          codeName: '',
          pwd: '',
          ip: '',
          port: '',
          state: 1,
          addressName: '',
          isSync: 0
        },
        // 选择企业eid
        eidOptions: [],
        dataRule: {
          enterpriseName: [
            {required: true, message: '所属企业不能为空', trigger: 'blur'}
          ],
          codeName: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}
          ],
          ip: [
            {required: true, message: 'ip地址不能为空', trigger: 'blur'},
            {validator: ip, trigger: 'blur'}
          ],
          port: [
            {required: true, message: '端口不能为空', trigger: 'blur'},
            {validator: port, trigger: 'blur'}
          ],
          state: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          addressName: [
            {required: true, message: '视频安装位置不能为空', trigger: 'blur'},
            {max: 200, message: '长度不超过200个字符', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '是否同步不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/monitor/videoConfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eid = data.videoConfig.eid
                this.dataForm.codeName = data.videoConfig.codeName
                this.dataForm.pwd = data.videoConfig.pwd
                this.dataForm.ip = data.videoConfig.ip
                this.dataForm.port = data.videoConfig.port
                this.dataForm.state = data.videoConfig.state
                this.dataForm.addressName = data.videoConfig.addressName
                this.dataForm.isSync = data.videoConfig.isSync
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
              url: this.$http.adornUrl(`/monitor/videoConfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'codeName': this.dataForm.codeName,
                'pwd': this.dataForm.pwd,
                'ip': this.dataForm.ip,
                'port': this.dataForm.port,
                'state': this.dataForm.state,
                'addressName': this.dataForm.addressName,
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
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eidOptions = data.list
          } else {
            this.eidOptions = []
          }
        })
      }
    }
  }
</script>
