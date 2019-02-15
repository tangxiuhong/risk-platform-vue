<template>
  <div class="videoConfigContent clear">
    <!-- 左边的父表 -->
    <div class="left">
      <el-form :inline="true" :model="configDataForm" @keyup.enter.native="getConfigDataList()">
        <el-select v-model="configDataForm.eId" filterable clearable placeholder="企业" @focus="getEnterpriseTree()">
          <el-option
            v-for="item in eidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button @click="getConfigDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateConfigHandle()">新增</el-button>
          <el-button type="danger" @click="deleteConfigHandle()" :disabled="configListSelections.length <= 0">批量删除
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="configDataList"
        border
        v-loading="configDataListLoading"
        @selection-change="selectionConfigChangeHandle"
        @row-click="configRowClick"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          header-align="center"
          align="center"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="codeName"
          header-align="center"
          align="center"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="ip"
          header-align="center"
          align="center"
          label="ip地址">
        </el-table-column>
        <el-table-column
          prop="port"
          header-align="center"
          align="center"
          label="端口">
        </el-table-column>
        <el-table-column
          prop="state"
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 0" size="small" type="danger">禁用</el-tag>
            <el-tag v-else size="small">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="addressName"
          header-align="center"
          align="center"
          label="视频安装位置">
        </el-table-column>
        <el-table-column
          prop="isSync"
          header-align="center"
          align="center"
          label="是否同步">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isSync === 0" size="small">同步</el-tag>
            <el-tag v-else size="small" type="danger">不同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('monitor/videoConfig/update')" type="text" size="small"
                       @click="addOrUpdateConfigHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
            <el-button v-if="isAuth('monitor/videoConfig/delete')" type="text" size="small"
                       @click="deleteConfigHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="configSizeChangeHandle"
        @current-change="configCurrentChangeHandle"
        :current-page="configPageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="configPageSize"
        :total="configTotalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update-config v-if="addOrUpdateConfigVisible" ref="addOrUpdateConfig"
                            @refreshDataList="getConfigDataList"></add-or-update-config>
    </div>
    <!-- 右边的子表 -->
    <div class="right">
      <el-form :inline="true" :model="infoDataForm" @keyup.enter.native="getInfoDataList()">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateInfoHandle()" :disabled="vId == '' || vId == null">新增
          </el-button>
          <el-button type="danger" @click="deleteInfoHandle()" :disabled="infoListSelections.length <= 0">批量删除
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="infoDataList"
        border
        v-loading="infoDataListLoading"
        @selection-change="selectionChangeInfoHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="infoId"
          header-align="center"
          align="center"
          label="信号通道Id">
        </el-table-column>
        <el-table-column
          prop="watchSite"
          header-align="center"
          align="center"
          label="监视位置">
        </el-table-column>
        <el-table-column
          prop="memo"
          header-align="center"
          align="center"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="isSync"
          header-align="center"
          align="center"
          label="是否同步">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isSync === 0" size="small">同步</el-tag>
            <el-tag v-else size="small" type="danger">不同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('monitor/videoInfo/update')" type="text" size="small"
                       @click="addOrUpdateInfoHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
            <el-button v-if="isAuth('monitor/videoInfo/delete')" type="text" size="small"
                       @click="deleteInfoHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="infoSizeChangeHandle"
        @current-change="infoCurrentChangeHandle"
        :current-page="infoPageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="infoPageSize"
        :total="infoTotalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update-info v-if="addOrUpdateInfoVisible" ref="addOrUpdateInfo"
                          @refreshDataList="getInfoDataList"></add-or-update-info>
    </div>
  </div>

</template>

<script>
  import AddOrUpdateConfig from './videoConfig-add-or-update'
  import AddOrUpdateInfo from './videoInfo-add-or-update'

  export default {
    data () {
      return {
        configDataForm: {
          eId: ''
        },
        height: '50',
        infoDataForm: {},
        vId: '',
        configDataList: [],
        infoDataList: [],
        // configList: [],
        // infoList: [],
        configPageIndex: 1,
        configPageSize: 10,
        configTotalPage: 0,
        infoPageIndex: 1,
        infoPageSize: 10,
        infoTotalPage: 0,
        configDataListLoading: false,
        infoDataListLoading: false,
        addOrUpdateConfigVisible: false,
        addOrUpdateInfoVisible: false,
        configListSelections: [],
        infoListSelections: [],
        eidOptions: []
      }
    },
    components: {
      AddOrUpdateConfig,
      AddOrUpdateInfo
    },
    mounted () {
      this.getConfigDataList()
      this.getInfoDataList()
    },
    activated () {
      this.getHeight()
    },
    methods: {
      // 获取高度
      getHeight () {
        this.height = document.body.clientHeight - 280
      },
      // 获取父表数据列表
      getConfigDataList () {
        this.configDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/videoConfig/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.configPageIndex,
            'limit': this.configPageSize,
            'eId': this.configDataForm.eId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.configDataList = data.page.list
            this.configTotalPage = data.page.totalCount
          } else {
            this.configDataList = []
            this.configTotalPage = 0
          }
          this.configDataListLoading = false
        })
      },
      // 获取子数据列表
      getInfoDataList () {
        this.infoDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/videoInfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.infoPageIndex,
            'limit': this.infoPageSize,
            'vId': this.vId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.infoDataList = data.page.list
            this.infoTotalPage = data.page.totalCount
          } else {
            this.infoDataList = []
            this.infoTotalPage = 0
          }
          this.infoDataListLoading = false
        })
      },
      // 父表每页数
      configSizeChangeHandle (val) {
        this.configPageSize = val
        this.configPageIndex = 1
        this.getConfigDataList()
      },
      // 父表当前页
      configCurrentChangeHandle (val) {
        this.configPageIndex = val
        this.getConfigDataList()
      },
      // 子表每页数
      infoSizeChangeHandle (val) {
        this.infoPageSize = val
        this.infoPageIndex = 1
        this.getInfoDataList()
      },
      // 子表当前页
      infoCurrentChangeHandle (val) {
        this.infoPageIndex = val
        this.getInfoDataList()
      },
      // 多选(选择父表格)
      selectionConfigChangeHandle (val) {
        this.configListSelections = val
      },
      // 多选(选择子表格)
      selectionChangeInfoHandle (val) {
        this.infoListSelections = val
      },
      // 父类添加、修改
      addOrUpdateConfigHandle (id) {
        this.addOrUpdateConfigVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateConfig.init(id)
        })
      },
      // 父类删除
      deleteConfigHandle (id) {
        var ids = id ? [id] : this.configListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/monitor/videoConfig/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getConfigDataList()
                  this.getInfoDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 子类添加、修改
      addOrUpdateInfoHandle (id) {
        this.addOrUpdateInfoVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateInfo.init(id, this.vId)
        })
      },
      // 子类删除
      deleteInfoHandle (id) {
        var ids = id ? [id] : this.infoListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/monitor/videoInfo/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getInfoDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 父表点击事件
      configRowClick (row, event, column) {
        this.vId = row.id
        this.getInfoDataList()
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eidOptions = data.list
          } else {
            this.eidOptions = []
          }
        })
      }
    }
  }
</script>
<style>
  .clear {
    display: block;
    overflow: hidden;
  }

  .videoConfigContent {
    width: 100%;
    height: 800px;
  }

  .videoConfigContent .left {
    float: left;
    width: 49%;
    height: 100%;
  }

  .videoConfigContent .right {
    float: left;
    width: 49%;
    margin-left: 2%;
    height: 100%;
  }

</style>
