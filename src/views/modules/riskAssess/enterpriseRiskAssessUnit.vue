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
        <el-select v-model="dataForm.riskUnit" clearable placeholder="风险单元">
          <template v-for="risks in riskUnitList">
            <el-option :value="risks.riskUnit" v-bind:key="risks.id">{{risks.riskUnit}}</el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessUnit/save')" type="primary" @click="addHandle()">新增
        </el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessUnit/delete')" type="danger" @click="deleteHandle()"
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

    <!--  <el-table-column
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
        prop="assessLevel"
        header-align="center"
        align="center"
        label="风险等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assessLevel === 1" size="small">1级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 2" size="small">2级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 3" size="small">3级</el-tag>
          <el-tag v-if="scope.row.assessLevel === 4" size="small">4级</el-tag>
        </template>
      </el-table-column>


      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessUnit/modify')" type="text" size="small"
                     @click="modifyHandle(scope.row.id)">辨识
          </el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessUnit/update')" type="text" size="small"
                     @click="updateHandle(scope.row.id)">评估
          </el-button>
          <!--
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessUnit/delete')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)">删除
          </el-button> -->
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
    <unitAdd v-if="addVisible" ref="unitAdd" @refreshDataList="getDataList"></unitAdd>
    <unitUpdate v-if="updateVisible" ref="unitUpdate" @refreshDataList="getDataList"></unitUpdate>
    <unitModify v-if="modifyVisible" ref="unitModify" @refreshDataList="getDataList"></unitModify>
  </div>
</template>

<script>
  import unitAdd from './enterpriseRiskAssessUnit-add'
  import unitUpdate from './enterpriseRiskAssessUnit-update'
  import unitModify from './enterpriseRiskAssessUnit-modify'

  export default {
    data() {
      return {
        riskUnitList: [],
        dataForm: {
          riskUnit: ''
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
      unitAdd, unitUpdate, unitModify
    },
    activated() {
      this.getDataList(),
        this.initAssessUnitList()
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
            this.riskUnitList = data.list;
          }
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessUnit/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
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
          this.$refs.unitAdd.init(id)
        })
      },
      updateHandle(id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.unitUpdate.init(id)
        })
      },
      modifyHandle(id) {
        this.modifyVisible = true
        this.$nextTick(() => {
          this.$refs.unitModify.init(id)
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
            url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessUnit/delete'),
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
