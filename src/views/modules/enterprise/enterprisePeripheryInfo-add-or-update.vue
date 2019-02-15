<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item label="所属企业" prop="eid">
        <el-select v-model="dataForm.eid" filterable placeholder="所属企业" clearable>
          <el-option
            v-for="item in eIdCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业周边信息" prop="placeInfo">
        <!-- <el-radio-group v-model="dataForm.placeInfo">
           <el-radio :label="1">道路信息</el-radio>
           <el-radio :label="2">场所信息</el-radio>
           <el-radio :label="3">危险源信息</el-radio>
           <el-radio :label="4">消防设施信息</el-radio>
           <el-radio :label="5">危化信息</el-radio>
         </el-radio-group>-->
        <el-select v-model="dataForm.placeInfo" placeholder="企业周边信息">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方向信息" prop="directionInfo">
        <!--<el-radio-group v-model="dataForm.directionInfo">
          <el-radio :label="1">东面</el-radio>
          <el-radio :label="2">南面</el-radio>
          <el-radio :label="3">西面</el-radio>
          <el-radio :label="4">北面</el-radio>
          <el-radio :label="5">东南</el-radio>
          <el-radio :label="6">东北</el-radio>
          <el-radio :label="7">西北</el-radio>
          <el-radio :label="8">西南</el-radio>
        </el-radio-group>-->
        <el-select v-model="dataForm.directionInfo" placeholder="方向信息">
          <el-option
            v-for="item in directionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="距离信息" prop="rangeInfo">
        <el-input v-model="dataForm.rangeInfo" placeholder="距离信息"></el-input>
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
      <el-form-item label="周边建筑物信息描述" prop="buildingInfo">
        <el-input type="textarea" v-model="dataForm.buildingInfo" placeholder="周边各类建筑物信息等信息描述"></el-input>
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
  /* eslint-disable eqeqeq */

  import DialogMap from './sysEnterprise-detail-map'

  export default {
    data () {
      return {
        mapBox: false,
        visible: false,
        dataForm: {
          id: 0,
          eid: '',
          placeInfo: '',
          directionInfo: '',
          rangeInfo: '',
          mapX: '',
          mapY: '',
          buildingInfo: '',
          isSync: ''
        },
        options: [{
          value: 1,
          label: '道路信息'
        }, {
          value: 2,
          label: '场所信息'
        }, {
          value: 3,
          label: '危险源信息'
        }, {
          value: 4,
          label: '消防设施信息'
        }, {
          value: 5,
          label: '危化信息'
        }],
        directionOptions: [{
          value: 1,
          label: '东面'
        }, {
          value: 2,
          label: '南面'
        }, {
          value: 3,
          label: '西面'
        }, {
          value: 4,
          label: '北面'
        }, {
          value: 5,
          label: '东南'
        }, {
          value: 6,
          label: '东北'
        }, {
          value: 7,
          label: '西北'
        }, {
          value: 8,
          label: '西南'
        }],
        // 选择企业eid
        eIdCodeOptions: [],
        dataRule: {
          eid: [
            {required: true, message: '企业id不能为空', trigger: 'blur'}
          ],
          placeInfo: [
            {required: true, message: '企业周边信息不能为空', trigger: 'blur'}
          ],
          directionInfo: [
            {required: true, message: '方向信息不能为空', trigger: 'blur'}
          ],
          rangeInfo: [
            {required: true, message: '距离信息不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          mapX: [
            {required: true, message: '地图坐标X轴不能为空', trigger: 'blur'}
          ],
          mapY: [
            {required: true, message: '地图坐标Y轴不能为空', trigger: 'blur'}
          ],
          buildingInfo: [
            {required: true, message: '周边各类建筑物信息描述不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      DialogMap
    },
    methods: {
      // 获取企业主表id树
      getEIDTree () {
        var _this = this
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),    // -------------------------改成企业eid路径
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.list.length === 1) {
                _this.eIdCodeOptions = data.list
                _this.dataForm.eid = data.list[0].value
              } else {
                _this.eIdCodeOptions = data.list
              }
            } else {
              _this.eIdCodeOptions = []
            }
          })
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getEIDTree()
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterprisePeripheryInfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eid = data.enterprisePeripheryInfo.eid
                this.dataForm.placeInfo = data.enterprisePeripheryInfo.placeInfo
                this.dataForm.directionInfo = data.enterprisePeripheryInfo.directionInfo
                this.dataForm.rangeInfo = data.enterprisePeripheryInfo.rangeInfo
                this.dataForm.mapX = data.enterprisePeripheryInfo.mapX
                this.dataForm.mapY = data.enterprisePeripheryInfo.mapY
                this.dataForm.buildingInfo = data.enterprisePeripheryInfo.buildingInfo
                this.dataForm.isSync = data.enterprisePeripheryInfo.isSync
                this.getEIDTree()
                console.log('嗯嗯' + this.dataForm.mapX)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterprisePeripheryInfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'placeInfo': this.dataForm.placeInfo,
                'directionInfo': this.dataForm.directionInfo,
                'rangeInfo': this.dataForm.rangeInfo,
                'mapX': this.dataForm.mapX,
                'mapY': this.dataForm.mapY,
                'buildingInfo': this.dataForm.buildingInfo,
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
          if (this.dataForm.id == 0) {
            this.$refs.dialogMap.init(114.895340, 30.326430)
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
