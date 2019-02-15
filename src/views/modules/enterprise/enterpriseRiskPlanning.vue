<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-select v-model="dataForm.id" filterable placeholder="所属企业" clearable @focus="getEnterpriseTree()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskPlanning/save')" type="primary" @click="addOrUpdateHandle()">
          新增
        </el-button>
        <el-button v-if="isAuth('enterprise/enterpriseRiskPlanning/delete')" type="danger" @click="deleteHandle()"
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
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="fileGroup"
        header-align="center"
        align="center"
        label="文件类型">
        <template slot-scope="scope">
          <span v-if="scope.row.fileGroup=== 1">管控措施</span>
          <span v-else-if="scope.row.fileGroup === 2">分级管控制度</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="planName"
        header-align="center"
        align="center"
        label="管控措施名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="description"
        header-align="center"
        align="center"
        label="简介">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="memo"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('enterprise/enterpriseRiskPlanning/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('enterprise/enterpriseRiskPlanning/delete')" type="text" size="small"
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
  import AddOrUpdate from './enterpriseRiskPlanning-add-or-update'
  import Look from './enterpriseRiskPlanning-look'

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
          url: this.$http.adornUrl('/enterprise/enterpriseRiskPlanning/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': this.dataForm.id,
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
            url: this.$http.adornUrl('/enterprise/enterpriseRiskPlanning/delete'),
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
      }
    }
  }
</script>
