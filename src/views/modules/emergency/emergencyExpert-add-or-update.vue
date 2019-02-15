<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="专家名称" prop="expertName">
        <el-input v-model="dataForm.expertName" placeholder="应急专家名称"></el-input>
      </el-form-item>
      <el-form-item label="专家类型" prop="expertTypeName">
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
        <el-input v-model="dataForm.expertTypeName" v-popover:industryListPopover :readonly="true"
                  placeholder="点击选择所属专家类型" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="position">
        <el-input v-model="dataForm.position" placeholder="职称"></el-input>
      </el-form-item>
      <el-form-item label="服务领域" prop="serviceField">
        <el-input v-model="dataForm.serviceField" placeholder="服务领域"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
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
          expertName: '',
          expertType: '',
          unit: '',
          position: '',
          serviceField: '',
          phone: '',
          isSync: 0,
          expertTypeName: ''
        },
        dataRule: {
          expertName: [
            {required: true, message: '应急专家名称不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          expertType: [
            {required: true, message: '专家类型(取变量表)不能为空', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '单位不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          position: [
            {required: true, message: '职称不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          serviceField: [
            {required: true, message: '服务领域不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '联系电话不能为空,并且长度在7~12字符之间', trigger: 'blur'},
            {min: 7, max: 12, message: '长度在7到12个字符', trigger: 'blur'}
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
          url: this.$http.adornUrl('/sys/dic/select/93'),
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
              url: this.$http.adornUrl(`/emergency/emergencyExpert/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.expertName = data.emergencyExpert.expertName
                this.dataForm.expertType = data.emergencyExpert.expertType
                this.dataForm.unit = data.emergencyExpert.unit
                this.dataForm.position = data.emergencyExpert.position
                this.dataForm.serviceField = data.emergencyExpert.serviceField
                this.dataForm.phone = data.emergencyExpert.phone
                this.dataForm.isSync = data.emergencyExpert.isSync
                this.industryListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 应急专家类型选中
      industryListTreeCurrentChangeHandle (data, node) {
        this.dataForm.expertType = data.id
        this.dataForm.expertTypeName = data.name
      },
      // 应急专家类型设置当前选中节点
      industryListTreeSetCurrentNode () {
        this.$refs.industryListTree.setCurrentKey(this.dataForm.expertType)
        this.dataForm.expertTypeName = (this.$refs.industryListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyExpert/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'expertName': this.dataForm.expertName,
                'expertType': this.dataForm.expertType,
                'unit': this.dataForm.unit,
                'position': this.dataForm.position,
                'serviceField': this.dataForm.serviceField,
                'phone': this.dataForm.phone,
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
