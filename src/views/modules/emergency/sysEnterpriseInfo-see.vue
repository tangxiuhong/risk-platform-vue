<template>
  <div class="emergencyBox">
    <div class="emergencyClose"><i class="el-icon-close" @click="enpterpriseInfoOff"></i></div>
    <div class="emergencyTitle">企业信息：</div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-select v-model="dataForm.industryCode" filterable placeholder="行业" clearable @focus="getIndustryTree()">
        <el-option
          v-for="item in industryCodeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="dataForm.areaCode" filterable placeholder="区域" clearable @focus="getAreaTree()">
        <el-option
          v-for="item in areaCodeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="dataForm.id" filterable placeholder="企业" clearable @focus="getEnterpriseTree()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="varName4"
        header-align="center"
        align="center"
        label="所属区域">
      </el-table-column>
      <el-table-column
        prop="varName3"
        header-align="center"
        align="center"
        label="所属行业">
      </el-table-column>
      <el-table-column
        prop="contactAddress"
        header-align="center"
        align="center"
        label="通讯地址">
      </el-table-column>
      <el-table-column
        prop="license"
        header-align="center"
        align="center"
        label="安全经营许可证号">
      </el-table-column>
      <el-table-column
        prop="safePerson"
        header-align="center"
        align="center"
        label="安全部门负责人">
      </el-table-column>
      <el-table-column
        prop="safePersonMobile"
        header-align="center"
        align="center"
        label="安全负责人电话">
      </el-table-column>
      <el-table-column
        prop="regulatorName"
        header-align="center"
        align="center"
        label="主管部门">
      </el-table-column>
      <el-table-column
        prop="riskDegree"
        header-align="center"
        align="center"
        label="当前风险">
        <template slot-scope="scope">
          <span v-if="scope.row.riskDegree === 1" style="color: red" size="small">红色</span>
          <span v-else-if="scope.row.riskDegree === 2" style="color: orange" size="small">橙色</span>
          <span v-else-if="scope.row.riskDegree === 3" style="color: yellow" size="small">黄色</span>
          <span v-else-if="scope.row.riskDegree === 4" style="color: blue" size="small">蓝色</span>
          <span v-else style="color: blue" size="small">蓝色</span>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          enterpriseName: '',
          industryCode: '',
          areaCode: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        options: [],
        industryCodeOptions: [],
        areaCodeOptions: []
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': this.dataForm.id,
            'enterpriseName': this.dataForm.enterpriseName,
            'industryCode': this.dataForm.industryCode,
            'areaCode': this.dataForm.areaCode,
            'isRegist': 0
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
      enpterpriseInfoOff () {
        this.$emit('enterpriseInfoHide')
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
      },
      // 获取行业树
      getIndustryTree () {
        this.$http({
          url: this.$http.adornUrl('/sys/dic/selectTree/9'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.industryCodeOptions = data.list
          } else {
            this.industryCodeOptions = []
          }
        })
      },
      // 获取区域树
      getAreaTree () {
        this.$http({
          url: this.$http.adornUrl('/sys/dic/selectTree/16'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.areaCodeOptions = data.list
          } else {
            this.areaCodeOptions = []
          }
        })
      }
    }
  }
</script>
