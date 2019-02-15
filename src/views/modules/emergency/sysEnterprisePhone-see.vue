<template>
  <div class="emergencyBox">
    <div class="emergencyClose"><i class="el-icon-close" @click="enterprisePhoneOff"></i></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="企业通讯录" name="first"></el-tab-pane>
      <el-tab-pane label="监管部门通讯录" name="second"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 'first'">
      <!--<div class="emergencyTitle">企业通讯录：</div>-->
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
          prop="mainPerson"
          header-align="center"
          align="center"
          label="企业负责人">
        </el-table-column>
        <el-table-column
          prop="mainPersonMobile"
          header-align="center"
          align="center"
          label="负责人电话">
        </el-table-column>
        <el-table-column
          prop="email"
          header-align="center"
          align="center"
          label="邮箱">
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
    <div v-else-if="activeName == 'second'">
      <!--<div class="emergencyTitle">监管部门通讯录：</div>-->
      <el-form :inline="true" :model="regulatorDataForm" @keyup.enter.native="getRegulatorDataList()">
        <el-form-item>
          <el-input v-model="regulatorDataForm.regulatorName" placeholder="监管部门名称" clearable></el-input>
        </el-form-item>
        <el-select v-model="regulatorDataForm.regulatorCode" filterable placeholder="监管部门类型" clearable
                   @focus="getRegulatorTree()">
          <el-option
            v-for="item in regulatorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button @click="getRegulatorDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="regulatorDataList"
        border
        v-loading="regulatorDataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="regulatorName"
          header-align="center"
          align="center"
          label="监管部门">
        </el-table-column>
        <el-table-column
          prop="regulatorTypeName"
          header-align="center"
          align="center"
          label="监管部门类型">
        </el-table-column>
        <el-table-column
          prop="contacts"
          header-align="center"
          align="center"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          header-align="center"
          align="center"
          label="邮箱">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="regulatorSizeChangeHandle"
        @current-change="regulatorCurrentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="regulatorPageSize"
        :total="regulatorTotalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeName: 'first',
        dataForm: {
          id: '',
          enterpriseName: '',
          industryCode: '',
          areaCode: ''
        },
        regulatorDataForm: {
          regulatorName: '',
          regulatorCode: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        regulatorPageIndex: 1,
        regulatorPageSize: 10,
        regulatorTotalPage: 0,
        dataListLoading: false,
        options: [],
        industryCodeOptions: [],
        areaCodeOptions: [],
        regulatorDataList: [],
        regulatorDataListLoading: false,
        dataListSelections: [],
        regulatorOptions: []
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
      enterprisePhoneOff () {
        this.$emit('enterpriseHide')
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
      },
      // tabs标签点击事件
      handleClick () {
        if (this.activeName === 'second') {
          this.getRegulatorDataList()
        } else {
          this.getDataList()
        }
      },
      // 获取监管部门数据列表
      getRegulatorDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/emergency/emergencyRegulator/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.regulatorPageIndex,
            'limit': this.regulatorPageSize,
            'regulatorName': this.regulatorDataForm.regulatorName,
            'regulatorType': this.regulatorDataForm.regulatorCode
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.regulatorDataList = data.page.list
            this.regulatorTotalPage = data.page.totalCount
          } else {
            this.regulatorDataList = []
            this.regulatorTotalPage = 0
          }
          this.regulatorDataListLoading = false
        })
      },
      // 每页数
      regulatorSizeChangeHandle (val) {
        this.regulatorPageSize = val
        this.regulatorPageIndex = 1
        this.getRegulatorDataList()
      },
      // 当前页
      regulatorCurrentChangeHandle (val) {
        this.regulatorPageIndex = val
        this.getRegulatorDataList()
      },
      // 获取监管部门树
      getRegulatorTree () {
        this.$http({
          url: this.$http.adornUrl('/sys/dic/selectTree/155'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.regulatorOptions = data.list
          } else {
            this.regulatorOptions = []
          }
        })
      }
    }
  }
</script>
