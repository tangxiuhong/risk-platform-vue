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
      <el-form-item>
        <el-input v-model="dataForm.cardNo" placeholder="工作卡号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.pName" placeholder="人员姓名" clearable></el-input>
      </el-form-item>
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
        prop="cardNo"
        header-align="center"
        align="center"
        label="工作卡号">
      </el-table-column>
      <el-table-column
        prop="idNo"
        header-align="center"
        align="center"
        label="身份证">
      </el-table-column>
      <el-table-column
        prop="pName"
        header-align="center"
        align="center"
        label="人员姓名">
      </el-table-column>
      <el-table-column
        prop="officeWork"
        header-align="center"
        align="center"
        label="职务">
      </el-table-column>
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="teamName"
        header-align="center"
        align="center"
        label="区队班组">
      </el-table-column>
      <el-table-column
        prop="mainArea"
        header-align="center"
        align="center"
        label="主要工作区域">
      </el-table-column>
      <el-table-column
        prop="nowArea"
        header-align="center"
        align="center"
        label="当前工作区域">
      </el-table-column>
      <el-table-column
        prop="nowTime"
        header-align="center"
        align="center"
        label="进入当前区域时间">
      </el-table-column>
      <el-table-column
        prop="toArea"
        header-align="center"
        align="center"
        label="应到地点">
      </el-table-column>
      <el-table-column
        prop="toTime"
        header-align="center"
        align="center"
        label="应到时间">
      </el-table-column>
      <el-table-column
        prop="realToTime"
        header-align="center"
        align="center"
        label="实到时间">
      </el-table-column>
      <el-table-column
        prop="accessTime"
        header-align="center"
        align="center"
        label="下井时间">
      </el-table-column>
      <el-table-column
        prop="outTime"
        header-align="center"
        align="center"
        label="出井时间">
      </el-table-column>
      <el-table-column
        prop="workTime"
        header-align="center"
        align="center"
        label="工作时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
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
          cardNo: '',
          pName: '',
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
    components: {
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/personnel/personnelInfo/listRytz'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'cardNo': this.dataForm.cardNo,
            'pName': this.dataForm.pName,
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
