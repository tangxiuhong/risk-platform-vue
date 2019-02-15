<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="变量名称" prop="varName">
        <el-input v-model="dataForm.varName" placeholder="变量名称"></el-input>
      </el-form-item>
      <el-form-item label="变量代码" prop="varCode">
        <el-input v-model="dataForm.varCode" placeholder="变量代码"></el-input>
      </el-form-item>
      <el-form-item label="变量父ID" prop="parentName">
        <el-popover
          ref="dicListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="dicList"
            :props="dicListTreeProps"
            node-key="id"
            ref="dicListTree"
            @current-change="dicListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:dicListPopover :readonly="true" placeholder="点击选择变量父ID"
                  class="menu-list__input"></el-input>
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
          varName: '',
          varCode: '',
          parentId: 0,
          parentName: ''
        },
        dataRule: {
          varName: [
            {required: true, message: '变量名称不能为空', trigger: 'blur'}
          ],
          varCode: [
            {required: true, message: '变量代码不能为空', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '变量父Id不能为空', trigger: 'change'}
          ]
        },
        dicList: [],
        dicListTreeProps: {
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
          url: this.$http.adornUrl('/sys/dic/select/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dicList = treeDataTranslate(data.dicList, 'id', 'pId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.dicListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dic/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.id = data.dic.id
              this.dataForm.varCode = data.dic.varCode
              this.dataForm.varName = data.dic.varName
              this.dataForm.parentId = data.dic.parentId
              this.dicListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      dicListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      dicListTreeSetCurrentNode () {
        this.$refs.dicListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.dicListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dic/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'varCode': this.dataForm.varCode,
                'varName': this.dataForm.varName,
                'parentId': this.dataForm.parentId
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
