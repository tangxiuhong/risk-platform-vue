<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="所属救援队伍" prop="teamName">
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
        <el-input v-model="dataForm.teamName" v-popover:industryListPopover :readonly="true" placeholder="点击选择所属救援队伍"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="物资装备类型" prop="equipmentName">
        <el-popover
          ref="areaListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="areaList"
            :props="areaListTreeProps"
            node-key="id"
            ref="areaListTree"
            @current-change="areaListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.equipmentName" v-popover:areaListPopover :readonly="true" placeholder="点击选择物资装备类型"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="物资装备数量" prop="equipmentNum">
        <el-input-number v-model="dataForm.equipmentNum" controls-position="right" :min="0"
                         label="物资装备数量"></el-input-number>
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
          teamId: '',
          equipmentType: '',
          equipmentNum: '',
          isSync: 0,
          teamName: '',
          equipmentName: ''
        },
        dataRule: {
          teamId: [
            {required: true, message: '救援队伍id不能为空', trigger: 'blur'}
          ],
          equipmentType: [
            {required: true, message: '物资装备类型(取变量表)不能为空', trigger: 'blur'}
          ],
          equipmentNum: [
            {required: true, message: '物资装备数量不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '是否同步(0:同步 1:不同步)不能为空', trigger: 'blur'}
          ]
        },
        industryList: [],
        industryListTreeProps: {
          label: 'name',
          children: 'children'
        },
        areaList: [],
        areaListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/emergency/emergencyRescueTeam/selectEmergencyRescueTeamTree/0'),
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
          this.$http({
            url: this.$http.adornUrl('/sys/dic/select/313'),
            method: 'get',
            par: this.$http.adornParams()
          }).then(({data}) => {
            this.areaList = treeDataTranslate(data.dicList, 'id', 'pId')
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyRescueEquipment/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.teamId = data.emergencyRescueEquipment.teamId
                this.dataForm.equipmentType = data.emergencyRescueEquipment.equipmentType
                this.dataForm.equipmentNum = data.emergencyRescueEquipment.equipmentNum
                this.dataForm.isSync = data.emergencyRescueEquipment.isSync
                this.industryListTreeSetCurrentNode()
                this.areaListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 救援队伍选择
      industryListTreeCurrentChangeHandle (data, node) {
        this.dataForm.teamId = data.id
        this.dataForm.teamName = data.name
      },
      // 救援队伍设置当前选中节点
      industryListTreeSetCurrentNode () {
        this.$refs.industryListTree.setCurrentKey(this.dataForm.teamId)
        this.dataForm.teamName = (this.$refs.industryListTree.getCurrentNode() || {})['name']
      },
      // 物资装备类型选中
      areaListTreeCurrentChangeHandle (data, node) {
        this.dataForm.equipmentType = data.id
        this.dataForm.equipmentName = data.name
      },
      // 物资装备类型设置当前选中节点
      areaListTreeSetCurrentNode () {
        this.$refs.areaListTree.setCurrentKey(this.dataForm.equipmentType)
        this.dataForm.equipmentName = (this.$refs.areaListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyRescueEquipment/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'teamId': this.dataForm.teamId,
                'equipmentType': this.dataForm.equipmentType,
                'equipmentNum': this.dataForm.equipmentNum,
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
