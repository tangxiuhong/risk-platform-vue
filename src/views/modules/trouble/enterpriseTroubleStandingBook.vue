<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-date-picker v-model="dataForm.checkTime" type="date" value-format="yyyy-MM-dd"
                      placeholder="检查时间"></el-date-picker>
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
        <el-input v-model="dataForm.departmentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择签发单位"
                  class="menu-list__input" filterable clearable></el-input>
      </el-form-item>
      <el-form-item label="" prop="actionDepartName">
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
        <el-input v-model="dataForm.actionDepartmentName" v-popover:deptListPopover1 :readonly="true"
                  placeholder="点击选择整改责任单位" class="menu-list__input" filterable clearable></el-input>
      </el-form-item>
      <el-date-picker v-model="dataForm.actionTime" type="date" value-format="yyyy-MM-dd"
                      placeholder="整改完成时间"></el-date-picker>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('trouble/enterpriseTroubleStandingBook/export')" type="primary" @click="export2Excel()">
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="检查人：">
              <span>{{ props.row.checkMan }}</span>
            </el-form-item>
            <el-form-item label="隐患问题：">
              <span>{{ props.row.troubleDescription }}</span>
            </el-form-item>
            <el-form-item label="隐患分级：">
              <span>{{ props.row.troubleType }}</span>
            </el-form-item>
            <el-form-item label="临时控制措施：">
              <span>{{ props.row.measure }}</span>
            </el-form-item>
            <el-form-item label="责任人：">
              <span>{{ props.row.actionMan }}</span>
            </el-form-item>
            <el-form-item label="整改期限：">
              <span>{{ props.row.timeAffirm }}</span>
            </el-form-item>
            <el-form-item label="验收人：">
              <span>{{ props.row.acceptMan }}</span>
            </el-form-item>
            <el-form-item label="备注：">
              <span>{{ props.row.memo }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        label="签发单位">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        header-align="center"
        align="center"
        label="检查时间">
      </el-table-column>
      <el-table-column
        prop="actionDepartment"
        header-align="center"
        align="center"
        label="整改责任单位">
      </el-table-column>
      <el-table-column
        prop="actionTime"
        header-align="center"
        align="center"
        label="整改完成时间">
      </el-table-column>
      <el-table-column
        prop="acceptTime"
        header-align="center"
        align="center"
        label="验收时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 0" size="small">保存</span>
          <span v-else-if="scope.row.status === 1" size="small">已整改</span>
          <span v-else-if="scope.row.status === 2" size="small">已上报</span>
          <span v-else-if="scope.row.status === 3" size="small">已验收通过</span>
          <span v-else-if="scope.row.status === 4" size="small">验收未通过</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="lookHandle(scope.row.troubleId)">详情</el-button>
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
  import {treeDataTranslate} from '@/utils'
  import Look from './enterpriseTroubleWorkflow-look'

  export default {
    data () {
      return {
        dataForm: {
          checkTime: '',
          department: '',
          departmentName: '',
          actionDepartment: '',
          actionDepartmentName: '',
          actionTime: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
         lookVisible: false,
        //  企业单位
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    components: {Look},
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
          url: this.$http.adornUrl('/trouble/enterpriseTroubleStandingBook/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'checkTime': this.dataForm.checkTime,
            'department': this.dataForm.department,
            'actionDepartment': this.dataForm.actionDepartment,
            'actionTime': this.dataForm.actionTime
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
      // 签发单位树选中
      deptListTreeCurrentChangeHandle (data, node) {
        if (data.id == 0) {
          this.dataForm.department = ''
        } else {
          this.dataForm.department = data.id
        }
        this.dataForm.departmentName = data.name
      },
      //  签发单位设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.department)
        this.dataForm.departmentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      //  整改责任单位树选中
      deptListTreeCurrentChangeHandle1 (data, node) {
        if (data.id == 0) {
          this.dataForm.actionDepartment = ''
        } else {
          this.dataForm.actionDepartment = data.id
        }
        this.dataForm.actionDepartmentName = data.name
      },
      //  整改责任单位设置当前选中节点
      deptListTreeSetCurrentNode1 () {
        this.$refs.deptListTree1.setCurrentKey(this.dataForm.actionDepartment)
        this.dataForm.actionDepartmentName = (this.$refs.deptListTree1.getCurrentNode() || {})['name']
      },
      // 导出
      export2Excel () {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../../excel/Export2Excel')
          const tHeader = ['检查人', '签发单位', '检查时间', '隐患问题', '隐患分级', '临时控制措施', '整改责任单位', '责任人', '整改期限', '整改完成时间', '验收人', '验收时间', '备注']
          const filterVal = ['checkMan', 'department', 'checkTime', 'troubleDescription', 'troubleType', 'measure', 'actionDepartment', 'actionMan', 'timeAffirm', 'actionTime', 'acceptMan', 'acceptTime', 'memo']
          const list = this.dataList
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '事故隐患台账')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 详情
      lookHandle (id) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(id)
        })
      },
    }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    min-width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
