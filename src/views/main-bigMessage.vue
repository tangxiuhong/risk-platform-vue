<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="要求推送时间开始时间"></el-date-picker>
        <el-date-picker v-model="dataForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="要求推送时间结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="danger" @click="updateStatusHandle()"
                   :disabled="dataListSelections.length <= 0">批量已读
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
      <el-table-column show-overflow-tooltip
                       prop="title"
                       header-align="center"
                       align="center"
                       label="消息标题">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="content"
                       header-align="center"
                       align="center"
                       label="消息内容">
      </el-table-column>
      <el-table-column
        prop="realCount"
        header-align="center"
        align="center"
        label="实际推送次数">
      </el-table-column>
      <el-table-column
        prop="realTime"
        header-align="center"
        align="center"
        label="实际推送时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="推送状态	">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">待推送</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small" type="danger">失败</el-tag>
          <el-tag v-if="scope.row.status === 3" size="small">已读</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="updateStatusHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
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
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          startTime: '',
          endTime: '',
          unreadStatus: 1
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {},
    methods: {
      // 获取数据列表
      getDataList () {
        this.visible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sms/sysSmsRecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime,
            'unreadStatus': this.dataForm.unreadStatus
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
      // 已读
      updateStatusHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '已读' : '批量已读'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sms/sysSmsRecord/updateMessageStatus'),
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
<style>
  .v-modal {
    z-index: 1000 !important;
  }
</style>
