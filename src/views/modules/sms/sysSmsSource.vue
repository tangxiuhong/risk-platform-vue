<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始时间"></el-date-picker>
        <el-date-picker v-model="dataForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="结束时间"></el-date-picker>
        <el-select v-model="dataForm.smsSource" clearable placeholder="消息来源">
          <el-option
            v-for="item in smsSourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sms/sysSmsSource/save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sms/sysSmsSource/delete')" type="danger" @click="deleteHandle()"
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
        prop="enterpriseName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="targetList"
        header-align="center"
        align="center"
        label="账号列表">
      </el-table-column>
      <el-table-column
        prop="smsSource"
        header-align="center"
        align="center"
        label="消息来源" width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.smsSource === 0" size="small">风险变化</el-tag>
          <el-tag v-if="scope.row.smsSource === 1" size="small">实时监测</el-tag>
          <el-tag v-if="scope.row.smsSource === 2" size="small">信息发布</el-tag>
          <el-tag v-if="scope.row.smsSource === 3" size="small">隐患排查</el-tag>
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
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sms/sysSmsSource/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button v-if="isAuth('sms/sysSmsSource/delete')" type="text" size="small"
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
  import AddOrUpdate from './sysSmsSource-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          startTime: '',
          endTime: '',
          smsSource: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        smsSourceOptions: [{
          value: '0',
          label: '风险变化'
        }, {
          value: '1',
          label: '实时监测'
        }, {
          value: '2',
          label: '信息发布'
        }, {
          value: '3',
          label: '隐患排查'
        }]
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
          url: this.$http.adornUrl('/sms/sysSmsSource/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime,
            'smsSource': this.dataForm.smsSource
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
            url: this.$http.adornUrl('/sms/sysSmsSource/delete'),
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
