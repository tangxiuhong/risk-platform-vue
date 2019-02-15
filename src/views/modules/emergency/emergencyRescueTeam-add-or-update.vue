<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="救援队伍名称" prop="teamName">
        <el-input v-model="dataForm.teamName" placeholder="救援队伍名称"></el-input>
      </el-form-item>
      <el-form-item label="所属类型" prop="teamTypeName">
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
        <el-input v-model="dataForm.teamTypeName" v-popover:industryListPopover :readonly="true"
                  placeholder="点击选择所属救援队伍类型" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="所在地址" prop="teamAddress">
        <el-input v-model="dataForm.teamAddress" placeholder="所在地址"></el-input>
      </el-form-item>
      <el-form-item label="地图坐标X轴" prop="mapX">
        <el-input v-model="dataForm.mapX" placeholder="地图坐标X轴">
        </el-input>
      </el-form-item>
      <el-form-item label="地图坐标Y轴" prop="mapY">
        <el-input v-model="dataForm.mapY" placeholder="地图坐标Y轴">
          <el-button slot="append" type="primary" @click="showMap">GO</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <dialog-map v-if="mapBox" ref="dialogMap" @hidden=mapHideShow @HiddenAndMap="setMap"></dialog-map>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import DialogMap from './sysEnterprise-detail-map'

  export default {
    data () {
      return {
        mapBox: false,
        visible: false,
        dataForm: {
          id: 0,
          teamName: '',
          teamType: '',
          teamAddress: '',
          mapX: '',
          mapY: '',
          phone: '',
          isSync: 0,
          teamTypeName: ''
        },
        dataRule: {
          teamName: [
            {required: true, message: '救援队伍名称不能为空', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}
          ],
          teamType: [
            {required: true, message: '救援队伍类型(取变量表，消防，医疗，...)不能为空', trigger: 'blur'}
          ],
          teamAddress: [
            {required: true, message: '所在地址不能为空', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}
          ],
          mapX: [
            {required: true, message: '地图坐标X轴不能为空', trigger: 'blur'}
          ],
          mapY: [
            {required: true, message: '地图坐标Y轴不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '联系电话不能为空', trigger: 'blur'}
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
    components: {
      DialogMap
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dic/select/102'),
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
              url: this.$http.adornUrl(`/emergency/emergencyRescueTeam/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.teamName = data.emergencyRescueTeam.teamName
                this.dataForm.teamType = data.emergencyRescueTeam.teamType
                this.dataForm.teamAddress = data.emergencyRescueTeam.teamAddress
                this.dataForm.mapX = data.emergencyRescueTeam.mapX
                this.dataForm.mapY = data.emergencyRescueTeam.mapY
                this.dataForm.phone = data.emergencyRescueTeam.phone
                this.dataForm.isSync = data.emergencyRescueTeam.isSync
                this.industryListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 救援队伍类型选择
      industryListTreeCurrentChangeHandle (data, node) {
        this.dataForm.teamType = data.id
        this.dataForm.teamTypeName = data.name
      },
      // 救援队伍类型设置当前选中节点
      industryListTreeSetCurrentNode () {
        this.$refs.industryListTree.setCurrentKey(this.dataForm.teamType)
        this.dataForm.teamTypeName = (this.$refs.industryListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyRescueTeam/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'teamName': this.dataForm.teamName,
                'teamType': this.dataForm.teamType,
                'teamAddress': this.dataForm.teamAddress,
                'mapX': this.dataForm.mapX,
                'mapY': this.dataForm.mapY,
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
      },
      mapHideShow () {
        this.mapBox = false
      },
      setMap (x, y) {
        this.dataForm.mapX = x
        this.dataForm.mapY = y
        this.mapBox = false
      },
      showMap () {
        this.mapBox = true
        this.$nextTick(() => {
          if (this.dataForm.id === 0) {
            this.$refs.dialogMap.init(114.76119, 30.302767)
          } else {
            this.$refs.dialogMap.init(this.dataForm.mapX, this.dataForm.mapY)
          }
        })
      }
    }
  }
</script>
<style>
  .el-radio {
    margin: 10px 0;
  }
</style>
