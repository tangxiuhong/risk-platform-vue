<template>
  <div class="sensorBox" style="overflow:scroll">
    <div class="sensorClose"><i class="el-icon-close" @click="sensorConfigOff"></i></div>
    <div class="sensorTitle">传感器配置详细信息：</div>
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
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
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
          sensor: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        options: [],
        sensorOptions: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'eId': this.dataForm.id,
            'deviceId': this.dataForm.sensor
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
      sensorConfigOff () {
        this.$emit('sensorConfigInfoHide')
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
