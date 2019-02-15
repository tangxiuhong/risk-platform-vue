<template>
  <div class="riskBox">
    <div class="close"><i class="el-icon-close" @click="troubleOff"></i></div>
    <div class="riskTitle">隐患总数详情：{{num}}</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="planNo"
        header-align="center"
        align="center"
        label="安全检查编号">
      </el-table-column>
      <el-table-column
        prop="troubleNum"
        header-align="center"
        align="center"
        label="隐患编号">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="安全检查类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkType=== 1" size="small">安全综合检查</el-tag>
          <el-tag v-else-if="scope.row.checkType === 2" size="small">专业安全检查</el-tag>
          <el-tag v-else-if="scope.row.checkType=== 3" size="small">专项安全检查</el-tag>
          <el-tag v-else-if="scope.row.checkType === 4" size="small">日常检查</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        label="责任单位">
      </el-table-column>
      <el-table-column
        prop="troubleDescription"
        header-align="center"
        align="center"
        label="隐患问题">
      </el-table-column>
      <el-table-column
        prop="troubleType"
        header-align="center"
        align="center"
        label="隐患分级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.troubleType === 1" size="small">一般隐患</el-tag>
          <el-tag v-if="scope.row.troubleType === 2" size="small">重大隐患</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkDepartment"
        header-align="center"
        align="center"
        label="检查单位">
      </el-table-column>
      <el-table-column
        prop="checkMan"
        header-align="center"
        align="center"
        label="检查人">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="检查类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkType === 1" size="small">安全综合检查</el-tag>
          <el-tag v-if="scope.row.checkType === 2" size="small">安全专业检查</el-tag>
          <el-tag v-if="scope.row.checkType === 3" size="small">专项安全检查</el-tag>
          <el-tag v-if="scope.row.checkType === 4" size="small">日常检查</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeAffirm"
        header-align="center"
        align="center"
        label="责任人确认接受隐患截至时间">
      </el-table-column>
      <el-table-column
        prop="memo"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="隐患状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">保存</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">待整改</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small">待验收</el-tag>
          <el-tag v-if="scope.row.status === 3" size="small">整改完成</el-tag>
        </template>
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
        num: '',
        dataForm: {},
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
      getDataList (num) {
        this.num = num
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'rectifyStatus': 3
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
        this.getDataList(this.num)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.num)
      },
      // 关闭dialog
      troubleOff () {
        this.$emit('troubleHide')
      }
    }
  }
</script>


