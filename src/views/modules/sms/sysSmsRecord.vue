<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="要求推送时间开始时间"></el-date-picker>
        <el-date-picker v-model="dataForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="要求推送时间结束时间"></el-date-picker>
        <el-input v-model="dataForm.userName" style="width:200px;" placeholder="用户名" clearable></el-input>

      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sms/sysSmsRecord/save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sms/sysSmsRecord/delete')" type="danger" @click="deleteHandle()"
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
        prop="loginName"
        header-align="center"
        align="center"
        label="账号">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="title"
                       header-align="center"
                       align="center"
                       label="消息标题"
                       width="100px">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="content"
                       header-align="center"
                       align="center"
                       label="消息内容"
                       width="200px">
      </el-table-column>
      <el-table-column
        prop="smsTime"
        header-align="center"
        align="center"
        label="要求推送时间">
      </el-table-column>
      <el-table-column
        prop="smsCount"
        header-align="center"
        align="center"
        label="要求推送次数">
      </el-table-column>
      <el-table-column
        prop="intervalTime"
        header-align="center"
        align="center"
        label="推送间隔时间">
      </el-table-column>
      <el-table-column
        prop="intervalUnit"
        header-align="center"
        align="center"
        label="推送间隔时间单位">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.intervalUnit === 0" size="small">秒</el-tag>
          <el-tag v-if="scope.row.intervalUnit === 1" size="small">分</el-tag>
          <el-tag v-if="scope.row.intervalUnit === 2" size="small">时</el-tag>
        </template>
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
        width="90px"
        prop="smsType"
        header-align="center"
        align="center"
        label="消息类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.smsType === 0" size="small">页面推送</el-tag>
          <el-tag v-if="scope.row.smsType === 1" size="small">手机推送</el-tag>
          <el-tag v-if="scope.row.smsType === 2" size="small">短信推送</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="appType"
        header-align="center"
        align="center"
        label="平台类型" width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.appType === 0" size="small">平台</el-tag>
          <el-tag v-if="scope.row.appType === 1" size="small">大屏</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sms/sysSmsRecord/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button v-if="isAuth('sms/sysSmsRecord/delete')" type="text" size="small"
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
  </div>
</template>

<script>
  import AddOrUpdate from './sysSmsRecord-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          startTime: '',
          endTime: '',
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
    components: {
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
          url: this.$http.adornUrl('/sms/sysSmsRecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.dataForm.key,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime,
            'unreadStatus': 1
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
            url: this.$http.adornUrl('/sms/sysSmsRecord/delete'),
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
