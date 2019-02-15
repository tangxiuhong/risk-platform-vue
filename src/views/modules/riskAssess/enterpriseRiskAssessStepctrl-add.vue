<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="80%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item size="mini" label="风险点">
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
        <el-col :span="7">
          <el-form-item label="检查类型" prop="checkType">
            <el-radio-group v-model="dataForm.checkType" size="small">
              <el-radio-button :label=1>月</el-radio-button>
              <el-radio-button :label=2>两周</el-radio-button>
              <el-radio-button :label=3>一周</el-radio-button>
              <el-radio-button :label=4>天</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="检查次数" prop="checks">
            <el-input-number v-model="dataForm.checks" controls-position="right" :min="0" label="检查次数"></el-input-number>
          </el-form-item>
          <el-form-item label="检查开始日" prop="dayMin">
            <el-input-number v-model="dataForm.dayMin" controls-position="right" :min="0" :max="28" label="检查开始日"></el-input-number>
          </el-form-item>
          <el-form-item label="检查截止日" prop="dayMax">
            <el-input-number v-model="dataForm.dayMax" controls-position="right" :min="0" :max="28" label="检查截止日"></el-input-number>
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
    data () {
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
          pointId: '',
          checkDepartmentId: '',
          checkMan: '',
          checkType: '',
          dayMax: '',
          dayMin: '',
          checks: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          issync: '',
          riskUnit: ''
        },
       
        dataRule: {

          checkType: [
            { required: true, message: '检查类型不能为空', trigger: 'blur' }
          ],
          dayMax: [
            { required: true, message: '检查截止日不能为空', trigger: 'blur' }
          ],
          dayMin: [
            { required: true, message: '检查开始日不能为空', trigger: 'blur' }
          ],
          checks: [
            { required: true, message: '检查次数不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init () {
       
        this.visible = true
        this.initFromAccountList()
        this.initToAccountList()
      },
      initFromAccountList() {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/selecRiskPointTree`),
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
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/selectUserTree`),
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
      dataFormSubmit () {
        var fromList =[].concat(this.$refs.fromAccountListTree.getCheckedKeys());
        var toList = [].concat(this.$refs.toAccountListTree.getCheckedKeys());
        if(fromList.length<=0 || toList.length<=0)
        {
          this.$message.error("选择不能为空!")
          return false;
        }
        var pointIds=fromList.join(",");
        var checkMans = toList.join(",");

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessStepctrl/saveExt`),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'pointId': pointIds,
                'checkDepartmentId': this.dataForm.checkDepartmentId,
                'checkMan': checkMans,
                'checkType': this.dataForm.checkType,
                'dayMax': this.dataForm.dayMax,
                'dayMin': this.dataForm.dayMin,
                'checks': this.dataForm.checks
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
