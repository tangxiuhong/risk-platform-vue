<template>
  <div class="riskBox">
    <div class="close"><i class="el-icon-close" @click="riskPointOff"></i></div>
    <div class="riskTitle">风险点数量：{{pointCount}}</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="assessNo"
        header-align="center"
        align="center"
        label="评估编号">
      </el-table-column>
      <el-table-column
        prop="riskUnit"
        header-align="center"
        align="center"
        label="风险单元">
      </el-table-column>
      <el-table-column
        prop="riskPoint"
        header-align="center"
        align="center"
        label="风险点">
      </el-table-column>
      <el-table-column
        prop="assessValue"
        header-align="center"
        align="center"
        label="评估结果值">
      </el-table-column>
      <el-table-column
        prop="assessLevel"
        header-align="center"
        align="center"
        label="评估结果等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assessLevel === 1" size="small">重大风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 2" size="small">较大风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 3" size="small">一般风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 4" size="small">低风险</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="listPersonName"
        header-align="center"
        align="center"
        label="单元确认人">
      </el-table-column>
      <el-table-column
        prop="listDate"
        header-align="center"
        align="center"
        label="单元确认时间">
      </el-table-column>
      <el-table-column
        prop="assessPersonName"
        header-align="center"
        align="center"
        label="评估人">
      </el-table-column>
      <el-table-column
        prop="assessDate"
        header-align="center"
        align="center"
        label="评估时间">
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
        pointCount: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    methods: {
      // 关闭dialog
      riskPointOff () {
        this.$emit('riskPointInfoHide')
      },
      activated () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList (pointCount) {
        this.pointCount = pointCount
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/riskPointInfo'),
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
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.pointCount)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.pointCount)
      }
    }
  }
</script>

<style scoped>

</style>
