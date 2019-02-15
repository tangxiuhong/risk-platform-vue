<template>
  <div class="riskBox_riskBar">
    <div class="close_riskBar"><i class="el-icon-close" @click="riskBarOff"></i></div>
    <div class="riskTitle_riskBar">信息：</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
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
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="riskFactor"
        header-align="center"
        align="center"
        v-if="pointType==0"
        label="危害因素">
      </el-table-column>
      <el-table-column
        prop="riskDo"
        header-align="center"
        align="center"
        v-if="pointType==0"
        label="管控措施">
      </el-table-column>
      <el-table-column
        prop="isMeasuresEffective"
        header-align="center"
        v-if="pointType==0"
        align="center"
        label="是否有效">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isMeasuresEffective === 0" size="small">有效</el-tag>
          <el-tag v-if="scope.row.isMeasuresEffective === 1" size="small">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="troubleNum"
        header-align="center"
        align="center"
        v-if="pointType==1"
        label="隐患编号">
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
        riskLevel: '',
        month: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pointType: '',
        riskUnit: '',
        pointName: '',
        dataListLoading: false
      }
    },
    methods: {
      // 关闭dialog
      riskBarOff () {
        this.$emit('barInfoHide')
      },
      // 获取数据列表
      getDataList (riskUnit, pointName, pointType) {
        this.pointType = pointType
        this.riskUnit = riskUnit
        this.pointName = pointName
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskForBarInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'unitId': riskUnit,
            'pointName': pointName,
            'pointType': pointType
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
        this.getDataList(this.riskUnit, this.pointName, this.pointType)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.riskUnit, this.pointName, this.pointType)
      }
    }
  }
</script>

<style scoped>
  .riskBox_riskBar {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 9999;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .riskBox_riskBar::-webkit-scrollbar {
    width: 0;
  }

  .close_riskBar {
    text-align: right;
    font-size: 20px;
    cursor: pointer;
  }

  .riskTitle_riskBar {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
