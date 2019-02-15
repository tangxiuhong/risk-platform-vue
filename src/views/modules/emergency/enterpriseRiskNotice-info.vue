<template>
  <div class="emergencyBox">
    <div class="emergencyClose"><i class="el-icon-close" @click="emergencyNoticeOff"></i></div>
    <div class="emergencyTitle">公告信息：</div>
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
        prop="riskGroup"
        header-align="center"
        align="center"
        label="风险类型">
      </el-table-column>
      <el-table-column
        prop="riskPosition"
        header-align="center"
        align="center"
        label="环节或部位">
      </el-table-column>
      <el-table-column
        prop="riskResult"
        header-align="center"
        align="center"
        label="导致后果">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险等级">
      </el-table-column>
      <!--<el-table-column
        prop="measures"
        header-align="center"
        align="center"
        label="风险管控措施">
      </el-table-column>-->
      <!--<el-table-column
        prop="emergencyMeasures"
        header-align="center"
        align="center"
        label="处置措施">
      </el-table-column>-->
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        label="责任部门">
      </el-table-column>
      <el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="责任人">
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
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseRiskNotice/list'),
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
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 关闭dialog
      emergencyNoticeOff () {
        this.$emit('enterpriseRiskNoticeInfoHide')
      }
    }
  }
</script>
