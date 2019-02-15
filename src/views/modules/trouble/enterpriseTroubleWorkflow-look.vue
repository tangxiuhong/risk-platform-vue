<template>
  <div>
    <el-dialog
      :title="'流程列表'"
      :close-on-click-modal="false"
      :visible.sync="visible" width="80%">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="actionDepartmentName"
          header-align="center"
          align="center"
          label="整改部门">
        </el-table-column>
        <el-table-column
          prop="actionManName"
          header-align="center"
          align="center"
          label="整改人">
        </el-table-column>
        <el-table-column
          prop="actionTime"
          header-align="center"
          align="center"
          label="整改时间">
        </el-table-column>
        <el-table-column
          prop="actionDescription"
          header-align="center"
          align="center"
          label="整改描述">
        </el-table-column>
        <el-table-column
          prop="reportTime"
          header-align="center"
          align="center"
          label="上报时间">
        </el-table-column>
        <el-table-column
          prop="reportDescription"
          header-align="center"
          align="center"
          label="上报描述">
        </el-table-column>
        <el-table-column
          prop="acceptDepartmentName"
          header-align="center"
          align="center"
          label="验收部门">
        </el-table-column>
        <el-table-column
          prop="acceptManName"
          header-align="center"
          align="center"
          label="验收人">
        </el-table-column>
        <el-table-column
          prop="acceptTime"
          header-align="center"
          align="center"
          label="验收时间">
        </el-table-column>
        <el-table-column
          prop="acceptDescription"
          header-align="center"
          align="center"
          label="验收描述">
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status=== 0">保存</span>
            <span v-else-if="scope.row.status === 1">已整改</span>
            <span v-else-if="scope.row.status=== 2">已上报</span>
            <span v-else-if="scope.row.status === 3">验收通过</span>
            <span v-else-if="scope.row.status === 4">验收未通过</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="lookHandle(scope.row.id,scope.row.troubleRdId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 弹窗 -->
    <detail v-if="detailVisible" ref="detail" @refreshDataList="getDataList"></detail>
  </div>
</template>

<script>
  import Detail from './enterpriseTroubleWorkflow-detail'

  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        troubleRdId: '',
        dataList: [],
        dataListLoading: false,
        detailVisible: false,
        visible: false
      }
    },
    components: {
      Detail
    },
    activated () {
      this.getDataList()
    },
    methods: {
      init (id) {
        this.troubleRdId = id;
        this.visible = true;
        this.$nextTick(() => {
          this.getDataList();
        })
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroubleWorkflow/listWorkflow/' + this.troubleRdId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 详情
      lookHandle (id, troubleRdId) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.init(id, troubleRdId);
        })
      }
    }
  }
</script>
