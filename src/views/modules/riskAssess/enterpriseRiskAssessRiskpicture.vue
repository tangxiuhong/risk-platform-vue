<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.pictureName" placeholder="平面图名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessRiskpicture/save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessRiskpicture/delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="pictureName"
        header-align="center"
        align="center"
        label="平面图名称">
      </el-table-column>
      <el-table-column
        prop="pictureDesc"
        header-align="center"
        align="center"
        label="平面图说明">
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
        label="记录创建者(用户)">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessRiskpicture/update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessRiskpicture/delete')" type="text" size="small" @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessRiskpicture/listPointCheckDetail')" type="text" size="small" @click="riskPointHandle(scope.row.id)">风险点</el-button>
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
    <risk-point-edit v-if="riskPointVisible" ref="riskPointEdit" @refreshDataList="getDataList"></risk-point-edit>
  </div>
</template>

<script>
  import AddOrUpdate from   './enterpriseRiskAssessRiskpicture-add-or-update'
  import riskPointEdit from './enterpriseRiskAssessRiskpicture-riskPoint'
  export default {
    data () {
      return {
        dataForm: {
          pictureName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        riskPointVisible:false
      }
    },
    components: {
      AddOrUpdate,riskPointEdit
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRiskpicture/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'pictureName': this.dataForm.pictureName
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
            url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRiskpicture/delete'),
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
      riskPointHandle(id)
      {
        this.riskPointVisible = true
        this.$nextTick(() => {
          this.$refs.riskPointEdit.init(id)
        })
      }
    }
  }
</script>
