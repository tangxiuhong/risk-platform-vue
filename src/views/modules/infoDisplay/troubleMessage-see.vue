<template>
  <div class="riskBox">
    <div class="close"><i class="el-icon-close" @click="troubleOff"></i></div>
    <div class="riskTitle">隐患消息详情：</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-click="rowClick"
      style="width: 100%;">
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="所属部门">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="时间">
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        troubleRdId: '',
        dataListLoading: false
      }
    },
    methods: {
      // 获取数据列表
      getDataList (troubleRdId) {
        this.troubleRdId = troubleRdId
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleMessageList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'troubleRdId': this.troubleRdId
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
        this.getDataList(this.troubleRdId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.troubleRdId)
      },
      // 关闭dialog
      troubleOff () {
        this.$emit('troubleMessageHide')
      }
    }
  }
</script>

