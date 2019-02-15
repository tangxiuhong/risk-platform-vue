<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="安全检查开始时间"></el-date-picker>
        <el-date-picker v-model="dataForm.endTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="安全检查结束时间"></el-date-picker>
        <el-input v-model="dataForm.createUser" style="width:200px;" placeholder="发布人" filterable clearable></el-input>
        <el-select v-model="dataForm.checkType" placeholder="检查类型" filterable clearable>
          <el-option
            v-for="item in checkTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
        prop="planNo"
        header-align="center"
        align="center"
        label="安全检查编号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="planTime"
        header-align="center"
        align="center"
        label="安全检查时间">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="安全检查类型">
        <template slot-scope="scope">
          <span v-if="scope.row.checkType=== 1">安全综合检查</span>
          <span v-else-if="scope.row.checkType === 2">专业安全检查</span>
          <span v-else-if="scope.row.checkType === 3">专项安全检查</span>
          <span v-else-if="scope.row.checkType === 4">日常检查</span>
          <span v-else-if="scope.row.checkType === 5">自主管理</span>
          <span v-else-if="scope.row.checkType === 6">风险日常检查</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="implementList"
        header-align="center"
        align="center"
        label="实施方案"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="inspectList"
        header-align="center"
        align="center"
        label="安全检查表"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="发布人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
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
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getDataList"></look>
  </div>
</template>

<script>
  import Look from './enterpriseTroublecheckplan-look'

  export default {
    data () {
      return {
        dataForm: {
          startTime: '',
          endTime: '',
          createUser: '',
          checkType: null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        lookVisible: false,
        checkTypeOptions: [{
          value: '1',
          label: '安全综合检查'
        }, {
          value: '2',
          label: '专业安全检查'
        }, {
          value: '3',
          label: '专项安全检查'
        }, {
          value: '4',
          label: '日常检查'
        }, {
          value: '6',
          label: '风险日常检查'
        }]
      }
    },
    components: {
      Look
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublecheckplan/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime,
            'createUser': this.dataForm.createUser,
            'checkType': this.dataForm.checkType
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
      // 查看
      lookHandle (id) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroublecheckplan/delete'),
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
        }).catch(() => {
        })
      }
    }
  }
</script>
<style>

</style>
