<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属部门" prop="orgName">
        <el-select v-model="dataForm.orgId" clearable filterable placeholder="部门">
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="职务代码" prop="jobCode">
      <el-input v-model="dataForm.jobCode" placeholder="职务代码"></el-input>
    </el-form-item>
    <el-form-item label="职务名称" prop="jobName">
      <el-input v-model="dataForm.jobName" placeholder="职务名称"></el-input>
    </el-form-item>
   
      <el-form-item label="风险检查只可上报" size="mini" prop="jobType">
        <el-radio-group v-model="dataForm.jobType">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
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
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          eId: '',
          orgId:'',
          orgName:'',
          jobCode: '',
          jobName: '',
          parameter1: '',
          parameter2: '',
          jobType:'',
          isSync: 0,
          enterpriseName: ''
        },
        dataRule: {
          enterpriseName: [
            { required: true, message: '所属部门不能为空', trigger: 'blur' }
          ],
          jobCode: [
            { required: true, message: '职务代码不能为空', trigger: 'blur' }
          ],
          jobName: [
            { required: true, message: '职务名称不能为空', trigger: 'blur' }
          ],
          jobType: [
            { required: true, message: '风险检查只可上报选项不能为空', trigger: 'blur' }
          ]
        },
        orgList: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.initDepartment()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/enterprise/enterpriseJob/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.eId = '1024860590054064129'
                  this.dataForm.jobCode = data.enterpriseJob.jobCode
                  this.dataForm.jobName = data.enterpriseJob.jobName
                  this.dataForm.orgId = data.enterpriseJob.orgId
                  this.dataForm.isSync = data.enterpriseJob.isSync
                  this.dataForm.jobType = data.enterpriseJob.jobType
                  this.dataForm.parameter1 = data.enterpriseJob.parameter1
                  this.dataForm.parameter2 = data.enterpriseJob.parameter2
                }
              })
            }
          })
      },

      initDepartment()
      {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/listOrgs`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orgList = data.list
          }
        })
      },
     
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseJob/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid':'1024860590054064129',
                'orgId':this.dataForm.orgId,
                'jobCode': this.dataForm.jobCode,
                'jobName': this.dataForm.jobName,
                'jobType': this.dataForm.jobType,
                'isSync': 0
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
