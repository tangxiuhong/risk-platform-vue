<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.planNo" clearable placeholder="安全检查任务编号" filterable>
          <el-option
            v-for="item in planIdOptions"
            :key="item.planNo"
            :label="item.planNo"
            :value="item.planNo">
          </el-option>
        </el-select>
        <el-input v-model="dataForm.troubleNum" style="width:200px;" placeholder="隐患编号" clearable></el-input>
        <el-select v-model="dataForm.checkType" clearable placeholder="安全检查类型" filterable>
          <el-option
            v-for="item in checkTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

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
          <el-input v-model="dataForm.departmentName" v-popover:deptListPopover placeholder="点击选择责任单位"
                    class="menu-list__input" filterable clearable></el-input>
        </el-form-item>

        <el-select v-model="dataForm.troubleType" clearable placeholder="隐患分级" filterable>
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
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="隐患问题：">
              <span>{{ props.row.troubleDescription }}</span>
            </el-form-item>
            <el-form-item label="检查单位：">
              <span>{{ props.row.checkDepartmentName }}</span>
            </el-form-item>
            <el-form-item label="检查人：">
              <span>{{ props.row.checkManName }}</span>
            </el-form-item>
            <el-form-item label="检查时间：">
              <span>{{ props.row.checkTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="planNo"
        header-align="center"
        align="center"
        label="安全检查编号">
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
        label="检查类型">
        <template slot-scope="scope">
          <span v-if="scope.row.checkType=== 1">安全综合检查</span>
          <span v-else-if="scope.row.checkType === 2">专业安全检查</span>
          <span v-else-if="scope.row.checkType=== 3">专项安全检查</span>
          <span v-else-if="scope.row.checkType === 4">日常检查</span>
          <span v-else-if="scope.row.checkType === 5">自主管理</span>
          <span v-else-if="scope.row.checkType === 6">风险日常检查</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="责任单位">
      </el-table-column>
      <el-table-column
        prop="troubleType"
        header-align="center"
        align="center"
        label="隐患级别">
        <template slot-scope="scope">
          <span v-if="scope.row.troubleType=== 1">一般隐患</span>
          <span v-else-if="scope.row.troubleType === 2">重大隐患</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="隐患状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 0">保存</span>
          <span v-else-if="scope.row.status === 1">待整改</span>
          <span v-else-if="scope.row.status=== 2">待验收</span>
          <span v-else-if="scope.row.status=== 3">整改完成</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">

          <el-button v-if="isAuth('trouble/enterpriseTroubleWorkflow/updateForAction') && scope.row.status === 1"
                     type="text" size="small" @click="actionHandle(scope.row.id)">整改
          </el-button>
          <el-button v-if="isAuth('trouble/enterpriseTroubleWorkflow/updateForAccept') && scope.row.status === 2"
                     type="text" size="small" @click="acceptHandle(scope.row.id)">验收
          </el-button>
          <el-button type="text" size="small" @click="lookHandle(scope.row.id)">详情</el-button>
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
    <action v-if="actionVisible" ref="action" @refreshDataList="getDataList"></action>
    <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="getDataList"></look>
    <!-- 弹窗,详情 -->
    <accept v-if="acceptVisible" ref="accept" @refreshDataList="getDataList"></accept>
  </div>
</template>

<script>
  import Action from './enterpriseTroubleWorkflow-action'
  import Accept from './enterpriseTroubleWorkflow-accept'
  import Look from './enterpriseTroubleWorkflow-look'

  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        planIdOptions: [],
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
        }],
        troubleTypeOptions: [{
          value: '1',
          label: '一般隐患'
        }, {
          value: '2',
          label: '重大隐患'
        }],
        dataForm: {
          planNo: '',
          troubleNum: '',
          checkType: '',
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

        actionVisible: false,
        acceptVisible: false,
        lookVisible: false,

        //  企业单位
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    components: {
      Action,
      Accept,
      Look
    },
    activated () {
      this.getDataList(),
        this.getPlanNo(),
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

      //  责任单位设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.department)
        this.dataForm.departmentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 责任单位树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.department = data.id
        this.dataForm.departmentName = data.name
      },


      // 安全检查任务编号
      getPlanNo () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getPlanNo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.planIdOptions = data.dataList
          }
        })
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'planNo': this.dataForm.planNo,
            'troubleNum': this.dataForm.troubleNum,
            'checkType': this.dataForm.checkType,
            'departmentName': this.dataForm.departmentName,
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
      // 整改
      actionHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/enterpriseTroublInfo`),
          method: 'get',
          params: this.$http.adornParams({id: id})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            var status = data.list.status;
            if (status == 1) {
              this.actionVisible = true;
              this.$nextTick(() => {
                this.$refs.action.init(id)
              })
            } else {
              this.$message({
                message: '状态已改变，请刷新数据！', type: 'success', duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }
          }
        })
      },
      //验收
      acceptHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/enterpriseTroublInfo`),
          method: 'get',
          params: this.$http.adornParams({id: id})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            var status = data.list.status;
            if (status == 2) {
              this.acceptVisible = true;
              this.$nextTick(() => {
                this.$refs.accept.init(id)
              })
            } else {
              this.$message({
                message: '状态已改变，请刷新数据！', type: 'success', duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }
          }
        })
      },

      // 详情
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
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroubleworkflow/delete'),
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
