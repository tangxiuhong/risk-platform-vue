<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="监管部门名称" prop="regulatorName">
        <el-input v-model="dataForm.regulatorName" placeholder="监管部门名称"></el-input>
      </el-form-item>
      <el-form-item label="监管部门类型" prop="regulatorTypeName">
        <el-popover
          ref="industryListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="industryList"
            :props="industryListTreeProps"
            node-key="id"
            ref="industryListTree"
            @current-change="industryListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.regulatorTypeName" v-popover:industryListPopover :readonly="true"
                  placeholder="点击选择所属监管部门类型" class="menu-list__input"></el-input>
      </el-form-item>

      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="dataForm.contacts" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
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
          regulatorName: '',
          regulatorType: '',
          contacts: '',
          phone: '',
          email: '',
          isSync: 0,
          regulatorTypeName: ''
        },
        dataRule: {
          regulatorName: [
            {required: true, message: '监管部门名称不能为空', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}
          ],
          regulatorType: [
            {required: true, message: '监管部门类型(取变量表)不能为空', trigger: 'blur'}
          ],
          contacts: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '电话不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '是否同步(0:同步 1:不同步)不能为空', trigger: 'blur'}
          ]
        },
        industryList: [],
        industryListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dic/select/155'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.industryList = treeDataTranslate(data.dicList, 'id', 'pId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyRegulator/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.regulatorName = data.emergencyRegulator.regulatorName
                this.dataForm.regulatorType = data.emergencyRegulator.regulatorType
                this.dataForm.contacts = data.emergencyRegulator.contacts
                this.dataForm.phone = data.emergencyRegulator.phone
                this.dataForm.email = data.emergencyRegulator.email
                this.dataForm.isSync = data.emergencyRegulator.isSync
                this.industryListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 监管部门树选中
      industryListTreeCurrentChangeHandle (data, node) {
        this.dataForm.regulatorType = data.id
        this.dataForm.regulatorTypeName = data.name
      },
      // 监管部门树设置当前选中节点
      industryListTreeSetCurrentNode () {
        this.$refs.industryListTree.setCurrentKey(this.dataForm.regulatorType)
        this.dataForm.regulatorTypeName = (this.$refs.industryListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyRegulator/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'regulatorName': this.dataForm.regulatorName,
                'regulatorType': this.dataForm.regulatorType,
                'contacts': this.dataForm.contacts,
                'phone': this.dataForm.phone,
                'email': this.dataForm.email,
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
