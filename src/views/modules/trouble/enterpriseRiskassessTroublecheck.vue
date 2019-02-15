<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-form-item label="" prop="departmentName">
          <el-popover
            ref="deptListPopover"
            placement="bottom-start"
            trigger="click">
            <el-tree
              :data="deptList"
              :props="deptListTreeProps"
              node-key="id"
              ref="deptListTree"
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.departmentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择报送部门"
                    class="menu-list__input" filterable clearable></el-input>
        </el-form-item>
        <el-select v-model="dataForm.status" placeholder="状态" filterable clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('trouble/enterpriseRiskassessTroublecheck/save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('trouble/enterpriseRiskassessTroublecheck/delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="troubleNum"
        header-align="center"
        align="center"
        label="隐患单号">
      </el-table-column>
      <el-table-column
        prop="troublePosition"
        header-align="center"
        align="center"
        label="检查位置">
      </el-table-column>
      <el-table-column
        prop="troubleDescription"
        header-align="center"
        align="center"
        label="问题">
      </el-table-column>
      <el-table-column
        prop="measure"
        header-align="center"
        align="center"
        label="临时控制措施">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="安全检查类型">
        <template slot-scope="scope">
          <span v-if="scope.row.checkType=== 5" size="small">自主管理</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="报送到部门">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="接受人">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 0" size="small">保存</span>
          <span v-else-if="scope.row.status === 1" size="small">已提交</span>
          <span v-else-if="scope.row.status=== 2" size="small">生成隐患单号</span>
          <span v-else-if="scope.row.status === 3" size="small">关闭</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('trouble/enterpriseRiskassessTroublecheck/update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button v-if="scope.row.troubleNum" type="text" size="small" @click="lookHandle(scope.row.troubleNum)"><i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('trouble/enterpriseRiskassessTroublecheck/delete')" type="text" size="small" @click="deleteHandle(scope.row.id)"><i class="el-icon-delete"></i></el-button>
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
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getDataList"></look>
  </div>
</template>

<script>
  import AddOrUpdate from './enterpriseRiskassessTroublecheck-add-or-update'
  import Look from './enterpriseRiskassessTroublecheck-look'
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          departmentId: '',
          departmentName: '',
          status: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        lookVisible: false,
        statusOptions: [
          {label: '保存', value: 0},
          {label: '已提交', value: 1},
          {label: '生成隐患单号', value: 2},
          {label: '关闭', value: 3}
        ],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addTroubleVisible: false,
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    components: {
      AddOrUpdate,
      Look
    },
    activated () {
      this.getDataList()
      this.getDepartment()
    },
    methods: {
      // 获取企业监管部门
      getDepartment () {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/0`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
          this.deptListTreeSetCurrentNode()
        })
      },
      // 责任单位树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.departmentId = data.id
        this.dataForm.departmentName = data.name
      },
      //  责任单位设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.departmentId)
        this.dataForm.departmentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseRiskassessTroublecheck/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'departmentId': this.dataForm.departmentId,
            'status': this.dataForm.status
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
      // 查看
      lookHandle (troubleNum) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(troubleNum)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对选中数据进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseRiskassessTroublecheck/delete'),
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
