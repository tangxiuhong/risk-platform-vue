<template>
  <div class="riskBox">
    <div class="close"><i class="el-icon-close" @click="riskNameOff"></i></div>
    <div class="riskTitle">
      <span v-if="controled==1">风险受控数量：{{num}}</span>
      <span v-else>风险数量：{{num}}</span>
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="危险有害因素：">
              <span>{{ props.row.riskName }}</span>
            </el-form-item>
            <el-form-item label="地点及部位：">
              <span>{{ props.row.riskResult }}</span>
            </el-form-item>
            <el-form-item label="发生的可能性：">
              <span>{{ props.row.riskProbability }}</span>
            </el-form-item>
            <el-form-item label="暴露的频繁程度：">
              <span>{{ props.row.riskDegree }}</span>
            </el-form-item>
            <el-form-item label="后果严重性：">
              <span>{{ props.row.riskSeverity }}</span>
            </el-form-item>
            <el-form-item label="风险值：">
              <span>{{ props.row.riskValue }}</span>
            </el-form-item>
            <el-form-item label="责任部门：">
              <span>{{ props.row.departmentName }}</span>
            </el-form-item>
            <el-form-item label="责任人：">
              <span>{{ props.row.personName }}</span>
            </el-form-item>
            <el-form-item label="辨识人：">
              <span>{{ props.row.analyzePersonName }}</span>
            </el-form-item>
            <el-form-item label="辨识时间：">
              <span>{{ props.row.analyzeDate }}</span>
            </el-form-item>
            <el-form-item label="评估人：">
              <span>{{ props.row.assessPersonName }}</span>
            </el-form-item>
            <el-form-item label="评估时间：">
              <span>{{ props.row.assessDate }}</span>
            </el-form-item>
          </el-form>
        </template>
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
        prop="riskType"
        header-align="center"
        align="center"
        label="事故/伤害类型">
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
        prop="status"
        header-align="center"
        align="center"
        label="记录状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">辨识</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small">评估</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkPeriod"
        header-align="center"
        align="center"
        label="检查周期">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkPeriod === 1" size="small">周检</el-tag>
          <el-tag v-if="scope.row.checkPeriod === 2" size="small">月检</el-tag>
          <el-tag v-if="scope.row.checkPeriod === 3" size="small">季检</el-tag>
          <el-tag v-if="scope.row.checkPeriod === 4" size="small">年检</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="controled"
        header-align="center"
        align="center"
        label="是否受控">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.controled === 0" size="small">不受控</el-tag>
          <el-tag v-if="scope.row.controled === 1" size="small">受控</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="updateControledTime"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="变更受控标志时间">-->
      <!--</el-table-column>-->
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
        controled: '',
        num: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    methods: {
      activated () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList (num, controled) {
        this.controled = controled
        this.num = num
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/riskAssessInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'controled': this.controled
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
        this.getDataList(this.num, this.controled)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.num, this.controled)
      },
      // 关闭dialog
      riskNameOff () {
        this.$emit('riskNameInfoHide')
      }
    }
  }
</script>

