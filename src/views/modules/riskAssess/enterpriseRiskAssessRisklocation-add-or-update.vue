<template>
  <el-dialog
    :title="this.id?'详情':'详情'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <h4>相关检查信息</h4>
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
        prop="parameter1"
        header-align="center"
        align="center"
        label="风险值">
      </el-table-column>
      <el-table-column
        prop="parameter2"
        header-align="center"
        align="center"
        label="风险等级">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="personName"
        header-align="center"
        align="center"
        label="检查人">
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
    <h4>相关隐患信息</h4>
    <el-table
      :data="troubleDataList"
      border
      v-loading="troubleDataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="troubleNum"
        header-align="center"
        align="center"
        label="隐患编号">
      </el-table-column>
      <el-table-column
        prop="troublePosition"
        header-align="center"
        align="center"
        label="隐患位置">
      </el-table-column>
      <el-table-column
        prop="troubleDescription"
        header-align="center"
        align="center"
        label="隐患描述">
      </el-table-column>
      <el-table-column
        prop="troubleType"
        header-align="center"
        align="center"
        label="隐患类型">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="登记时间">
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
      </el-table>
    <el-pagination
      @size-change="troubleSizeChangeHandle"
      @current-change="troubleCurrentChangeHandle"
      :current-page="troublePageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="troublePageSize"
      :total="troubleTotalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>


    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
 
  
  export default {
    data () {
      return {
        visible: false,
        id:'',

        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,

        troubleDataList:[],
        troublePageIndex:0,
        troublePageSize:0,
        troubleTotalPage:0,
        troubleDataListLoading:false

      }
    },
    methods: {
      init (pid) {
        this.id = pid || 0
        this.visible = true
        this.$nextTick(() => {
          this.getDataList();
          this.getTroubleDataList();
        })
      },

      getDataList()
      {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/listPointChecks'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'pointId': this.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList =   data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            //this.totalPage = 0
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

      getTroubleDataList()
      {
        this.troubleDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/listPointTroubles'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.troublePageIndex,
            'limit': this.troublePageSize,
            'pointId': this.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleDataList = data.page.list
            this.troubleTotalPage = data.page.totalCount
          } else {
            this.troubleDataList = []
            this.troubleTotalPage = 0
          }
          this.troubleDataListLoading = false
        })
      },
 // 每页数
      troubleSizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      troubleCurrentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }

    }
  }
</script>
