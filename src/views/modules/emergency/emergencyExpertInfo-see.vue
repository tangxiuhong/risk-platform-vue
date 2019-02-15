<template>
  <div class="emergencyBox">
    <div class="emergencyClose"><i class="el-icon-close" @click="emergencyExpertOff"></i></div>
    <div class="emergencyTitle">应急专家信息：</div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.expertName" placeholder="专家名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="expertName"
        header-align="center"
        align="center"
        label="专家名称">
      </el-table-column>
      <el-table-column
        prop="expertTypeName"
        header-align="center"
        align="center"
        label="专家类型">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="position"
        header-align="center"
        align="center"
        label="职称">
      </el-table-column>
      <el-table-column
        prop="serviceField"
        header-align="center"
        align="center"
        label="服务领域">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="联系电话">
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
        dataForm: {
          expertName: ''
        },
        expertType: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        options: []
      }
    },
    methods: {
      // 获取数据列表
      getDataList (expertType) {
        if (expertType != null) {
          this.expertType = expertType
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/emergency/emergencyExpert/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'expertName': this.dataForm.expertName,
            'expertType': this.expertType
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
      // 关闭dialog
      emergencyExpertOff () {
        this.$emit('emergencyExpertInfoHide')
      }
    }
  }
</script>
