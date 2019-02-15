<template>
  <div class="videoConfigContent clear">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getConfigDataList()">
        <el-input v-model="dataForm.positionName" style="width:200px;" placeholder="岗位名称" filterable clearable></el-input>
        <el-select v-model="dataForm.riskLevel" placeholder="风险等级" filterable clearable>
          <el-option
            v-for="item in riskLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button @click="getConfigDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateConfigHandle()">新增</el-button>
          <el-button type="danger" @click="deleteConfigHandle()" :disabled="configListSelections.length <= 0">批量删除
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="configDataList"
        border
        v-loading="configDataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="positionName"
          header-align="center"
          align="center"
          width="120"
          label="岗位名称">
        </el-table-column>
        <el-table-column
          prop="workContent"
          header-align="center"
          align="center"
          width="120"
          label="工作内容">
        </el-table-column>
        <el-table-column
          prop="workplace"
          header-align="center"
          align="center"
          width="120"
          label="工作场所">
        </el-table-column>
        <el-table-column
          prop="riskLevel"
          header-align="center"
          align="center"
          width="120"
          label="风险等级">
          <template slot-scope="scope">
            <span v-if="scope.row.riskLevel=== 1" size="small">I级</span>
            <span v-if="scope.row.riskLevel=== 2" size="small">II级</span>
            <span v-if="scope.row.riskLevel=== 3" size="small">III级</span>
            <span v-if="scope.row.riskLevel=== 4" size="small">IV级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="emergencyMeasure"
          header-align="center"
          align="center"
          label="应急措施">
        </el-table-column>
        <el-table-column
          prop="accidentModel"
          header-align="center"
          align="center"
          width="120"
          label="事故模式">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/save')" type="text" size="small"
                       @click="addConfigRelationHandle(scope.row.id)">因素/措施</el-button>
            <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
            <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/update')" type="text" size="small"
                       @click="addOrUpdateConfigHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
            <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/delete')" type="text" size="small"
                       @click="deleteConfigHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="configSizeChangeHandle"
        @current-change="configCurrentChangeHandle"
        :current-page="configPageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="configPageSize"
        :total="configTotalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update-config v-if="addOrUpdateConfigVisible" ref="addOrUpdateConfig"
                            @refreshDataList="getConfigDataList"></add-or-update-config>
    <!-- 弹窗, 因素/管控 -->
     <config-relation v-if="configRelationVisible" ref="configRelation"
                          @refreshDataList="getConfigDataList"></config-relation>
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getConfigDataList"></look>
  </div>
</template>

<script>
  import ConfigRelation from './enterpriseRiskCardConfigRelation'
  import AddOrUpdateConfig from './enterpriseRiskCardConfig-add-or-update'
  import AddOrUpdateInfo from './enterpriseRiskCardConfigRelation-add-or-update'
  import Look from './enterpriseRiskCardConfig-look'

  export default {
    data () {
      return {
        dataForm: {
          positionName: '',
          riskLevel: ''
        },
        configDataList: [],
        configPageIndex: 1,
        configPageSize: 10,
        configTotalPage: 0,
        riskLevelOptions: [
          {label: 'I级', value: 1},
          {label: 'II级', value: 2},
          {label: 'III级', value: 3},
          {label: 'IV级', value: 4}
        ],
        configDataListLoading: false,
        infoDataListLoading: false,
        addOrUpdateConfigVisible: false,
        configRelationVisible: false,
        lookVisible: false,
        configListSelections: []
      }
    },
    components: {
      AddOrUpdateConfig,
      AddOrUpdateInfo,
      ConfigRelation,
      Look
    },
    mounted () {
      this.getConfigDataList()
    },
    methods: {
      // 获取数据列表
      getConfigDataList () {
        this.configDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseRiskCardConfig/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.configPageIndex,
            'limit': this.configPageSize,
            'positionName': this.dataForm.positionName,
            'riskLevel': this.dataForm.riskLevel
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.configDataList = data.page.list
            this.configTotalPage = data.page.totalCount
          } else {
            this.configDataList = []
            this.configTotalPage = 0
          }
          this.configDataListLoading = false
        })
      },
      // 每页数
      configSizeChangeHandle (val) {
        this.configPageSize = val
        this.configPageIndex = 1
        this.getConfigDataList()
      },
      // 当前页
      configCurrentChangeHandle (val) {
        this.configPageIndex = val
        this.getConfigDataList()
      },
      // 添加、修改
      addOrUpdateConfigHandle (id) {
        this.addOrUpdateConfigVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateConfig.init(id)
        })
      },
      addConfigRelationHandle (id) {
        this.configRelationVisible = true
        this.$nextTick(() => {
          this.$refs.configRelation.init(id)
        })
      },
      // 查看
      lookHandle (id) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(id)
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.configListSelections = val
      },
      // 删除
      deleteConfigHandle (id) {
        var ids = id ? [id] : this.configListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对选中数据进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/enterpriseRiskCardConfig/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getConfigDataList()
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
<style>

</style>
