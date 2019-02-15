<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="rowNum"
        header-align="center"
        align="center"
        label="行号">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险级别">
      </el-table-column>
      <el-table-column
        prop="position"
        header-align="center"
        align="center"
        label="分配位置">
      </el-table-column>
      <el-table-column
        prop="manager"
        header-align="center"
        align="center"
        label="管控者">
      </el-table-column>
      <el-table-column
        prop="dataTime"
        header-align="center"
        align="center"
        label="日期">
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
    <!-- 弹窗, 新增 / 修改 -->
    <pointDetailList v-if="pointDetailVisible" ref="pointDetailList" @refreshDataList="getDataList"></pointDetailList>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        pointDetailVisible: false
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
        /* this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessFactordo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskUnit': this.dataForm.riskUnit,
            'pointId': this.dataForm.riskpointId
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
