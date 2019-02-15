<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--
      <el-form-item>
        <el-input v-model="dataForm.assessNo" placeholder="评估编号" clearable></el-input>
      </el-form-item>
      -->
      <el-form-item>
        <el-input v-model="dataForm.riskUnit" placeholder="风险单元" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
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
        label="风险点名称">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="风险点状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">正常</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="检查类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkType === 1" size="small">月</el-tag>
          <el-tag v-if="scope.row.checkType === 2" size="small">两周</el-tag>
          <el-tag v-if="scope.row.checkType === 3" size="small">一周</el-tag>
          <el-tag v-if="scope.row.checkType === 4" size="small">按天</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessCheck/check')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.pointId)">检查
          </el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessCheck/detail')" type="text" size="small"
                     @click="detailHandle(scope.row)">详情
          </el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <CheckInfo v-if="detailVisible" ref="CheckInfo"></CheckInfo>
  </div>
</template>

<script>
  import AddOrUpdate from './enterpriseRiskAssessPointCheck-add-or-update'
  import detail from './enterpriseRiskAssessPointCheck-detail'
  import CheckInfo from './enterpriseRiskAssessPointCheck-checkInfo'


  export default {
    data() {
      return {
        dataForm: {
          assessNo: 'cctk20180917145059',
          riskUnit: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        detailVisible: false
      }
    },
    components: {
      AddOrUpdate,
      CheckInfo
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        var assessNo = 'cctk20180917145059'
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessCheck/listPointCheck'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'assessNo': this.dataForm.assessNo,
            'riskUnit': this.dataForm.riskUnit
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
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 检查
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 详情
      detailHandle (row) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.CheckInfo.init(row.pointId)
        })
      }
    }
  }
</script>
