<template>
  <el-dialog
    :title="this.id?'详情':'详情'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="80%">
    <h4>风险点检查记录</h4>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading" @row-click="checkSelect"
      style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="departmentName" header-align="center" align="center" label="检查部门"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="检查人"></el-table-column>
      <el-table-column prop="checkTime" header-align="center" align="center" label="检查时间" width="160px"></el-table-column>
      <el-table-column prop="checkNum" header-align="center" align="center" label="检查班次">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkNum === 0" size="small">无班次</el-tag>
          <el-tag v-if="scope.row.checkNum === 1" size="small">班前</el-tag>
          <el-tag v-if="scope.row.checkNum === 2" size="small">班中</el-tag>
          <el-tag v-if="scope.row.checkNum === 3" size="small">班后</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="checkType" header-align="center" align="center" label="检查类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkType === 1" size="small">安全综合检查</el-tag>
          <el-tag v-if="scope.row.checkType === 2" size="small">专业安全检查</el-tag>
          <el-tag v-if="scope.row.checkType === 3" size="small">专项安全检查</el-tag>
          <el-tag v-if="scope.row.checkType === 4" size="small">日常检查</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="checkResult" header-align="center" align="center" label="检查结果">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkResult === 1" size="small">正常</el-tag>
          <el-tag v-if="scope.row.checkResult === 2" size="small">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="检查状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">无处理流程</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">异常处理中</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small">异常处理完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="troubleNum" header-align="center" align="center" label="隐患编号"></el-table-column>
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

    <el-tabs type="border-card">
      <el-tab-pane label="检查明细">
        <el-table
          :data="checkDataList" border v-loading="checkDataListLoading" style="width: 100%">
          <el-table-column prop="riskFactor" header-align="center" align="center" label="危险有害因素"></el-table-column>
          <el-table-column prop="riskType" header-align="center" align="center" label="事故伤害类型"></el-table-column>
          <el-table-column prop="riskResult" header-align="center" align="center" label="现场作业地点"></el-table-column>
          <el-table-column prop="doId" header-align="center" align="center" label="措施编号"></el-table-column>
          <el-table-column prop="riskDo" header-align="center" align="center" label="管控措施"></el-table-column>
          <el-table-column prop="effective" header-align="center" align="center" label="是否有效">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.effective === 1" size="small">无效</el-tag>
              <el-tag v-if="scope.row.effective === 0" size="small">有效</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="memo" header-align="center" align="center" label="说明"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="检查异常处理">
        <el-table
          :data="checkDoWfDataList" border v-loading="checkDoWfDataListLoading" style="width: 100%">
          <el-table-column prop="reqDepartmentName" header-align="center" align="center"
                           label="请求处理部门"></el-table-column>
          <el-table-column prop="reqName" header-align="center" align="center" label="请求处理人"></el-table-column>
          <el-table-column prop="reqTime" header-align="center" align="center" label="发出请求时间"></el-table-column>
          <el-table-column prop="reqDesc" header-align="center" align="center" label="请求描述"></el-table-column>
          <el-table-column prop="respDepartmentName" header-align="center" align="center"
                           label="处理部门"></el-table-column>
          <el-table-column prop="respName" header-align="center" align="center" label="处理人"></el-table-column>
          <el-table-column prop="respTime" header-align="center" align="center" label="处理时间"></el-table-column>
          <el-table-column prop="respDesc" header-align="center" align="center" label="处理结果描述"></el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="处理结果">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.effective === 0" size="small">待处理</el-tag>
              <el-tag v-if="scope.row.effective === 1" size="small">自己处理完成</el-tag>
              <el-tag v-if="scope.row.effective === 2" size="small">上报处理</el-tag>
              <el-tag v-if="scope.row.effective === 3" size="small">生成隐患</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="troubleNum" header-align="center" align="center" label="隐患编号"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="相关隐患信息">
        <div>
          <el-row type="flex" justify="center">
            <el-col :span="4"><span class="title">隐患编号:</span><span>{{dataForm.troubleNum}}</span></el-col>
            <el-col :span="4"><span class="title">隐患位置:</span><span>{{dataForm.troublePosition}}</span></el-col>
            <el-col :span="4"><span class="title">隐患描述:</span><span>{{dataForm.troubleDescr}}</span></el-col>
            <el-col :span="4"><span class="title">隐患类型:</span><span>{{dataForm.troubleType}}</span></el-col>
            <el-col :span="4"><span class="title">临时措施:</span><span>{{dataForm.measure}}</span></el-col>
            <el-col :span="4"><span class="title">责任单位:</span><span>{{dataForm.departmentName}}</span></el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="4"><span class="title">责任人:</span><span>{{dataForm.person}}</span></el-col>
            <el-col :span="4"><span class="title">检查单位:</span><span>{{dataForm.checkDepartmentName}}</span></el-col>
            <el-col :span="4"><span class="title">检查人:</span><span>{{dataForm.checkPerson}}</span></el-col>
            <el-col :span="4"><span class="title">检查类型:</span><span>{{dataForm.checkType}}</span></el-col>
            <el-col :span="4"><span class="title">检查时间:</span><span>{{dataForm.checkTime}}</span></el-col>
            <el-col :span="4"><span class="title">隐患状态:</span><span>{{dataForm.status}}</span></el-col>
          </el-row>
        </div>
        <el-table
          :data="troubleDoWfDataList" border v-loading="troubleDoWfDataListLoading" style="width: 100%">
          <el-table-column prop="actionDepartmentName" header-align="center" align="center"
                           label="整改部门"></el-table-column>
          <el-table-column prop="actionName" header-align="center" align="center" label="整改人"></el-table-column>
          <el-table-column prop="actionTime" header-align="center" align="center" label="整改完成时间"></el-table-column>
          <el-table-column prop="actionDesc" header-align="center" align="center" label="整改说明"></el-table-column>
          <el-table-column prop="reportTime" header-align="center" align="center" label="隐患上报时间"></el-table-column>
          <el-table-column prop="reportDesc" header-align="center" align="center" label="上报说明"></el-table-column>
          <el-table-column prop="acceptDepartmentName" header-align="center" align="center"
                           label="验收部门"></el-table-column>
          <el-table-column prop="acceptName" header-align="center" align="center" label="验收人"></el-table-column>
          <el-table-column prop="acceptTime" header-align="center" align="center" label="验收时间"></el-table-column>
          <el-table-column prop="acceptDesc" header-align="center" align="center" label="验收说明"></el-table-column>
          <el-table-column prop="memo" header-align="center" align="center" label="备注"></el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small">保存</el-tag>
              <el-tag v-if="scope.row.status === 1" size="small">已整改</el-tag>
              <el-tag v-if="scope.row.status === 2" size="small">已上报</el-tag>
              <el-tag v-if="scope.row.status === 3" size="small">已验收通过</el-tag>
              <el-tag v-if="scope.row.status === 4" size="small">验收未通过</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        id: '',

        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],

        checkDataList: [],
        checkDataListLoading: false,
        checkDoWfDataList: [],
        checkDoWfDataListLoading: false,

        dataForm: {
          troubleId: '',
          troubleNum: '',
          troublePosition: '',
          troubleDescr: '',
          troubleType: '',
          measure: '',
          departmentName: '',
          person: '',
          checkDepartmentName: '',
          checkPerson: '',
          checkType: '',
          checkTime: '',
          status: ''
        },

        troubleDataList: [],
        troubleDataListLoading: false,
        troubleDoWfDataList: [],
        troubleDoWfDataListLoading: false

      }
    },
    methods: {
      init(pid) {
        this.id = pid || 0
        this.visible = true
        this.$nextTick(() => {
          this.getDataList()
        })
      },

      getDataList () {
        this.dataList = []
        this.checkDataList = []
        this.checkDoWfDataList = []
        this.troubleDataList = []
        this.troubleDoWfDataList = []
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointCheckList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'pointId': this.id
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
      checkSelect(row, event, column) {
        this.checkDataList = []
        this.checkDoWfDataList = []
        this.troubleDataList = []
        this.troubleDoWfDataList = []

        this.dataForm.troubleNum = ''
        this.dataForm.troublePosition = ''
        this.dataForm.troubleDescr = ''
        this.dataForm.troubleType = ''
        this.dataForm.measure = ''
        this.dataForm.departmentName = ''
        this.dataForm.person = ''
        this.dataForm.checkDepartmentName = ''
        this.dataForm.checkPerson = ''
        this.dataForm.checkType = ''
        this.dataForm.checkTime = ''
        this.dataForm.status = ''

        var checkId = row.id
        if (checkId !== '' && checkId !== 'undefined') {
          this.getCheckDetailList(checkId)
          this.getCheckDoWfList(checkId)
        }
        var troubleId = row.troubleNum
        if (troubleId !== '' && troubleId !== 'undefined') {
          this.getTroubleInfo(troubleId)
          this.getTroubleDoWfList(troubleId)
        }
      },
      getCheckDetailList (checkId) {
        this.checkDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointCheckDetailList'),
          method: 'get',
          params: this.$http.adornParams({'checkId': checkId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.checkDataList = data.page
          } else {
            this.checkDataList = []
          }
          this.checkDataListLoading = false
        })
      },
      getCheckDoWfList (checkId) {
        this.checkDoWfDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointCheckDoWfList'),
          method: 'get',
          params: this.$http.adornParams({'checkId': checkId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.checkDoWfDataList = data.page
            for (var x in this.checkDoWfDataList) {
              var troubleNum = this.checkDoWfDataList[x].troubleNum
              if (troubleNum && troubleNum !== '') {
                this.getTroubleInfo(troubleNum)
                this.getTroubleDoWfList(troubleNum)
              }
            }
          } else {
            this.checkDoWfDataList = []
          }
          this.checkDoWfDataListLoading = false
        })
      },
      getTroubleInfo (troubleNum) {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointTroubleInfo'),
          method: 'get',
          params: this.$http.adornParams({'troubleNum': troubleNum})
        }).then(({data}) => {
          if (data && data.code === 0) {
            var page = data.page[0]
            this.dataForm.troubleNum = page.troubleNum
            this.dataForm.troublePosition = page.troublePosition
            this.dataForm.troubleDescr = page.troubleDescr
            var trType = data.page[0].troubleType
            if (trType === 1) this.dataForm.troubleType = '一般隐患'
            if (trType === 2) this.dataForm.troubleType = '重大隐患'
            this.dataForm.measure = page.measure
            this.dataForm.departmentName = page.departmentName
            this.dataForm.person = page.person
            this.dataForm.checkDepartmentName = page.checkDepartmentName
            this.dataForm.checkPerson = page.checkPerson
            var chType = data.page[0].checkType
            if (chType === 1) this.dataForm.checkType = '安全综合检查'
            if (chType === 2) this.dataForm.checkType = '专业安全检查'
            if (chType === 3) this.dataForm.checkType = '专项安全检查'
            if (chType === 4) this.dataForm.checkType = '日常检查'
            if (chType === 5) this.dataForm.checkType = '自主管理'
            if (chType === 6) this.dataForm.checkType = '风险日常检查'
            this.dataForm.checkTime = page.checkTime
            var status = data.page[0].status
            if (status === 0) this.dataForm.status = '保存'
            if (status === 1) this.dataForm.status = '待整改'
            if (status === 2) this.dataForm.status = '待验收'
            if (status === 3) this.dataForm.status = '整改完成'
          }
        })
      },
      getTroubleDoWfList (troubleNum) {
        this.troubleDoWfDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointTroubleDoWf'),
          method: 'get',
          params: this.$http.adornParams({'troubleNum': troubleNum})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleDoWfDataList = data.page
          } else {
            this.troubleDoWfDataList = []
          }
          this.troubleDoWfDataListLoading = false
        })
      }
    }
  }
</script>
