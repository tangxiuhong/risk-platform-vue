<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.loginName" placeholder="账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.reportType" placeholder="汇报方式" clearable>
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.toLoginName" placeholder="汇报账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('enterprise/sysUserReport/save')" type="primary" @click="addReportHandle()">新增</el-button>
        <el-button v-if="isAuth('enterprise/sysUserReport/delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="departmentName6"
        header-align="center"
        align="center"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="jobName7"
        header-align="center"
        align="center"
        label="职务">
      </el-table-column>
      <el-table-column
        prop="name1"
        header-align="center"
        align="center"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="reportType"
        header-align="center"
        align="center"
        label="汇报方式">
        <template slot-scope="scope">
          <span v-if="scope.row.reportType=== 0">指令下达</span>
          <span v-else-if="scope.row.reportType === 1">隐患上报</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="汇报部门">
      </el-table-column>
      <el-table-column
        prop="jobName"
        header-align="center"
        align="center"
        label="汇报职务">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="汇报账号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
            <el-button v-if="isAuth('enterprise/sysUserReport/update')" type="text" size="small" @click="updateReportHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
            <el-button v-if="isAuth('enterprise/sysUserReport/delete')" type="text" size="small" @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
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
    <add-report v-if="addVisible" ref="AddReport" @refreshDataList="getDataList"></add-report>
    <update-report v-if="updateVisible" ref="UpdateReport" @refreshDataList="getDataList"></update-report>
  </div>
</template>

<script>
  import AddReport from './sysUserReport-add'
  import UpdateReport from './sysUserReport-update'
  export default {
    data () {
      return {
        dataForm: {
          loginName: '' ,
          reportType: '',
          toLoginName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addVisible: false,
        updateVisible: false,
        reportTypeOptions: [{
          value: 0,
          label: '指令下达'
        }, {
          value: 1,
          label: '隐患上报'
        }]
      }
    },
    components: {
      AddReport,UpdateReport
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysUserReport/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'loginName': this.dataForm.loginName,
            'reportType': this.dataForm.reportType,
            'toLoginName': this.dataForm.toLoginName
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
      addReportHandle () {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.AddReport.init()
        })
      },
      updateReportHandle(id)
      {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.UpdateReport.init(id)
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
            url: this.$http.adornUrl('/enterprise/sysUserReport/delete'),
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
