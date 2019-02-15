<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>
        <el-select v-model="dataForm.assessNo" clearable filterable placeholder="评估编号" @change=assessNoChange()>
          <template v-for="item in assessNoList">
            <el-option :value="item.assessNo" v-bind:key="item.id">{{item.assessNo}}</el-option>
          </template>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-select v-model="dataForm.riskUnit" clearable filterable placeholder="风险单元" @change=riskUnitChange()>
          <template v-for="risks in riskUnitList">
            <el-option :value="risks.riskUnit" v-bind:key="risks.id">{{risks.riskUnit}}</el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.riskpointId" clearable filterable placeholder="风险点">
          <el-option
            v-for="item in riskPointList"
            :key="item.id"
            :label="item.riskPoint"
            :value="item.id">
          </el-option>
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
        label="风险点">
      </el-table-column>

      <el-table-column
        prop="staticLevel"
        header-align="center"
        align="center"
        label="固态风险">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pointAssessLevel === 1" size="small" style="color:red">1级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 2" size="small" style="color:orange">2级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 3" size="small" style="color:yellow">3级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 4" size="small" style="color:blue">4级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="dynamicLevel"
        header-align="center"
        align="center"
        label="风险变化">
      </el-table-column>
      <el-table-column
        prop="pointAssessLevel"
        header-align="center"
        align="center"
        label="综合风险">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pointAssessLevel === 1" size="small" style="color:red">1级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 2" size="small" style="color:orange">2级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 3" size="small" style="color:yellow">3级</el-tag>
          <el-tag v-if="scope.row.pointAssessLevel === 4" size="small" style="color:blue">4级</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="风险点状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small" style="color:blue">受控正常</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small" style="color:red">未受控异常</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small" @click="viewCheckInfo(scope.row.id)">详情
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
  <check-info v-if="checkInfoVisible" ref="checkInfo"></check-info>
  </div>
</template>

<script>
  import checkInfo from './enterpriseRiskAssessRisklocation-checkInfo'
  export default {
    data () {
      return {
        dataForm: {
          riskUnit:'',
          riskpointId:''
        },
        riskUnitList:[],
        riskPointList:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        checkInfoVisible: false
      }
    },
    components: {
      checkInfo
    },
    activated () {
      this.getDataList(),
      this.initAssessUnitList(),
      this.initPointList()
    },
    methods: {
      initAssessUnitList () {
        var assessNo = 'cctk20180917145059'
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessUnit/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams(
            {'assessNo': assessNo}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.list
          }
        })
      },
// 当风险单元改变时
      riskUnitChange() {
        this.dataForm.riskpointId = ''
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/listRiskUnitByRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({'riskUnit': this.dataForm.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.list
          }
        })
      },
      initPointList() {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/listRiskUnitByRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({'riskUnit': this.dataForm.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.list
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/info'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskUnit': this.dataForm.riskUnit,
            'pointId': this.dataForm.riskpointId
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
      viewCheckInfo(e) {
        this.checkInfoVisible = true
        this.$nextTick(() => {
          this.$refs.checkInfo.init(e)
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
      }
    }
  }
</script>
