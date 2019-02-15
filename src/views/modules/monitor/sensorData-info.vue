<template>
  <div class="sensorDataBox" style="overflow:scroll">
    <div class="sensorDataClose"><i class="el-icon-close" @click="sensorWarnOff"></i></div>
    <div class="sensorDataTitle">传感器实时数据详细信息：</div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-select v-model="dataForm.id" filterable placeholder="企业" clearable @focus="getEnterpriseTree()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="dataForm.sensor" placeholder="传感器名称" class="search_sensor" filterable clearable
                 @focus="getDeviceNameTree()">
        <el-option
          v-for="item in sensorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="dataForm.date" placeholder="时间" class="search_sensor">
        <el-option
          v-for="item in sensorDateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="dataForm.startTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="开始时间" :disabled="this.dataForm.status==1">
      </el-date-picker>
      <el-date-picker
        v-model="dataForm.endTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="结束时间" :disabled="this.dataForm.status==1">
      </el-date-picker>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      :height="height"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        label="传感器名称">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="deviceLoca"
        header-align="center"
        align="center"
        label="安装位置">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">启用</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="realValue"
        header-align="center"
        align="center"
        label="监测值">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="计量单位">
      </el-table-column>
      <el-table-column
        prop="maxRange"
        header-align="center"
        align="center"
        label="量程上限">
      </el-table-column>
      <el-table-column
        prop="minRange"
        header-align="center"
        align="center"
        label="量程下限">
      </el-table-column>
      <el-table-column
        prop="maxExcep"
        header-align="center"
        align="center"
        label="报警上限">
      </el-table-column>
      <el-table-column
        prop="minExcep"
        header-align="center"
        align="center"
        label="报警下限">
      </el-table-column>
      <el-table-column
        prop="high1"
        header-align="center"
        align="center"
        label="正常值上限">
      </el-table-column>
      <el-table-column
        prop="low1"
        header-align="center"
        align="center"
        label="正常值下限">
      </el-table-column>
      <el-table-column
        prop="high2"
        header-align="center"
        align="center"
        label="正常值上限">
      </el-table-column>
      <el-table-column
        prop="low2"
        header-align="center"
        align="center"
        label="低报警下限">
      </el-table-column>
      <el-table-column
        prop="high3"
        header-align="center"
        align="center"
        label="高报警上限">
      </el-table-column>
      <el-table-column
        prop="low3"
        header-align="center"
        align="center"
        label="高报警下限">
      </el-table-column>
      <el-table-column
        prop="isKey"
        header-align="center"
        align="center"
        label="是否关键传感器">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isKey === 0" size="small">不是</el-tag>
          <el-tag v-else-if="scope.row.isKey === 1" size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="alertDegree"
        header-align="center"
        align="center"
        label="报警级别">
      </el-table-column>
      <el-table-column
        prop="deviceType"
        header-align="center"
        align="center"
        label="报警类型">
      </el-table-column>
      <el-table-column
        prop="alarmDeviceName"
        header-align="center"
        align="center"
        label="报警设备名称">
      </el-table-column>
      <el-table-column
        prop="alarmTime"
        header-align="center"
        align="center"
        label="报警时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="实时数据时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          sensor: '',
          date: '0',
          startTime: '',
          endTime: ''
        },
        height: '500',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        options: [],
        sensorOptions: [],
        sensorDateOptions: [
          {label: '今天', value: '0'},
          {label: '一周', value: '1'},
          {label: '一个月', value: '2'},
          {label: '半年', value: '3'},
          {label: '一年', value: '4'}
        ]
      }
    },
    activated () {
      this.getEnterpriseTree()
      this.getDataList()
      this.getDeviceNameTree()
    },
    methods: {
      // 动态获取高度
      getHeight () {
        this.height = document.body.clientHeight - 280
      },
      // 获取数据列表
      getDataList () {
        this.getHeight()
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorData/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'eId': this.dataForm.id,
            'deviceId': this.dataForm.sensor,
            'date': this.dataForm.date,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 关闭dialog
      sensorWarnOff () {
        this.$emit('sensorDataInfoHide')
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/sensorConfigEnterpriseNameTree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.list
          } else {
            this.options = []
          }
        })
      },
      // 获取传感器名称
      getDeviceNameTree () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/deviceNameList'),
          method: 'get',
          params: this.$http.adornParams({
            'eId': this.dataForm.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.sensorOptions = data.list
          } else {
            this.sensorOptions = []
          }
        })
      }
    }
  }
</script>
<style>
  .sensorDataBox {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1999;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .sensorDataBox::-webkit-scrollbar {
    width: 0;
  }

  .sensorDataClose {
    text-align: right;
    font-size: 20px;
  }

  .sensorDataTitle {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
