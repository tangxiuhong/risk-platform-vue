<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-select v-model="dataForm.eId" filterable clearable placeholder="企业" @focus="getEnterpriseTree()">-->
        <!--<el-option-->
          <!--v-for="item in eidOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-select v-model="dataForm.date" placeholder="时间" class="search_sensor">
        <el-option
          v-for="item in dateOptions"
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
      v-loading="dataListLoading"
      style="width: 100%;">
      <!--<el-table-column-->
        <!--prop="enterpriseName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="企业名称">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="workTime"
        header-align="center"
        align="center"
        label="工作时间">
      </el-table-column>
      <el-table-column
        prop="staticCount"
        header-align="center"
        align="center"
        label="矿井定员数">
      </el-table-column>
      <el-table-column
        prop="allowTime"
        header-align="center"
        align="center"
        label="允许井下最长工作时间">
      </el-table-column>
      <el-table-column
        prop="mainArea"
        header-align="center"
        align="center"
        label="重点区域">
      </el-table-column>
      <el-table-column
        prop="mainAreaPCount"
        header-align="center"
        align="center"
        label="重点区域定员数">
      </el-table-column>
      <el-table-column
        prop="limitArea"
        header-align="center"
        align="center"
        label="限制区域">
      </el-table-column>
      <el-table-column
        prop="persons"
        header-align="center"
        align="center"
        label="井下作业人员">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="数据时间">
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
          date: '0',
          eid: '',
          startTime: '',
          endTime: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        eidOptions: [],
        dateOptions: [
          {label: '今天', value: '0'},
          {label: '一周', value: '1'},
          {label: '一个月', value: '2'},
          {label: '半年', value: '3'},
          {label: '一年', value: '4'}
        ]
      }
    },
    components: {},
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/personnel/personnelInfo/listRycs'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'date': this.dataForm.date,
            'eId': this.dataForm.eId,
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
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eidOptions = data.list
          } else {
            this.eidOptions = []
          }
        })
      }
    }
  }
</script>
