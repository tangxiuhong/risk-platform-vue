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
         <el-input v-model="dataForm.checkMan" placeholder="检查人"></el-input> 
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessStepctrl/save')" type="primary" @click="addStepCtrlByOneHandle()">新增</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessStepctrl/save')" type="primary" @click="addStepCtrlHandle()">批量新增</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessStepctrl/delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
      <!--<el-table-column
        prop="assessNo"
        header-align="center"
        align="center"
        label="评估编号">
      </el-table-column>-->
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
        prop="departmentName"
        header-align="center"
        align="center"
        label="检查部门">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="检查人">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="检查类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkType === 1" size="small">按月检查</el-tag>
          <el-tag v-if="scope.row.checkType === 2" size="small">按两周检查</el-tag>
          <el-tag v-if="scope.row.checkType === 3" size="small">按一周检查</el-tag>
          <el-tag v-if="scope.row.checkType === 4" size="small">按天检查</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="checks"
        header-align="center"
        align="center"
        label="检查次数">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
            <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessStepctrl/update')" type="text" size="small" @click="updateStepCtrlHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
            <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessStepctrl/delete')" type="text" size="small" @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
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
  
    <add-step v-if="addStepCtrlVisible" ref="addStepCtrl" @refreshDataList="getDataList"></add-step>
    <update-step v-if="updateStepCtrlVisible" ref="updateStepCtrl" @refreshDataList="getDataList"></update-step>
  </div>
</template>

<script>
  import AddStep from './enterpriseRiskAssessStepctrl-add'
  import UpdateStep from './enterpriseRiskAssessStepctrl-update'

  export default {
    data () {
      return {
        riskUnitList: [],
        riskPointList: [],
        dataForm: {
          riskUnit: '',
          riskpointId: '',
          checkMan:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],

        addStepCtrlVisible: false,
        updateStepCtrlVisible: false
      }
    },
    components: {
     AddStep,UpdateStep
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
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessStepctrl/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskUnit': this.dataForm.riskUnit,
            'pointId': this.dataForm.riskpointId,
            'name': this.dataForm.checkMan
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
      // 新增
      addStepCtrlByOneHandle()
      {
        this.updateStepCtrlVisible = true
        this.$nextTick(() => {
          this.$refs.updateStepCtrl.init()
        })
      },
      // 批量新增 
      addStepCtrlHandle () {
        this.addStepCtrlVisible = true
        this.$nextTick(() => {
          this.$refs.addStepCtrl.init()
        })
      },
      //  修改
      updateStepCtrlHandle (id) {
        this.updateStepCtrlVisible = true
        this.$nextTick(() => {
          this.$refs.updateStepCtrl.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessStepctrl/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
