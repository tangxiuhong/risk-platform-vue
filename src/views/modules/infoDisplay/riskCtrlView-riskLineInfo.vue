<template>
  <div class="riskBox_riskLine">
    <div class="close_riskLine"><i class="el-icon-close" @click="riskLineOff"></i></div>
    <div class="riskTitle_riskLine">风险异常统计信息：</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
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
        prop="riskFactor"
        header-align="center"
        align="center"
        label="危险有害因素">
      </el-table-column>
      <el-table-column
        prop="riskDo"
        header-align="center"
        align="center"
        label="管控措施">
      </el-table-column>
      <el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="检查人">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="effectiveCount"
        header-align="center"
        align="center"
        label="状态">
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
        riskLevel: '',
        month: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    methods: {
      // 关闭dialog
      riskLineOff () {
        this.$emit('lineInfoHide')
      },
      // 获取数据列表
      getDataList (checkTime) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskDoErrForMonthCountList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'checkTime': checkTime
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
        this.getDataList(this.riskLevel, this.month)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.riskLevel, this.month)
      }
    }
  }
</script>

<style scoped>
  .riskBox_riskLine {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 9999;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .riskBox_riskLine::-webkit-scrollbar {
    width: 0;
  }

  .close_riskLine {
    text-align: right;
    font-size: 20px;
    cursor:pointer;
  }

  .riskTitle_riskLine {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
