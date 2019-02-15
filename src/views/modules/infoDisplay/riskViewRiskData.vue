<template>
  <div class="riskBox">
    <div class="close"><i class="el-icon-close" @click="dataOff"></i></div>
    <div class="riskTitle">
      <span v-if="level==1">重大风险详情:</span>
      <span v-else-if="level==2">较大风险详情:</span>
      <span v-else-if="level==3">一般风险详情:</span>
      <span v-else-if="level==4">低风险详情:</span>
    </div>
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
        prop="memo"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="assessValue"
        header-align="center"
        align="center"
        label="风险评估结果值">
      </el-table-column>
      <el-table-column
        prop="assessLevel"
        header-align="center"
        align="center"
        label="风险评估结果等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assessLevel === 1" size="small">重大风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 2" size="small">较大风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 3" size="small">一般风险</el-tag>
          <el-tag v-if="scope.row.assessLevel === 4" size="small">低风险</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="assessPersonName"
        header-align="center"
        align="center"
        label="评估人">
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
        level: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    methods: {
      // 获取数据列表
      getDataList (level) {
        this.level = level
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessResult/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'assessLevel': this.level
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
      dataOff () {
        this.$emit('dataHide')
      }
    }
  }
</script>

