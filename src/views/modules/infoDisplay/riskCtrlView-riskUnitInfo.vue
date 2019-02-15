<template>
  <div class="riskBox_riskUnit">
    <div class="close_riskUnit"><i class="el-icon-close" @click="riskUnitOff"></i></div>
    <div class="riskTitle_riskUnit">风险单元信息：</div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-select v-model="dataForm.assessNo" clearable filterable placeholder="评估编号" @change=assessNoChange()>
            <template v-for="item in assessNoList">
              <el-option :value="item.assessNo" v-bind:key="item.id">{{item.assessNo}}</el-option>
            </template>
          </el-select>
          <el-select v-model="dataForm.riskUnit" clearable placeholder="风险单元">
            <template v-for="risks in riskUnitList">
              <el-option :value="risks.riskUnit" v-bind:key="risks.id">{{risks.riskUnit}}</el-option>
            </template>
          </el-select>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
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
          prop="listPersonName"
          header-align="center"
          align="center"
          label="单元确认人">
        </el-table-column>
        <el-table-column
          prop="listDate"
          header-align="center"
          align="center"
          label="单元确认时间">
        </el-table-column>
        <el-table-column
          prop="assessValue"
          header-align="center"
          align="center"
          label="评估结果值">
        </el-table-column>
        <el-table-column
          prop="assessLevel"
          header-align="center"
          align="center"
          label="评估结果等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.assessLevel === 1" size="small">1级</el-tag>
            <el-tag v-if="scope.row.assessLevel === 2" size="small">2级</el-tag>
            <el-tag v-if="scope.row.assessLevel === 3" size="small">3级</el-tag>
            <el-tag v-if="scope.row.assessLevel === 4" size="small">4级</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="assessPersonName"
          header-align="center"
          align="center"
          label="评估人">
        </el-table-column>
        <el-table-column
          prop="assessDate"
          header-align="center"
          align="center"
          label="评估时间">
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
      }
    },
    methods: {
      // 关闭dialog
      riskUnitOff () {
        this.$emit('unitInfoHide')
      },
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
        this.initAssessNoList()
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessUnit/list'),
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
      }
    }
  }
</script>

<style scoped>
  .riskBox_riskUnit {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1999;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .riskBox_riskUnit::-webkit-scrollbar {
    width: 0;
  }

  .close_riskUnit {
    text-align: right;
    font-size: 20px;
    cursor: pointer;
  }

  .riskTitle_riskUnit {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
