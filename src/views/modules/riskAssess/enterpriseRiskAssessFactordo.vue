<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="类型：">
              <span>{{ props.row.factorType }}</span>
            </el-form-item>
            <el-form-item label="事故伤害类型：">
              <span>{{ props.row.riskType }}</span>
            </el-form-item>
            <el-form-item label="风险地点及部位：">
              <span>{{ props.row.riskResult }}</span>
            </el-form-item>
            <el-form-item label="发生的可能性：">
              <span>{{ props.row.riskProbability }}</span>
            </el-form-item>
            <el-form-item label="事故后果：">
              <span>{{ props.row.riskSeverity }}</span>
            </el-form-item>
            <el-form-item label="暴露的频繁程度：">
              <span>{{ props.row.riskDegree }}</span>
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

      <!-- <el-table-column
         prop="assessNo"
         header-align="center"
         align="center"
         label="评估编号">
       </el-table-column>-->
      <el-table-column
        prop="doId"
        header-align="center"
        align="center"
        label="编号">
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
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险点级别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.riskLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.riskLevel === 4" size="small">4级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="riskFactor"
        header-align="center"
        align="center"
        label="危害因素">
      </el-table-column>
      

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessFactordo/listFactordo')" type="text"
                     size="small" @click="updateHandle(scope.row.id)">管控措施
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
    <pointDetailList v-if="pointDetailVisible" ref="pointDetailList" @refreshDataList="getDataList"></pointDetailList>
  </div>
</template>

<script>
  import pointDetailList from './enterpriseRiskAssessFactordo-list'

  export default {
    data() {
      return {
        riskUnitList: [],
        riskPointList: [],
        dataForm: {
          riskUnit: '',
          riskpointId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        pointDetailVisible: false
      }
    },
    components: {
      pointDetailList
    },
    activated() {
      this.getDataList(),
        this.initAssessUnitList(),
        this.initPointList()
    },
    methods: {
      initAssessUnitList() {
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
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessFactordo/list'),
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
      updateHandle(id) {
        this.pointDetailVisible = true
        this.$nextTick(() => {
          this.$refs.pointDetailList.init(id)
        })
      }
    }
  }
</script>
