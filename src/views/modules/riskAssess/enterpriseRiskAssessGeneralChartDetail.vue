<template>
  <el-dialog
    :title="!pointId ? '危害因素' : '危害因素'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="80%">
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
        prop="riskFactor"
        label="危害因素"
        width="150">
        <template slot-scope="scope">
       <span v-if="scope.row.riskFactor == '-'" style="color: red">-</span>
       <span v-else style="font-weight: bold">{{scope.row.riskFactor}}</span>
         </template>
      </el-table-column>
      <el-table-column
        prop="riskType"
        label="危害类型"
        width="300">
        <template slot-scope="scope">
       <span v-if="scope.row.riskType== '-'" style="color: red">-</span>
       <span v-else >{{scope.row.riskType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="staticLevel"
        label="风险级别"
        width="60">
        <template slot-scope="scope">
       <span v-if="scope.row.staticLevel== '-'" style="color: red">-</span>
       <span v-else >{{scope.row.staticLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="riskDo"
        label="管控措施">
        <template slot-scope="scope">
       <span v-if="scope.row.riskDo== '-'" style="color: red">-</span>
       <span v-else >{{scope.row.riskDo}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible:false,
        pointId:"",
        tableData: []
      }
    },
    components: {
    },
    
    methods: {
      init(pId)
      {
        this.visible = true;
        this.pointId = pId;
        this.$nextTick(() => {
          this.getDataList();
        })     
      },
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
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessGeneralChart/listDetail'),
          method: 'get',
          params: this.$http.adornParams({'pointId':this.pointId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page;
          } else {
            this.tableData = [];
          }
        })
      }
    }
  }
</script>
