<template>
  <div class="mod-config">
    <h3>员工调动</h3>
    <el-form :inline="true" :model="dataForm">
    <el-row :gutter="10">
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
      <el-form-item label="员工所属部门">
        <el-select v-model="dataForm.departmentId" clearable filterable placeholder="请选择部门"
                   @change=departmentChange>
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>   
      </el-form-item>
      <el-form-item label="员工">
        <el-select v-model="dataForm.employeeId" clearable filterable multiple placeholder="请选择员工">
          <el-option
            v-for="item in employeeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> 
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
      <el-form-item label="员工调去部门">
        <el-select v-model="dataForm.newDepartmentId" clearable filterable placeholder="请选择新部门">
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>  
      </el-form-item>
      <el-form-item label="员工新职位">
        <el-select v-model="dataForm.newJobId" clearable filterable placeholder="请选择新职务">
          <el-option
            v-for="item in jobList"
            :key="item.id"
            :label="item.jobName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      </el-col>
    </el-row>
     <el-row :gutter="10">
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
      <el-form-item>
        <el-button @click="updateHandle()">提交</el-button>
      </el-form-item>
      </el-col>
    </el-row>
    </el-form>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        departmentList:[],
        employeeList:[],
        jobList:[],
        dataForm: {
          departmentId: '',
          employeeId:'',
          jobName:'',
          newDepartmentId:'',
          newjobId:''
        }
       
      }
    },
    components: {
      
    },
    activated () {
      this.init()
    },
    methods: {
      // 获取数据列表
      init () {
        this.initDepartmentList();
        this.initJobList(); 
      },
      initDepartmentList () {
        this.departmentList = []
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/listDepartments'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            this.departmentList = data.list;
          }
        })
      },
      departmentChange(eventId)
      {
        this.dataForm.departmentId = eventId;
         this.employeeList = [];
        if (this.dataForm.departmentId && this.dataForm.departmentId != '') {
          var orgId = this.dataForm.departmentId;
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/listUsersByDepartment/' + orgId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0 && data.list) {
              this.employeeList = data.list;
            }
          })
        }
      },
     
      initJobList () {
        this.jobList = []
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseEmployee/jobList'),
          method: 'get',
          params: this.$http.adornParams({'pageSize':1000})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.jobList = data.page;
          }
        })
      },

      updateHandle()
      {
        if (this.dataForm.employeeId && this.dataForm.employeeId.length > 0  && this.dataForm.newDepartmentId && this.dataForm.newDepartmentId != '')
        {
          var emps = "";
          for(var i=0;i<this.dataForm.employeeId.length;i++)
          {
            emps = this.dataForm.employeeId[i]+';'+emps;
          }
          this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseEmployee/updateUserInfo`),
              method: 'get',
              params: this.$http.adornParams({
                'employeeIds': emps,
                'newDepartmentId': this.dataForm.newDepartmentId,
                'newjobId': this.dataForm.newjobId
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
           
      }
    }
  }
</script>
