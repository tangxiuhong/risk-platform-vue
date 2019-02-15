<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-input v-model="dataForm.riskPosition" style="width:200px;" placeholder="环节或岗位" filterable clearable></el-input>
      <el-select v-model="dataForm.riskLevel" placeholder="风险等级" filterable clearable>
        <el-option
          v-for="item in riskLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/save')" type="primary" @click="addOrUpdateHandle()">
          新增
        </el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/createQR')" type="primary" @click="createQR()"
                   :disabled="dataListSelections.length <= 0">生成二维码
        </el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/export')" type="primary" @click="export2Excel()">
          导出
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
        prop="riskPosition"
        header-align="center"
        align="center"
        label="环节或岗位"
        width="70">
      </el-table-column>
      <el-table-column
        prop="riskFactor"
        header-align="center"
        align="center"
        label="危险有害因素"
        width="80">
      </el-table-column>
      <el-table-column
        prop="riskGroup"
        header-align="center"
        align="center"
        label="事故类型"
        width="70">
      </el-table-column>
      <el-table-column
        prop="riskResult"
        header-align="center"
        align="center"
        label="后果"
        width="50">
      </el-table-column>
      <el-table-column
        prop="influenceArea"
        header-align="center"
        align="center"
        label="影响范围"
        width="50">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        header-align="center"
        align="center"
        label="风险等级"
        width="50">
      </el-table-column>
      <el-table-column
        prop="measures"
        header-align="center"
        align="center"
        label="管控措施">
      </el-table-column>
      <el-table-column
        prop="emergencyMeasures"
        header-align="center"
        align="center"
        label="应急措施"
        width="200">
      </el-table-column>
      <el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="责任人"
        width="50">
      </el-table-column>
      <el-table-column
        prop="validity"
        header-align="center"
        align="center"
        label="有效期"
        width="50">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="报告电话"
        width="50">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
      <!--    <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>-->
          <el-button v-if="isAuth('enterprise/enterpriseRiskNotice/delete')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getDataList"></look>
  </div>
</template>

<script>
  import AddOrUpdate from './enterpriseRiskNotice-add-or-update'
  import Look from './enterpriseRiskNotice-look'

  export default {
    data () {
      return {
        dataForm: {
          riskPosition: '',
          riskLevel: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        riskLevelOptions: [
          {label: 'I级', value: 1},
          {label: 'II级', value: 2},
          {label: 'III级', value: 3},
          {label: 'IV级', value: 4}
        ],
        dataListLoading: false,
        dataListSelections: [],
        options: [],
        addOrUpdateVisible: false,
        detailVisible: false,
        lookVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Look
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseRiskNotice/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskPosition': this.dataForm.riskPosition,
            'riskLevel': this.dataForm.riskLevel
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
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 查看
      lookHandle (id) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(id)
        })
      },
      // 生成二维码
      createQR (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行['生成二维码']操作`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/enterpriseRiskNotice/createQR'),
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
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/enterpriseRiskNotice/delete'),
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
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.list
          } else {
            this.options = []
          }
        })
      },
      // 导出
      export2Excel () {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../../excel/Export2Excel')
          const tHeader = ['环节或岗位', '危险有害因素', '事故类型', '后果', '影响范围', '风险等级', '管控措施', '应急措施', '责任人', '有效期', '报告电话']
          const filterVal = ['riskPosition', 'riskFactor', 'riskGroup', 'riskResult', 'influenceArea', 'riskLevel', 'measures', 'emergencyMeasures', 'person', 'vilidity', 'phone']
          const list = this.dataList
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '企业重大风险公告')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }
  }
</script>
