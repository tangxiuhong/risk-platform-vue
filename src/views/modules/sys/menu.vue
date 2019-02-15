<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys/user/save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        width="150"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        width="120"
        label="菜单介绍">
      </el-table-column>
      <el-table-column
        prop="resourceType"
        header-align="center"
        align="center"
        label="菜单类型">
      </el-table-column>
      <el-table-column
        prop="seq"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="icon"
        header-align="center"
        align="center"
        label="图标">
      </el-table-column>
      <el-table-column
        prop="parentId"
        header-align="center"
        align="center"
        width="70"
        :show-overflow-tooltip="true"
        label="菜单父编号">
      </el-table-column>
      <el-table-column
        prop="openedName"
        header-align="center"
        align="center"
        width="100"
        :show-overflow-tooltip="true"
        label="打开状态">
      </el-table-column>
      <el-table-column
        prop="openMode"
        header-align="center"
        align="center"
        width="100"
        :show-overflow-tooltip="true"
        label="打开方式">
        <template slot-scope="scope">
          <el v-if="scope.row.openMode=== 0" size="small">ajax</el>
          <el v-else-if="scope.row.openMode === 1" size="small" type="success">iframe</el>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusName"
        header-align="center"
        align="center"
        width="100"
        :show-overflow-tooltip="true"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="更改时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys/user/update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <i class="el-icon-edit"></i></el-button>
          <el-button v-if="isAuth('sys/user/delete')" type="text" size="small" @click="deleteHandle(scope.row.id)"><i
            class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'id')
          this.dataListLoading = false
        })
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
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
        }).catch(() => {
        })
      }
    }
  }
</script>
