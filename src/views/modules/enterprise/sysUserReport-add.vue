<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">   
      <el-row>
      <el-col :span="9">
        <el-form-item size="mini" label="人员">
        <el-tree
          :data="fromAccountList"
          :props="fromAccountListTreeProps"
          node-key="id"
          ref="fromAccountListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item label="汇报类型" prop="reportType">
        <el-select v-model="dataForm.reportType" placeholder="汇报类型">
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.valueReportType"
            :label="item.labelReportType"
            :value="item.valueReportType">
          </el-option>
        </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="9">
        <el-form-item size="mini" label="人员">
        <el-tree
          :data="toAccountList"
          :props="toAccountListTreeProps"
          node-key="id"
          ref="toAccountListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
        </el-form-item>
      </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate, getLocalAddr} from '@/utils'
  export default {
    data() {
      return {
        visible: false,
        fromAccountList: [],
        fromAccountListTreeProps: {
          label: 'name',
          children: 'children'
        },
        toAccountList: [],
        toAccountListTreeProps: {
          label: 'name',
          children: 'children'
        },

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
      init() {
       
        this.visible = true
        this.fromAccountList = []
        this.toAccountList = []
        this.initFromAccountList()
        this.initToAccountList()
        
      },

      //部门下拉列表
      initFromAccountList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectUserTree`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          this.fromAccountList = treeDataTranslate(data.list, 'id', 'pId')
          //this.toAccountList = treeDataTranslate(data.list,'id','pId')
        }
      })
      },

      initToAccountList() {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/sysUserReport/selectUserTree`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data && data.code === 0){
          //this.fromAccountList = treeDataTranslate(data.list, 'id', 'pId')
          this.toAccountList = treeDataTranslate(data.list,'id','pId')
        }
      })
      },
      

      // 表单提交
      dataFormSubmit() {
        var fromList =[].concat(this.$refs.fromAccountListTree.getCheckedKeys());
        var toList = [].concat(this.$refs.toAccountListTree.getCheckedKeys());
        if(fromList.length<=0 || toList.length<=0)
        {
          this.$message.error("人员选择不能为空!")
          return false;
        }
        var loignIds=fromList.join(",");
        var toLoginIds = toList.join(",");
        
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysUserReport/saveExt`),
              method: 'get',
              params: this.$http.adornParams({
                'loginIds': loignIds,
                'toLoginIds': toLoginIds,
                'reportType': this.dataForm.reportType
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
