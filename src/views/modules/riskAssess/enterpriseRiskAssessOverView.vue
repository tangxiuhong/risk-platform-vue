<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="doId"
        header-align="center"
        align="center"
        label="评估编号">
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险评估等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.riskLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 4" size="small">4级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 5" size="small">5级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        header-align="center"
        align="center"
        label="个数">
      </el-table-column>
      <el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="评估负责人">
      </el-table-column>
      <el-table-column
        prop="dataTime"
        header-align="center"
        align="center"
        label="评估时间">
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建者">
      </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注">
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
        riskUnitList: [],
        riskPointList: [],
        dataForm: {
          riskUnit: '',
          riskpointId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
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
      /*  this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessOverView/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
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
        })*/
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
      }
    }
  }
</script>
