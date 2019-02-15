<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="所属企业" prop="enterpriseName">
        <el-popover
          ref="enterpriseListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="enterpriseList"
            :props="enterpriseListTreeProps"
            node-key="id"
            ref="enterpriseListTree"
            @current-change="enterpriseListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.enterpriseName" v-popover:enterpriseListPopover :readonly="true"
                  placeholder="点击选择所属企业" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="消息来源" prop="smsSource">
        <el-radio-group v-model="dataForm.smsSource">
          <el-radio :label="0">风险变化</el-radio>
          <el-radio :label="1">实时监测</el-radio>
          <el-radio :label="2">信息发布</el-radio>
          <el-radio :label="3">隐患排查</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="平台类型" prop="appType">
        <el-radio-group v-model="dataForm.appType">
          <el-radio :label="0">平台</el-radio>
          <el-radio :label="1">大屏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预留1" prop="parameter1">
        <el-input v-model="dataForm.parameter1" placeholder="预留1"></el-input>
      </el-form-item>
      <el-form-item label="预留2" prop="parameter2">
        <el-input v-model="dataForm.parameter2" placeholder="预留2"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="账号">
        <el-tree
          :data="accountList"
          :props="accountListTreeProps"
          node-key="id"
          ref="accountListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
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
          targetList: '',
          smsSource: '',
          appType: 0,
          parameter1: '',
          parameter2: '',
          enterpriseName: '',
          enterpriseId: '',
          enterpriseIdList: []
        },
        dataRule: {
          eId: [
            {required: true, message: '企业ID不能为空', trigger: 'blur'}
          ],
          targetList: [
            {required: true, message: '账号列表不能为空', trigger: 'blur'}
          ],
          smsSource: [
            {required: true, message: '消息来源不能为空', trigger: 'blur'}
          ],
          appType: [
            {required: true, message: '平台类型不能为空', trigger: 'blur'}
          ]
        },
        enterpriseList: [],
        enterpriseListTreeProps: {
          label: 'name',
          children: 'children'
        },
        // 用户列表
        accountList: [],
        accountListTreeProps: {
          label: 'name',
          children: 'children'
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectByEnterpriseIds'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.enterpriseList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
          }).then(() => {
            // 用户列表
            this.$http({
              url: this.$http.adornUrl('/enterprise/enterpriseDepartment/selectUser'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.accountList = treeDataTranslate(data.userList, 'id', 'pId')
            })
          }).then(() => {
            // 修改
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sms/sysSmsSource/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.eId = data.sysSmsSource.eid
                  this.dataForm.targetList = data.sysSmsSource.targetList
                  this.dataForm.smsSource = data.sysSmsSource.smsSource
                  this.dataForm.appType = data.sysSmsSource.appType
                  this.dataForm.parameter1 = data.sysSmsSource.parameter1
                  this.dataForm.parameter2 = data.sysSmsSource.parameter2
                  this.enterpriseListTreeSetCurrentNode()
                  var idx = data.sysSmsSource.accountList.indexOf(this.tempKey)
                  if (idx !== -1) {
                    data.sysSmsSource.accountList.splice(idx, data.sysSmsSource.accountList.length - idx)
                  }
                  this.$refs.accountListTree.setCheckedKeys(data.sysSmsSource.accountList)
                }
              })
            }
          })
        })
      },
      // 企业树选中
      enterpriseListTreeCurrentChangeHandle (data, node) {
        this.dataForm.eId = data.id
        this.dataForm.enterpriseName = data.name
      },
      // 企业树设置当前选中节点
      enterpriseListTreeSetCurrentNode () {
        this.$refs.enterpriseListTree.setCurrentKey(this.dataForm.eId)
        this.dataForm.enterpriseName = (this.$refs.enterpriseListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sms/sysSmsSource/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eId,
                'targetList': this.dataForm.targetList,
                'smsSource': this.dataForm.smsSource,
                'appType': this.dataForm.appType,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
                'accountList': [].concat(this.$refs.accountListTree.getCheckedKeys())
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
