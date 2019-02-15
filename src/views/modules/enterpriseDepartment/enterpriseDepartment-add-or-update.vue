<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
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
      <el-form-item label="所属父ID" prop="parentName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="id"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属父ID"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="部门代码" prop="departmentCode">
        <el-input v-model="dataForm.departmentCode" placeholder="部门代码"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="departmentName">
        <el-input v-model="dataForm.departmentName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="预留1" prop="parameter1">
        <el-input v-model="dataForm.parameter1" placeholder="预留1"></el-input>
      </el-form-item>
      <el-form-item label="预留2" prop="parameter2">
        <el-input v-model="dataForm.parameter2" placeholder="预留2"></el-input>
      </el-form-item>
      <el-form-item label="数据同步" size="mini" prop="isSync">
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
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          enterpriseId: '',
          parentId: '',
          departmentCode: '',
          departmentName: '',
          parameter1: '',
          parameter2: '',
          isSync: '',
          enterpriseName: '',
          parentName: ''
        },
        dataRule: {
          enterpriseId: [
            {required: true, message: '企业ID不能为空', trigger: 'blur'}
          ],
          parentId: [
            {required: true, message: '父ID不能为空', trigger: 'blur'}
          ],
          departmentCode: [
            {required: true, message: '部门代码不能为空', trigger: 'blur'}
          ],
          departmentName: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ],
          parameter1: [
            {required: false, message: '预留1不能为空', trigger: 'blur'}
          ],
          parameter2: [
            {required: false, message: '预留2不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步(0:是,1:否)不能为空', trigger: 'blur'}
          ]
        },
        enterpriseList: [],
        enterpriseListTreeProps: {
          label: 'name',
          children: 'children'
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id, enterpriseId) {
        this.dataForm.id = id || 0
        this.dataForm.enterpriseId = enterpriseId || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.enterpriseList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/${this.dataForm.enterpriseId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.enterpriseId = data.enterpriseDepartment.eid
                  this.dataForm.parentId = data.enterpriseDepartment.parentId
                  this.dataForm.departmentCode = data.enterpriseDepartment.departmentCode
                  this.dataForm.departmentName = data.enterpriseDepartment.departmentName
                  this.dataForm.parameter1 = data.enterpriseDepartment.parameter1
                  this.dataForm.parameter2 = data.enterpriseDepartment.parameter2
                  this.dataForm.isSync = data.enterpriseDepartment.isSync
                  this.enterpriseListTreeSetCurrentNode()
                  this.deptListTreeSetCurrentNode()
                }
              })
            }
          })
        })
      },
      // 企业树选中
      enterpriseListTreeCurrentChangeHandle (data, node) {
        this.dataForm.enterpriseId = data.id
        this.dataForm.enterpriseName = data.name
        // 企业部门联动
        this.chageDeptList(this.dataForm.enterpriseId)
      },
      // 企业树设置当前选中节点
      enterpriseListTreeSetCurrentNode () {
        this.$refs.enterpriseListTree.setCurrentKey(this.dataForm.enterpriseId)
        this.dataForm.enterpriseName = (this.$refs.enterpriseListTree.getCurrentNode() || {})['name']
      },
      // 企业部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
      },
      // 企业部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          console.log('enterpriseId2:' + this.dataForm.enterpriseId + 'parentId2:' + this.dataForm.parentId)
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.enterpriseId,
                'parentId': this.dataForm.parentId,
                'enterpriseId': this.dataForm.enterpriseId,
                'departmentCode': this.dataForm.departmentCode,
                'departmentName': this.dataForm.departmentName,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
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
      chageDeptList (enterpriseId) {
        console.log('联动企业部门：' + enterpriseId)
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/${enterpriseId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
        })
      }
    }
  }
</script>
