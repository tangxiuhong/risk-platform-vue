<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="管控措施：">
              <span>{{ props.row.measures }}</span>
            </el-form-item>
            <el-form-item label="处置措施：">
              <span>{{ props.row.emergencyMeasures }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="riskGroupName"
        header-align="center"
        align="center"
        label="风险类型">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="riskPosition"
        header-align="center"
        align="center"
        label="环节或部位">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="riskResult"
        header-align="center"
        align="center"
        label="导致后果">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险等级">
        <template slot-scope="scope">
          <span v-if="scope.row.riskLevel=== 1">重大风险</span>
          <span v-else-if="scope.row.riskLevel === 2">较大风险</span>
          <span v-else-if="scope.row.riskLevel === 3">一般风险</span>
          <span v-else-if="scope.row.riskLevel === 4">低风险</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="department"
        header-align="center"
        align="center"
        label="责任部门">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
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
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        options: [],
        addOrUpdateVisible: false,
        detailVisible: false,
        dataRule: {}
      }
    },
    methods: {
      // 获取数据列表
      init (id) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseRiskNotice/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': id
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.list
          } else {
            this.options = []
          }
        })
      }
    }
  }
</script>
