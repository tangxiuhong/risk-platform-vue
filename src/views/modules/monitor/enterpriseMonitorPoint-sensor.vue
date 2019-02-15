<!--监测点-传感器-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible" width="50%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
  <p style="text-align: center; margin: 0 0 20px;font-size: 18px;font-weight: bold;">监测点名称 ：{{monitorPointName}}</p>
    <div style="text-align: center">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="rightData"
        filterable
        :left-default-checked="[]"
        :right-default-checked="[]"
        :titles="['未配置传感器', '已配置传感器']"
        :button-texts="['去除', '选中']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="leftData">
      </el-transfer>
    </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<style>
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>

<script>
  export default {
    data () {
      // const generateData = _ => {
      //   const data = []
      //   for (let i = 1; i <= 15; i++) {
      //     data.push({
      //       key: i,
      //       label: `传感器 ${i}`
      //     })
      //   }
      //   return data
      // }
      return {
        visible: false,
        leftData: [],
        rightData: [],
        dataForm: {},
        enterpriseId: '',
        monitorPointId: '',
        monitorPointName: ''
      }
    },
    methods: {
      init (enterpriseId, id, name) {
        this.visible = true
        this.enterpriseId = enterpriseId
        this.monitorPointId = id
        this.monitorPointName = name
        this.leftData = []
        this.rightData = []
        this.$http({
          url: this.$http.adornUrl('/monitor/enterpriseMonitorPoint/selectSensorListByMonitorPointId/' + this.monitorPointId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.leftData = this.leftData.concat(data.monitorPointSensorList)
            for (let i = 0; i < data.monitorPointSensorList.length; i++) {
              this.rightData[i] = data.monitorPointSensorList[i].key
            }
          } else {
            this.rightData = []
          }
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/monitor/enterpriseMonitorPoint/selectUnrelatedSensorList/' + this.enterpriseId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.leftData = this.leftData.concat(data.monitorPointSensorList)
            } else {
              this.leftData = []
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/enterpriseMonitorPoint/updateMonitorPointSensor`),
              method: 'post',
              data: this.$http.adornData({
                'enterpriseId': this.enterpriseId,
                'monitorPointId': this.monitorPointId,
                'monitorPointSensor': this.rightData
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
      handleChange (value, direction, movedKeys) {
        console.log('right---' + value)
      }
    }
  }
</script>
