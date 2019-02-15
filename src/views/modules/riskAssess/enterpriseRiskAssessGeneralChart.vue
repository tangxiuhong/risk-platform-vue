<template>
  <div class="mod-config">
    <span v-html="risks"></span>
    <el-button  type="primary" size="small" @click="getDataList()">刷新</el-button>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="num"
        label="序号"
        width="80">
      <template slot-scope="scope">
       <span v-if="scope.row.num == ''" >{{scope.row.num}}</span>
       <span v-else style="font-weight: bold;">{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="riskUnit"
        label="风险单元"
        width="150">
        <template slot-scope="scope">
       <span v-if="scope.row.riskUnit == '-'" style="color: red">-</span>
       <span v-else style="font-weight: bold">{{scope.row.riskUnit}}</span>
         </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="作业岗位">
        <template slot-scope="scope">
       <span v-if="scope.row.position== '-'" style="color: red">-</span>
       <span v-else >{{scope.row.position}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workplace"
        label="作业地点">
        <template slot-scope="scope">
       <span v-if="scope.row.workplace== '-'" style="color: red">-</span>
       <span v-else >{{scope.row.workplace}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="factorCount"
        label="危害因素统计">
        <template slot-scope="scope">
          <span v-if="scope.row.factorCount== '-'" style="color: red">-</span>
          <span v-else >{{scope.row.factorCount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="">
        <template slot-scope="scope">
          <el-button  type="primary" size="small" @click="viewDetailHandle(scope.row.pointId)">明细</el-button> 
        </template>
      </el-table-column>
    </el-table>
    <factorDetailList v-if="factorDetailVisible" ref="factorDetailList"></factorDetailList>
  </div>
</template>

<script>
  import factorDetailList from './enterpriseRiskAssessGeneralChartDetail'
  export default {
    data () {
      return {
        factorDetailVisible:false,
        risks:"",
        tableData: []
      }
    },
    components: {
      factorDetailList
    },
    activated () {
      this.getDataList()
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (row.colnum === 0) {
          return {
            rowspan: 1,
            colspan: 1
          }
        } else {
          if (columnIndex === 1) {
            return {
              rowspan: 1,
              colspan: row.colnum
            }
          }
        }
      },
      getDataList()
      {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessGeneralChart/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.riskList;
            this.risks = data.page.risks;
          } else {
            this.tableData = [];
            this.risks = "";
          }
        })
      },
      viewDetailHandle(id) {
        this.factorDetailVisible = true
        this.$nextTick(() => {
          this.$refs.factorDetailList.init(id)
        })
      }
    }
  }
</script>
