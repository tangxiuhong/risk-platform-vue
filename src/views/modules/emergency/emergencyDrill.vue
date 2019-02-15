<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.drillName" placeholder="演练名称" style="width: 200px" clearable></el-input>
        <el-select v-model="dataForm.drillType" placeholder="演练方式" clearable>
          <el-option
            v-for="item in drillTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-model="dataForm.drillTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="演练时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('emergency/emergencyDrill/save')" type="primary" @click="addOrUpdateHandle()">新增
        </el-button>
        <el-button v-if="isAuth('emergency/emergencyDrill/delete')" type="danger" @click="deleteHandle()"
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
        prop="drillName"
        header-align="center"
        align="center"
        label="演练名称">
      </el-table-column>
      <el-table-column
        prop="drillTime"
        header-align="center"
        align="center"
        label="演练时间">
      </el-table-column>
      <el-table-column
        prop="drillType"
        header-align="center"
        align="center"
        label="演练方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.drillType === 1" size="small">桌面演练</el-tag>
          <el-tag v-else-if="scope.row.drillType === 2" size="small">功能演练</el-tag>
          <el-tag v-else-if="scope.row.drillType === 3" size="small">全面演练</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="drillRemark"
        header-align="center"
        align="center"
        label="演练备注">
      </el-table-column>
      <el-table-column
        prop="uploadAscriptionType"
        header-align="center"
        align="center"
        label="上传归属类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.uploadAscriptionType === 0" size="small">企业</el-tag>
          <el-tag v-else size="small" type="danger">监管部门</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="uploadUser"
        header-align="center"
        align="center"
        label="上传人员">
      </el-table-column>
      <el-table-column
        prop="uploadTime"
        header-align="center"
        align="center"
        label="上传时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('emergency/emergencyDrill/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('emergency/emergencyDrill/delete')" type="text" size="small"
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
  import AddOrUpdate from './emergencyDrill-add-or-update'
  import Look from './emergencyDrill-look'

  export default {
    data () {
      return {
        dataForm: {
          drillType: '',
          drillName: '',
          drillTime: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        lookVisible: false,
        drillTypeOptions: [{
          value: 1,
          label: '桌面演练'
        }, {
          value: 2,
          label: '功能演练'
        }, {
          value: 3,
          label: '全面演练'
        }]
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
          url: this.$http.adornUrl('/emergency/emergencyDrill/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'drillName': this.dataForm.drillName,
            'drillType': this.dataForm.drillType,
            'drillTime': this.dataForm.drillTime
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
            url: this.$http.adornUrl('/emergency/emergencyDrill/delete'),
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
