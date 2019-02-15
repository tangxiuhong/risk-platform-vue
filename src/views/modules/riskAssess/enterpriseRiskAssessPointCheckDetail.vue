<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.assessNo" clearable placeholder="评估编号" @change=assessNoChange()>
          <template v-for="item in assessNoList">
            <el-option :value="item.assessNo" v-bind:key="item.id">{{item.assessNo}}</el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.riskUnit" clearable placeholder="风险单元">
          <template v-for="risks in riskUnitList">
            <el-option :value="risks.riskUnit" v-bind:key="risks.id">{{risks.riskUnit}}</el-option>
          </template>
        </el-select>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>

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
          <el-tag v-if="scope.row.riskLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 4" size="small">4级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="controled"
        header-align="center"
        align="center"
        label="风险检查">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.controled === 0" size="small">未检查</el-tag>
          <el-tag v-if="scope.row.controled === 1" size="small">已检查</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewHandle(scope.row.id)">查看</el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPointCheckDetail/listPointCheckDetail')" type="text"
                     size="small" @click="updateHandle(scope.row.id)">检查
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
    <viewDetail v-if="viewDetailVisible" ref="viewDetail" @refreshDataList="getDataList"></viewDetail>
    <pointCheckDetailList v-if="pointCheckDetailVisible" ref="pointCheckDetailList"
                          @refreshDataList="getDataList"></pointCheckDetailList>
  </div>
</template>

<script>
  import pointCheckDetailList from './enterpriseRiskAssessPointCheckDetail-list'
  import viewDetail from './enterpriseRiskAssessPointCheckDetail-view'

  export default {
    data () {
      return {
        assessNoList: [],
        riskUnitList: [],
        dataForm: {
          assessNo: '',
          riskUnit: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        pointCheckDetailVisible: false,
        viewDetailVisible: false
      }
    },
    components: {
      pointCheckDetailList, viewDetail
    },
    activated () {
      this.getDataList(),
        this.initAssessNoList()
    },
    methods: {
      initAssessNoList () {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listAssessNo`),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.assessNoList = data.list;
          }
        })
      },

      assessNoChange () {
        var assessNo = this.dataForm.assessNo;
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessUnit/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams(
            {'assessNo': assessNo}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.list;
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessPointCheckDetail/list'),
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
      // 查看
      viewHandle (id) {
        this.viewDetailVisible = true;
        this.$nextTick(() => {
          this.$refs.viewDetail.init(id, this.pointId);
        })
      },

      updateHandle (id) {
        this.pointCheckDetailVisible = true
        this.$nextTick(() => {
          this.$refs.pointCheckDetailList.init(id)
        })
      },

    }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    min-width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
