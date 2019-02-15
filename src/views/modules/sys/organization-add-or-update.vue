<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="部门编号" prop="code">
        <el-input v-model="dataForm.code" placeholder="部门编号"></el-input>
      </el-form-item>
      <el-form-item label="部门地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="部门地址"></el-input>
      </el-form-item>
      <el-form-item label="部门图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="部门图标"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="seq">
        <el-input-number v-model="dataForm.seq" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentName">
        <el-popover
          ref="organizationListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="organizationList"
            :props="organizationListTreeProps"
            node-key="id"
            ref="organizationListTree"
            @current-change="organizationListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:organizationListPopover :readonly="true"
                  placeholder="点击选择上级部门" class="menu-list__input"></el-input>
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
  import Icon from '@/icons'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          code: '',
          address: '',
          icon: '',
          seq: 0,
          pid: 0,
          parentName: ''
        },
        dataRule: {
          name: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '部门编号不能为空', trigger: 'change'}
          ],
          address: [
            {required: true, message: '部门地址不能为空', trigger: 'change'}
          ],
          seq: [
            {required: true, message: '排序号不能为空', trigger: 'change'}
          ],
          pid: [
            {required: true, message: '上级部门不能为空', trigger: 'change'}
          ]
        },
        organizationList: [],
        organizationListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/organization/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.organizationList = treeDataTranslate(data.organizationList, 'id', 'pId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.organizationListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/organization/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.id = data.organization.id
              this.dataForm.code = data.organization.code
              this.dataForm.name = data.organization.name
              this.dataForm.address = data.organization.address
              this.dataForm.icon = data.organization.icon
              this.dataForm.seq = data.organization.seq
              this.dataForm.pid = data.organization.pid
              this.dataForm.parentName = data.organization.pname
              this.organizationListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      organizationListTreeCurrentChangeHandle (data, node) {
        this.dataForm.pid = data.id
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      organizationListTreeSetCurrentNode () {
        this.$refs.organizationListTree.setCurrentKey(this.dataForm.pid)
        this.dataForm.parentName = (this.$refs.organizationListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/organization/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'code': this.dataForm.code,
                'name': this.dataForm.name,
                'address': this.dataForm.address,
                'icon': this.dataForm.icon,
                'seq': this.dataForm.seq,
                'pid': this.dataForm.pid
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

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
