<template>
  <el-dialog
    :title="'危害因素/管控措施列表'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">

    <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/save')" type="primary"
               @click="addOrUpdateRelationHandle()">新增
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
        prop="harmfulFactors"
        header-align="center"
        align="center"
        label="危险有害因素">
      </el-table-column>
      <el-table-column
        prop="controlMeasures"
        header-align="center"
        align="center"
        label="管控措施">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/update')" type="text" size="small"
                     @click="addOrUpdateRelationHandle(scope.row.id)"><i class="el-icon-edit"></i>
          </el-button>
          <el-button v-if="isAuth('enterprise/enterpriseRiskCardConfig/delete')" type="text" size="small"
                     @click="deleteRelationHandle(scope.row.id)"><i class="el-icon-delete"></i>
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
    <AddOrUpdateRelation v-if="addOrUpdateRelationVisible" ref="addOrUpdateRelation" @refreshDataList="getRelationDataList"></AddOrUpdateRelation>
  </el-dialog>

</template>

<script>
  import AddOrUpdateRelation from './enterpriseRiskCardConfigRelation-add-or-update'

  export default {

    data () {
      return {
        visible: false,
        riskCardId: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateRelationVisible: false
      }
    },
    components: {
      AddOrUpdateRelation
    },
    activated () {
      this.getRelationDataList()
    },
    methods: {

      init (id) {
        this.riskCardId = id;
        this.visible = true;
        this.getRelationDataList();
      },
      // 获取数据列表
      getRelationDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseRiskCardConfig/listRelation'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'riskCardId': this.riskCardId
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
        this.getRelationDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getRelationDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateRelationHandle (id) {
        this.addOrUpdateRelationVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdateRelation.init(id, this.riskCardId);
        })
      },
      // 删除
      deleteRelationHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对选中的数据进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/enterpriseRiskCardConfig/deleteRelation'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getRelationDataList()
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
