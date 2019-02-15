<template>
  <div class="mod-config" style="height: 100%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="eid">
        <el-select v-model="dataForm.eId" filterable clearable placeholder="企业" @focus="getEnterpriseTree()">
          <el-option
            v-for="item in eidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('monitor/sensorInstallationDrawing/save')" type="primary" @click="addOrUpdateHandle()">
          新增
        </el-button>
        <el-button v-if="isAuth('monitor/sensorInstallationDrawing/delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
    >
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
        prop="drawingName"
        header-align="center"
        align="center"
        label="安装的传感器名称">
      </el-table-column>
      <el-table-column
        prop="drawingSite"
        header-align="center"
        align="center"
        label="安装位置">
      </el-table-column>
      <el-table-column
        prop="drawingDescription"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="修改时间">
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
          <el-button v-if="isAuth('monitor/sensorInstallationDrawing/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button type="text" size="small" @click="sensorInstallationDrawingInfo(scope.row.id)">
            <i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('monitor/sensorInstallationDrawing/delete')" type="text" size="small"
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
    <!--查看信息-->
    <sensor-installation-drawing-info v-if="installationDrawingInfoVisible" ref="sensorInstallationDrawingInfo"
                                      @refreshDataList="getDataList"></sensor-installation-drawing-info>
  </div>
</template>

<script>
  import AddOrUpdate from './sensorInstallationDrawing-add-or-update'
  import sensorInstallationDrawingInfo from './sensorInstallationDrawing-info'

  export default {
    data () {
      return {
        dataForm: {
          eid: ''
        },
        height: '500',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        eidOptions: [],
        installationDrawingInfoVisible: false
      }
    },
    components: {
      AddOrUpdate,
      sensorInstallationDrawingInfo
    },
    activated () {
      this.getDataList()
      this.getHeight()
    },
    methods: {
      // 获取高度
      getHeight () {
        this.height = document.body.clientHeight - 280
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorInstallationDrawing/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'eId': this.dataForm.eId
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
      // 信息查看
      sensorInstallationDrawingInfo (id) {
        this.installationDrawingInfoVisible = true
        this.$nextTick(() => {
          this.$refs.sensorInstallationDrawingInfo.init(id)
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
            url: this.$http.adornUrl('/monitor/sensorInstallationDrawing/delete'),
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
