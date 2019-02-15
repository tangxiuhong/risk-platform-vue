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
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPoint/save')" type="primary" @click="addHandle()">新增
        </el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPoint/delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
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
     <!--
      <el-table-column
        prop="assessLevel"
        header-align="center"
        align="center"
        label="风险点风险等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assessLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 4" size="small">4级</el-tag>
        </template>
      </el-table-column>
  -->
      <el-table-column
        prop="staticLevel"
        header-align="center"
        align="center"
        label="固有风险等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.staticLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.staticLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.staticLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.staticLevel === 4" size="small">4级</el-tag>
        </template>
      </el-table-column>
<!--
      <el-table-column
        prop="dynamicLevel"
        header-align="center"
        align="center"
        label="检查风险">
      </el-table-column>
-->
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="受控状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">受控</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small">不受控</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPoint/update')" type="text" size="small"
                     @click="addHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPoint/delete')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i>
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
    <pointAdd v-if="addVisible" ref="pointAdd" @refreshDataList="getDataList"></pointAdd>
    <pointUpdate v-if="updateVisible" ref="pointUpdate" @refreshDataList="getDataList"></pointUpdate>
    <pointModify v-if="modifyVisible" ref="pointModify" @refreshDataList="getDataList"></pointModify>
  </div>
</template>

<script>
  import pointAdd from './enterpriseRiskAssessPoint-add'
  import pointUpdate from './enterpriseRiskAssessPoint-update'
  import pointModify from './enterpriseRiskAssessPoint-modify'

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
        addVisible: false,
        updateVisible: false,
        modifyVisible: false
      }
    },
    components: {
      pointAdd, pointUpdate, pointModify
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
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessPoint/list'),
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
      // 新增 / 修改
      addHandle(id) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.pointAdd.init(id)
        })
      },
      updateHandle(id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.pointUpdate.init(id)
        })
      },
      modifyHandle(id) {
        this.modifyVisible = true
        this.$nextTick(() => {
          this.$refs.pointModify.init(id)
        })
      },
      // 删除
      deleteHandle(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessPoint/delete'),
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

