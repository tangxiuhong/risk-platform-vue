<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.troubleNum" style="width:200px;" placeholder="隐患编号" filterable clearable></el-input>
        <el-form-item label="" prop="checkDepartmentName">
          <el-popover
            ref="deptListPopover1"
            placement="bottom-start"
            trigger="click">
            <el-tree
              :data="deptList"
              :props="deptListTreeProps"
              node-key="id"
              ref="deptListTree1"
              @current-change="deptListTreeCurrentChangeHandle1"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.checkDepartmentName" v-popover:deptListPopover1 :readonly="true"
                    placeholder="点击选择检查单位" class="menu-list__input" filterable clearable></el-input>
        </el-form-item>
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
          <el-input v-model="dataForm.departmentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择责任单位"
                    class="menu-list__input" filterable clearable></el-input>
        </el-form-item>
        <el-select v-model="dataForm.troubleType" placeholder="隐患级别" filterable clearable>
          <el-option
            v-for="item in troubleTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('trouble/enterpriseTroublerecord/save')" type="primary" @click="addOrUpdateHandle()">
          新增
        </el-button>
        <el-button v-if="isAuth('trouble/enterpriseTroublerecord/delete')" type="danger" @click="deleteHandle()"
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
        prop="troubleNum"
        header-align="center"
        align="center"
        label="隐患编号">
      </el-table-column>
      <el-table-column
        prop="checkType"
        header-align="center"
        align="center"
        label="安全检查类型">
        <template slot-scope="scope">
          <span v-if="scope.row.checkType=== 1" size="small">安全综合检查</span>
          <span v-else-if="scope.row.checkType === 2" size="small">专业安全检查</span>
          <span v-else-if="scope.row.checkType=== 3" size="small">专项安全检查</span>
          <span v-else-if="scope.row.checkType === 4" size="small">日常检查</span>
          <span v-else-if="scope.row.checkType === 5" size="small">自主管理</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        label="责任单位">
      </el-table-column>
      <el-table-column
        prop="troubleDescription"
        header-align="center"
        align="center"
        label="隐患问题">
      </el-table-column>
      <el-table-column
        prop="troubleType"
        header-align="center"
        align="center"
        label="隐患分级">
        <template slot-scope="scope">
          <span v-if="scope.row.troubleType=== 1" size="small">一般隐患</span>
          <span v-else-if="scope.row.troubleType === 2" size="small">重大隐患</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkDepartment"
        header-align="center"
        align="center"
        label="检查单位">
      </el-table-column>
      <el-table-column
        prop="checkMan"
        header-align="center"
        align="center"
        label="检查人">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 0" size="small">保存</span>
          <span v-else-if="scope.row.status === 1" size="small">待整改</span>
          <span v-else-if="scope.row.status === 2" size="small">待验收</span>
          <span v-else-if="scope.row.status === 3" size="small">整改完成</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('trouble/enterpriseTroublerecordDaily/update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"><i class="el-icon-edit"></i></el-button>
          <el-button type="text" size="small" @click="lookHandle(scope.row.id)"><i class="el-icon-view"></i></el-button>
          <el-button v-if="isAuth('trouble/enterpriseTroublerecordDaily/delete')" type="text" size="small"
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
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getDataList"></look>
  </div>
</template>

<script>
  import AddOrUpdate from './enterpriseTroublerecordDaily-add-or-update'
  import Look from './enterpriseTroublerecordDaily-look'
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          troubleNum: '',
          checkDepartment: '',
          checkDepartmentName: '',
          department: '',
          departmentName: '',
          troubleType: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        lookVisible: false,
        planNoList: [],
        troubleTypeOptions: [{
          value: '1',
          label: '一般隐患'
        }, {
          value: '2',
          label: '重大隐患'
        }],
        //  企业单位
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
          this.deptListTreeSetCurrentNode1()
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'dataType': 2,
            'troubleNum': this.dataForm.troubleNum,
            'checkDepartment': this.dataForm.checkDepartment,
            'department': this.dataForm.department,
            'troubleType': this.dataForm.troubleType
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
      lookHandle (id) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(id)
        })
      },
      // 检查单位树选中
      deptListTreeCurrentChangeHandle1 (data, node) {
        this.dataForm.checkDepartment = data.id
        this.dataForm.checkDepartmentName = data.name
      },
      //  检查单位设置当前选中节点
      deptListTreeSetCurrentNode1 () {
        this.$refs.deptListTree1.setCurrentKey(this.dataForm.checkDepartment)
        this.dataForm.checkDepartmentName = (this.$refs.deptListTree1.getCurrentNode() || {})['name']
      },
      // 责任单位树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.department = data.id
        this.dataForm.departmentName = data.name
      },
      //  责任单位设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.department)
        this.dataForm.departmentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
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
            url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/delete'),
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
