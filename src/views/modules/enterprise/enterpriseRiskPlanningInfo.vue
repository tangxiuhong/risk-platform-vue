<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        show-overflow-tooltip
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="fileGroup"
        header-align="center"
        align="center"
        label="文件类型">
        <template slot-scope="scope">
          <span v-if="scope.row.fileGroup=== 1">管控措施</span>
          <span v-else-if="scope.row.fileGroup === 2">分级管控制度</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="planName"
        header-align="center"
        align="center"
        label="管控措施名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="description"
        header-align="center"
        align="center"
        label="简介">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="memo"
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
          url: this.$http.adornUrl('/enterprise/enterpriseRiskPlanning/list'),
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
