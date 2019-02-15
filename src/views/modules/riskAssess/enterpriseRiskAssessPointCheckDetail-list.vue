<template>
  <el-dialog
    :title="'检查列表'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%"
  >

    <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPointCheckDetail/save')" type="primary"
               @click="addOrUpdateHandle()">新增
    </el-button>
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
        prop="checkNo"
        header-align="center"
        align="center"
        label="检查序号">
      </el-table-column>
      <el-table-column
        prop="checkDo"
        header-align="center"
        align="center"
        label="检查说明">
      </el-table-column>
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="检查单位">
      </el-table-column>
      <el-table-column
        prop="personName"
        header-align="center"
        align="center"
        label="检查人">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="parameter1"
        header-align="center"
        align="center"
        label="起始序号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPointCheckDetail/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">修改
          </el-button>
          <el-button v-if="isAuth('riskAssess/enterpriseRiskAssessPointCheckDetail/delete')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)">删除
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
    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
  </el-dialog>

</template>

<script>
  import AddOrUpdate from './enterpriseRiskAssessPointCheckDetail-add-or-update'

  export default {

    data () {
      return {
        visible: false,
        pointId: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: true

      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {

      init (id) {
        this.pointId = id;
        this.visible = true;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessPointCheckDetail/listPointCheckDetail'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'pId': this.pointId
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
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.pointId);
        })
      },

      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessPointCheckDetail/delete'),
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
