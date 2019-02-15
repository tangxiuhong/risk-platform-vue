<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="dataForm.url" placeholder="资源路径"></el-input>
      </el-form-item>
      <el-form-item label="资源介绍" prop="description">
        <el-input v-model="dataForm.description" placeholder="资源介绍"></el-input>
      </el-form-item>
      <el-form-item label="资源图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="资源图标"></el-input>
      </el-form-item>
      <el-form-item label="父级资源" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单"
                  class="menu-list__input"></el-input>
      </el-form-item>

      <el-form-item label="排序号" prop="seq">
        <el-input-number v-model="dataForm.seq" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="资源类别" size="mini" prop="resourceType">
        <el-radio-group v-model="dataForm.resourceType">
          <el-radio :label="0">菜单</el-radio>
          <el-radio :label="1">方法</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打开方式" size="mini" prop="openMode">
        <el-radio-group v-model="dataForm.openMode">
          <el-radio :label="0">ajax</el-radio>
          <el-radio :label="1">iframe</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打开状态" size="mini" prop="opened">
        <el-radio-group v-model="dataForm.opened">
          <el-radio :label="0">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
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
  import Icon from '@/icons'

  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          url: '',
          openMode: 0,
          description: '',
          icon: '',
          parentId: 0,
          parentName: '',
          seq: '',
          status: 0,
          opened: 0,
          resourceType: 1
        },
        dataRule: {
          name: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '上级菜单不能为空', trigger: 'change'}
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
          ]
        },
        menuList: [],
        menuListTreeProps: {
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
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl('/sys/menu/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.menuList = treeDataTranslate(data.menuList, 'id', 'pId')
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/menu/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                this.dataForm.id = data.menu.id,
                  this.dataForm.name = data.menu.name,
                  this.dataForm.url = data.menu.url,
                  this.dataForm.openMode = data.menu.openMode,
                  this.dataForm.description = data.menu.description,
                  this.dataForm.icon = data.menu.icon,
                  this.dataForm.pid = data.menu.pid,
                  this.dataForm.seq = data.menu.seq,
                  this.dataForm.status = data.menu.status,
                  this.dataForm.opened = data.menu.opened,
                  this.dataForm.resourceType = data.menu.resourceType,
                  this.menuListTreeSetCurrentNode()
              })
            }
          })
        })
      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.pid = data.id
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.pid)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/menu/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'url': this.dataForm.url,
                'openMode': this.dataForm.openMode,
                'description': this.dataForm.description,
                'icon': this.dataForm.icon,
                'pid': this.dataForm.pid,
                'seq': this.dataForm.seq,
                'status': this.dataForm.status,
                'opened': this.dataForm.opened,
                'resourceType': this.dataForm.resourceType
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
