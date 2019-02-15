<template>
  <el-dialog
    :title="'详情'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="80%">
    <div class="mod-config">
      <el-row>
        <el-col :span="6">
          <p>风险单元：{{dataForm.riskUnit}}</p>
        </el-col>
        <el-col :span="6">
          <p>风险点：{{dataForm.riskPoint}}</p>
        </el-col>
      </el-row>

      <el-tabs type="border-card">
        <el-tab-pane label="检查明细">
          <el-table
            :data="checkDataList"
            border
            v-loading="checkDataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="checkTime"
              header-align="center"
              align="center"
              label="检查时间">
            </el-table-column>
            <el-table-column
              prop="riskFactor"
              header-align="center"
              align="center"
              label="危害因素">
            </el-table-column>
            <el-table-column
              prop="riskDo"
              header-align="center"
              align="center"
              label="管控措施">
            </el-table-column>
            <el-table-column
              prop="effective"
              header-align="center"
              align="center"
              label="管控措施状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.effective === 0" size="small">生效</el-tag>
                <el-tag v-if="scope.row.effective === 1" size="small" type="danger">未生效</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="memo"
              header-align="center"
              align="center"
              label="管控措施检查说明">
            </el-table-column>
            <el-table-column
              prop="checkType"
              header-align="center"
              align="center"
              label="检查类型">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.checkType === 1" size="small">安全综合检查</el-tag>
                <el-tag v-if="scope.row.checkType === 2" size="small">专业安全检查</el-tag>
                <el-tag v-if="scope.row.checkType === 3" size="small">专项安全检查</el-tag>
                <el-tag v-if="scope.row.checkType === 4" size="small">日常检查</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkNum"
              header-align="center"
              align="center"
              label="检查班次">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.checkNum === 0" size="small">不区分班次</el-tag>
                <el-tag v-if="scope.row.checkNum === 1" size="small">班前</el-tag>
                <el-tag v-if="scope.row.checkNum === 2" size="small">班中</el-tag>
                <el-tag v-if="scope.row.checkNum === 3" size="small">班后</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="troubleNum"
              header-align="center"
              align="center"
              label="处理过程中产生的隐患编号">
            </el-table-column>
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
                <el-tag v-if="scope.row.status === 0" size="small">待处理</el-tag>
                <el-tag v-if="scope.row.status === 1" size="small">自己处理完成</el-tag>
                <el-tag v-if="scope.row.status === 2" size="small">上报处理</el-tag>
                <el-tag v-if="scope.row.status === 3" size="small">生成隐患</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="troubleNum" header-align="center" align="center" label="隐患编号"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="相关隐患信息">
          <div>
            <el-row type="flex" justify="center">
              <el-col :span="4"><span class="title">隐患编号:</span><span>{{troubleInfo.troubleNum}}</span></el-col>
              <el-col :span="4"><span class="title">隐患位置:</span><span>{{troubleInfo.troublePosition}}</span></el-col>
              <el-col :span="4"><span class="title">隐患描述:</span><span>{{troubleInfo.troubleDescr}}</span></el-col>
              <el-col :span="4"><span class="title">隐患类型:</span><span>{{troubleInfo.troubleType}}</span></el-col>
              <el-col :span="4"><span class="title">临时措施:</span><span>{{troubleInfo.measure}}</span></el-col>
              <el-col :span="4"><span class="title">责任单位:</span><span>{{troubleInfo.departmentName}}</span></el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="4"><span class="title">责任人:</span><span>{{troubleInfo.person}}</span></el-col>
              <el-col :span="4"><span class="title">检查单位:</span><span>{{troubleInfo.checkDepartmentName}}</span>
              </el-col>
              <el-col :span="4"><span class="title">检查人:</span><span>{{troubleInfo.checkPerson}}</span></el-col>
              <el-col :span="4"><span class="title">检查类型:</span><span>{{troubleInfo.checkType}}</span></el-col>
              <el-col :span="4"><span class="title">检查时间:</span><span>{{troubleInfo.checkTime}}</span></el-col>
              <el-col :span="4"><span class="title">隐患状态:</span><span>{{troubleInfo.status}}</span></el-col>
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
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: '',
          riskUnit: '',
          riskPoint: ''
        },

        checkId: '',
        troubleNum: '',

        troubleInfo: {
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
        checkDataList: [],
        checkDataListLoading: false,

        checkDoWfDataList: [],
        checkDoWfDataListLoading: false,

        troubleDataList: [],
        troubleDataListLoading: false,

        troubleDoWfDataList: [],
        troubleDoWfDataListLoading: false
      }
    },
    components: {},
    methods: {
      init(id, riskUnit, riskPoint) {
        this.dataForm.riskUnit = riskUnit
        this.dataForm.riskPoint = riskPoint
        this.dataForm.id = id
        this.visible = true

        this.checkDataList = []
        this.checkDoWfDataList = []
        this.troubleDataList = []
        this.troubleDoWfDataList = []
        this.troubleInfo.troubleNum = ''
        this.troubleInfo.troublePosition = ''
        this.troubleInfo.troubleDescr = ''
        this.troubleInfo.troubleType = ''
        this.troubleInfo.measure = ''
        this.troubleInfo.departmentName = ''
        this.troubleInfo.person = ''
        this.troubleInfo.checkDepartmentName = ''
        this.troubleInfo.checkPerson = ''
        this.troubleInfo.checkType = ''
        this.troubleInfo.checkTime = ''
        this.troubleInfo.status = ''


        this.$nextTick(() => {
          this.getCheckInfoByPointId()
        })
      },
      // 通过pointID查询最近一条风险检查信息
      getCheckInfoByPointId() {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessCheck/getNowCheckInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'riskPointId': this.dataForm.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.checkId = data.dataMap.id
            this.troubleNum = data.dataMap.trNum
            if (this.checkId && this.checkId !== '') {
              this.getCheckDetailList(this.checkId)
              this.getCheckDoWfList(this.checkId)
            }
            if (this.troubleNum && this.troubleNum !== '' ) {
              this.getTroubleInfo(this.troubleNum)
              this.getTroubleDoWfList(this.troubleNum)
            }
          }
        })
      },
      getCheckDetailList(checkId) {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointCheckDetailList'),
          method: 'get',
          params: this.$http.adornParams({'checkId': checkId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.checkDataList = data.page
          }
        })
      },
      getCheckDoWfList(checkId) {
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
        })
      },
      getTroubleInfo(troubleNum) {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointTroubleInfo'),
          method: 'get',
          params: this.$http.adornParams({'troubleNum': troubleNum})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleInfo.troubleNum = data.page[0].troubleNum
            this.troubleInfo.troublePosition = data.page[0].troublePosition
            this.troubleInfo.troubleDescr = data.page[0].troubleDescr
            var trType = data.page[0].troubleType
            if (trType === 1) this.troubleInfo.troubleType = '一般隐患'
            if (trType === 2) this.troubleInfo.troubleType = '重大隐患'

            this.troubleInfo.measure = data.page[0].measure
            this.troubleInfo.departmentName = data.page[0].departmentName
            this.troubleInfo.person = data.page[0].person
            this.troubleInfo.checkDepartmentName = data.page[0].checkDepartmentName
            this.troubleInfo.checkPerson = data.page[0].checkPerson
            var chType = data.page[0].checkType
            if (chType === 1) this.troubleInfo.checkType = '安全综合检查'
            if (chType === 2) this.troubleInfo.checkType = '专业安全检查'
            if (chType === 3) this.troubleInfo.checkType = '专项安全检查'
            if (chType === 4) this.troubleInfo.checkType = '日常检查'
            if (chType === 5) this.troubleInfo.checkType = '自主管理'
            if (chType === 6) this.troubleInfo.checkType = '风险日常检查'

            this.troubleInfo.checkTime = data.page[0].checkTime
            var status = data.page[0].status
            if (status === 0) this.troubleInfo.status = '保存'
            if (status === 1) this.troubleInfo.status = '待整改'
            if (status === 2) this.troubleInfo.status = '待验收'
            if (status === 3) this.troubleInfo.status = '整改完成'
          }
        })
      },
      getTroubleDoWfList(troubleNum) {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessRisklocation/userRiskPointTroubleDoWf'),
          method: 'get',
          params: this.$http.adornParams({'troubleNum': troubleNum})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleDoWfDataList = data.page
          }
        })
      }
    }
  }
</script>
<style>
  .title {
    font-size: 1em;
    font-weight: bold;
  }
</style>

