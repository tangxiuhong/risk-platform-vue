<template>
  <div class="mod-config">
  <!--  <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.assessNo" clearable filterable placeholder="评估编号">
          <template v-for="item in assessNoList">
            <el-option :value="item.assessNo" v-bind:key="item.id">{{item.assessNo}}</el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessResult/save')" type="primary" @click="addHandle()">
          新增评估编号
        </el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessResult/delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>-->
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
        prop="assessNo"
        header-align="center"
        align="center"
        label="评估编号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="memo"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="assessValue"
        header-align="center"
        align="center"
        label="风险评估结果值">
      </el-table-column>
      <el-table-column
        prop="assessLevel"
        header-align="center"
        align="center"
        label="风险评估结果等级">
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
        prop="createTime"
        header-align="center"
        align="center"
        label="记录创建时间">
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="记录创建者">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessResult/modify')" type="text" size="small"
                     @click="modifyHandle(scope.row.id)">修改
          </el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessResult/update')" type="text" size="small"
                     @click="updateHandle(scope.row.id)">评估
          </el-button>
          <!--<el-button v-if="isAuth('riskAssess/enterpriseRiskAssessResult/delete')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)">删除
          </el-button>-->
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
    <ResultAdd v-if="addVisible" ref="ResultAdd" @refreshDataList="getDataList"></ResultAdd>
    <ResultModify v-if="modifyVisible" ref="ResultModify" @refreshDataList="getDataList"></ResultModify>
    <ResultUpdate v-if="updateVisible" ref="ResultUpdate" @refreshDataList="getDataList"></ResultUpdate>

  </div>
</template>

<script>
  import ResultAdd from './enterpriseRiskAssessResult-add'
  import ResultUpdate from './enterpriseRiskAssessResult-update'
  import ResultModify from './enterpriseRiskAssessResult-modify'

  export default {
    data () {
      return {
        dataForm: {
          key: ''
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
      ResultAdd, ResultUpdate, ResultModify
    },

    activated () {
      this.getDataList()
    },

    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessResult/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
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
      // 新增 / 修改
      addHandle (id) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.ResultAdd.init(id)
        })
      },
      // 新增 / 修改
      updateHandle (id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.ResultUpdate.init(id)
        })
      },
      // 新增 / 修改
      modifyHandle (id) {
        this.modifyVisible = true
        this.$nextTick(() => {
          this.$refs.ResultModify.init(id)
        })
      }
    }
  }
</script>
