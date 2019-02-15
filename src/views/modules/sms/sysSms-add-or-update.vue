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
      <el-form-item label="推送名称" prop="smsName">
        <el-input v-model="dataForm.smsName" placeholder="推送名称(系统模块功能名称)"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="smsType">
        <el-radio-group v-model="dataForm.smsType">
          <el-radio :label="0">页面推送</el-radio>
          <el-radio :label="1">手机推送</el-radio>
          <el-radio :label="2">短信推送</el-radio>
        </el-radio-group>
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
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="消息标题"></el-input>
      </el-form-item>
      <el-form-item label="推送内容" prop="content">
        <el-input type="textarea" :rows="4" v-model="dataForm.content" placeholder="推送内容"></el-input>
      </el-form-item>
      <el-form-item label="要求推送时间" prop="smsTime">
        <el-date-picker type="datetime" v-model="dataForm.smsTime" placeholder="要求推送时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="要求推送次数" prop="smsCount">
        <el-input-number v-model="dataForm.smsCount" controls-position="right" :min="0"
                         label="要求推送次数"></el-input-number>
      </el-form-item>
      <el-form-item label="推送间隔时间" prop="intervalTime">
        <el-input-number v-model="dataForm.intervalTime" controls-position="right" :min="0"
                         label="要求推送次数"></el-input-number>
      </el-form-item>
      <el-form-item label="推送间隔时间单位" prop="intervalUnit">
        <el-radio-group v-model="dataForm.intervalUnit">
          <el-radio :label="0">秒</el-radio>
          <el-radio :label="1">分</el-radio>
          <el-radio :label="2">时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">待推送</el-radio>
          <el-radio :label="1">推送成功</el-radio>
          <el-radio :label="2">推动失败</el-radio>
          <el-radio :label="3">已读</el-radio>
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
          smsName: '',
          smsType: 0,
          smsSource: 2,
          targetList: '',
          title: '',
          content: '',
          smsTime: '',
          smsCount: '',
          intervalTime: '',
          intervalUnit: 0,
          status: 0,
          appType: 0,
          parameter1: '',
          parameter2: '',
          enterpriseId: '',
          enterpriseIdList: [],
          enterpriseName: ''
        },
        dataRule: {
          eId: [
            {required: true, message: '企业ID不能为空', trigger: 'blur'}
          ],
          smsName: [
            {required: true, message: '推送名称(系统模块功能名称)不能为空', trigger: 'blur'}
          ],
          smsSource: [
            {required: true, message: '消息来源不能为空', trigger: 'blur'}
          ],
          smsType: [
            {required: true, message: '推送类型，不能为空', trigger: 'blur'}
          ],
          targetList: [
            {required: true, message: '账号/手机号码不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '消息标题不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '推送内容不能为空', trigger: 'blur'}
          ],
          smsTime: [
            {required: true, message: '要求推送时间不能为空', trigger: 'blur'}
          ],
          smsCount: [
            {required: true, message: '要求推送次数不能为空', trigger: 'blur'}
          ],
          intervalTime: [
            {required: true, message: '推送时间间隔不能为空', trigger: 'blur'}
          ],
          intervalUnit: [
            {required: true, message: '推送间隔时间单位不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          appType: [
            {required: true, message: '平台类型，不能为空', trigger: 'blur'}
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
                url: this.$http.adornUrl(`/sms/sysSms/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.eId = data.sysSms.eid
                  this.dataForm.smsName = data.sysSms.smsName
                  this.dataForm.smsType = data.sysSms.smsType
                  this.dataForm.targetList = data.sysSms.targetList
                  this.dataForm.title = data.sysSms.title
                  this.dataForm.content = data.sysSms.content
                  this.dataForm.smsTime = data.sysSms.smsTime
                  this.dataForm.smsCount = data.sysSms.smsCount
                  this.dataForm.intervalTime = data.sysSms.intervalTime
                  this.dataForm.intervalUnit = data.sysSms.intervalUnit
                  this.dataForm.smsSource = data.sysSms.smsSource
                  this.dataForm.status = data.sysSms.status
                  this.dataForm.appType = data.sysSms.appType
                  this.dataForm.parameter1 = data.sysSms.parameter1
                  this.dataForm.parameter2 = data.sysSms.parameter2
                  this.enterpriseListTreeSetCurrentNode()
                  var idx = data.sysSms.accountList.indexOf(this.tempKey)
                  if (idx !== -1) {
                    data.sysSms.accountList.splice(idx, data.sysSms.accountList.length - idx)
                  }
                  this.$refs.accountListTree.setCheckedKeys(data.sysSms.accountList)
                }
              })
            } else {
              // 添加
              this.$refs.accountListTree.setCheckedKeys([])
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
              url: this.$http.adornUrl(`/sms/sysSms/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eId,
                'smsName': this.dataForm.smsName,
                'smsType': this.dataForm.smsType,
                'smsSource': this.dataForm.smsSource,
                'title': this.dataForm.title,
                'content': this.dataForm.content,
                'smsTime': this.dataForm.smsTime,
                'smsCount': this.dataForm.smsCount,
                'intervalTime': this.dataForm.intervalTime,
                'intervalUnit': this.dataForm.intervalUnit,
                'status': this.dataForm.status,
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
