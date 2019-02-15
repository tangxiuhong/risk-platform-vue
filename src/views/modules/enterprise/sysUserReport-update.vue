<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="30%">
      <el-form-item label="部门" prop="orgId">
        <el-select v-model="dataForm.orgId" placeholder="部门" @change=OrgIdChange()>
          <el-option
            v-for="item in OrgIdList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="jobId">
        <el-select v-model="dataForm.jobId" placeholder="职务" @change=JobIdChange()>
          <el-option
            v-for="item in JobIdList"
            :key="item.id"
            :label="item.jobName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="loginName1">
        <el-select v-model="dataForm.loginName1" multiple placeholder="账号">
          <el-option
            v-for="item in LoginNameList"
            :key="item.loginName"
            :label="item.name"
            :value="item.loginName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报类型" prop="reportType">
        <el-select v-model="dataForm.reportType" placeholder="汇报类型" @change=reportTypeChange()>
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.valueReportType"
            :label="item.labelReportType"
            :value="item.valueReportType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报部门" prop="toOrgId">
        <el-select v-model="dataForm.toOrgId" placeholder="汇报部门" @change=toOrgIdChange()>
          <el-option
            v-for="item in toOrgIdList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报职务" prop="toJobId">
        <el-select v-model="dataForm.toJobId" placeholder="汇报职务" @change=toJobIdChange()>
          <el-option
            v-for="item in toJobIdList"
            :key="item.id"
            :label="item.jobName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报账号" prop="toLoginName1">
        <el-select v-model="dataForm.toLoginName1" multiple placeholder="汇报账号">
          <el-option
            v-for="item in toLoginNameList"
            :key="item.loginName"
            :label="item.name"
            :value="item.loginName">
          </el-option>
        </el-select>
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
    data() {
      return {
        visible: false,
        OrgIdList: [],
        JobIdList: [],
        LoginNameList: [],
        toOrgIdList: [],
        toJobIdList: [],
        toLoginNameList: [],
        loginName1: [],
        toLoginName1: [],
        dataForm: {
          id: 0,
          eId: '',
          orgId: '',
          jobId: '',
          loginName: '',
          toOrgId: '',
          toJobId: '',
          toLoginName: '',
          reportType: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: '',
        },
        dataRule: {
          toOrgId: [
            {required: true, message: '汇报部门不能为空', trigger: 'blur'}
          ],
          toJobId: [
            {required: true, message: '汇报职务不能为空', trigger: 'blur'}
          ],
          toLoginName: [
            {required: true, message: '汇报账号不能为空', trigger: 'blur'}
          ],
          reportType: [
            {required: true, message: '汇报类型不能为空', trigger: 'blur'}
          ]
        },
        reportTypeOptions: [{
          valueReportType: 0,
          labelReportType: '指令下达'
        }, {
          valueReportType: 1,
          labelReportType: '隐患上报'
        }]
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if(this.dataForm.id){
          this.$http({
            url: this.$http.adornUrl(`/enterprise/sysUserReport/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if(data && data.code === 0){
            this.dataForm.orgId = data.sysUserReport.orgId
            this.dataForm.jobId = data.sysUserReport.jobId
            this.dataForm.loginName1.push(data.sysUserReport.loginName)
            this.dataForm.toOrgId = data.sysUserReport.toOrgId
            this.dataForm.toJobId = data.sysUserReport.toJobId
            this.dataForm.toLoginName1.push(data.sysUserReport.toLoginName)
            this.dataForm.reportType = data.sysUserReport.reportType
          }
        })
        }
      })
        this.initOrgIdList()
        this.initJobIdList()
        this.initLoginNameList()
        this.initToOrgIdList()
        this.initToJobIdList()
        this.initToLoginNameList()
      },

      //部门下拉列表
      initOrgIdList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectDepartmentNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.OrgIdList = data.list;
        }
      })
      },
      //职务下拉列表
      initJobIdList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectJobNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.JobIdList = data.list;
        }
      })
      },
      //账号
      initLoginNameList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectLoginNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.LoginNameList = data.list;
        }
      })
      },

      //当部门改变时
      OrgIdChange() {
        this.dataForm.jobId = ''
        this.dataForm.loginName1 = []
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectJobNameInfo`),
          method: 'get',
          params: this.$http.adornParams({'orgId': this.dataForm.orgId})
        }).then(({data}) => {
          if(data && data.code === 0){
          this.JobIdList = data.list;
        }
      })
      },

      //当职务改变时
      JobIdChange() {
        this.dataForm.loginName1 = []
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectLoginNameInfo`),
          method: 'get',
          params: this.$http.adornParams({'userJob': this.dataForm.jobId})
        }).then(({data}) => {
          if(data && data.code === 0){
          this.LoginNameList = data.list;
        }
      })
      },

      //汇报部门下拉列表
      initToOrgIdList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectDepartmentNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toOrgIdList = data.list;
        }
      })
      },
      //当汇报类型改变时
      reportTypeChange(){
        this.dataForm.toOrgId=''
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectDepartmentNameInfo2/${this.dataForm.reportType}/${this.dataForm.orgId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toOrgIdList = data.list;
        }
      })
      },
      //汇报职务下拉列表
      initToJobIdList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectJobNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toJobIdList = data.list;
        }
      })
      },
      //汇报者账号
      initToLoginNameList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectLoginNameInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toLoginNameList = data.list;
        }
      })
      },

      //当部门改变时
      toOrgIdChange() {
        this.dataForm.toJobId = ''
        this.dataForm.toLoginName1 = []
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectJobNameInfo`),
          method: 'get',
          params: this.$http.adornParams({'orgId': this.dataForm.toOrgId})
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toJobIdList = data.list;
        }
      })
      },

      //当职务改变时
      toJobIdChange() {
        this.dataForm.toLoginName1 = []
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectLoginNameInfo`),
          method: 'get',
          params: this.$http.adornParams({'userJob': this.dataForm.toJobId})
        }).then(({data}) => {
          if(data && data.code === 0){
          this.toLoginNameList = data.list;
        }
      })
      },

      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysUserReport/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'orgId': this.dataForm.orgId,
                'jobId': this.dataForm.jobId,
                'loginName': this.dataForm.loginName1.join(','),
                'reportType': this.dataForm.reportType,
                'toOrgId': this.dataForm.toOrgId,
                'toJobId': this.dataForm.toJobId,
                'toLoginName': this.dataForm.toLoginName1.join(','),
                'reportType': this.dataForm.reportType,
              })
            }).then(({data}) => {
              if(data && data.code === 0){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
            }else{
              this.$message.error(data.msg)
            }
          })
          }
        }
      )
      }
    }
  }
</script>
