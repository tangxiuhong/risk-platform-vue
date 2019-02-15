<template>
  <div class="riskBox_Monthly">
    <div class="close_Monthly"><i class="el-icon-close" @click="monthlyOff"></i></div>
    <div class="riskTitle_Monthly">风险详细信息：</div>
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
        prop="riskType"
        header-align="center"
        align="center"
        label="风险类型">
      </el-table-column>
      <el-table-column
        prop="riskName"
        header-align="center"
        align="center"
        label="风险名称">
      </el-table-column>
      <el-table-column
        prop="riskResult"
        header-align="center"
        align="center"
        label="风险造成的后果">
      </el-table-column>
      <el-table-column
        prop="riskProbability"
        header-align="center"
        align="center"
        label="发生的可能性">
      </el-table-column>
      <el-table-column
        prop="riskSeverity"
        header-align="center"
        align="center"
        label="后果严重性">
      </el-table-column>
      <el-table-column
        prop="riskValue"
        header-align="center"
        align="center"
        label="风险值">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险级别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.riskLevel === 1" size="small">重大风险</el-tag>
          <el-tag v-if="scope.row.riskLevel === 2" size="small">较大风险</el-tag>
          <el-tag v-if="scope.row.riskLevel === 3" size="small">一般风险</el-tag>
          <el-tag v-if="scope.row.riskLevel === 4" size="small">低风险</el-tag>
        </template>
      </el-table-column>
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
      <el-table-column
        prop="analyzePerson"
        header-align="center"
        align="center"
        label="辨识人">
      </el-table-column>
      <el-table-column
        prop="analyzeDate"
        header-align="center"
        align="center"
        label="辨识时间">
      </el-table-column>
      <el-table-column
        prop="assessPerson"
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
      <el-table-column
        prop="measure"
        header-align="center"
        align="center"
        label="管控措施">
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
      monthlyOff () {
        this.$emit('ctrlMonthlyHide')
      },
      // 获取数据列表
      getDataList (riskLevel, month) {
        this.riskLevel = riskLevel
        this.month = month
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskForMonthCountInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskLevel': riskLevel,
            'month': month,
            'status': 2
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
  .riskBox_Monthly {
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

  .riskBox_Monthly::-webkit-scrollbar {
    width: 0;
  }

  .close_Monthly {
    text-align: right;
    font-size: 20px;
  }

  .riskTitle_Monthly {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
