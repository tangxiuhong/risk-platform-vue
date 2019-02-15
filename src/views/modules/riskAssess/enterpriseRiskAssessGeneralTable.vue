<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

      <el-form-item>
        <el-select v-model="dataForm.riskUnit" clearable filterable placeholder="风险单元" @change=riskUnitChange()>
          <template v-for="risks in riskUnitList">
            <el-option :value="risks.riskUnit" v-bind:key="risks.id">{{risks.riskUnit}}</el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.riskpointId" clearable filterable placeholder="风险点">
          <el-option
            v-for="item in riskPointList"
            :key="item.id"
            :label="item.riskPoint"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-for="item in riskUnits" v-bind:key="item.keyId">
      <h4 v-html="item.head"></h4>
      <el-table
      :data="item.body" 
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column prop="riskUnitNo" label="序号" width="40"></el-table-column>
      <el-table-column prop="checkNum" label="作业活动" width="50"></el-table-column>
      <el-table-column prop="riskFactor" label="危害因素"></el-table-column>

      <el-table-column prop="riskDo" label="预防措施"></el-table-column>
      <el-table-column prop="riskType" label="伤害类型"></el-table-column>
      <el-table-column prop="riskFactorResult" label="作业地点" width="120"></el-table-column>

      <el-table-column prop="riskProbability" label="L" width="40"></el-table-column>
      <el-table-column prop="riskSeverity" label="E" width="40"></el-table-column>
      <el-table-column prop="riskDegree" label="C" width="40"></el-table-column>
      <el-table-column prop="riskValue" label="D" width="60"></el-table-column>

      <el-table-column prop="riskLevel" label="风险等级" width="60">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.riskLevel === 1" size="small">一</el-tag>
          <el-tag v-if="scope.row.riskLevel === 2" size="small">二</el-tag>
          <el-tag v-if="scope.row.riskLevel === 3" size="small">三</el-tag>
          <el-tag v-if="scope.row.riskLevel === 4" size="small">四</el-tag>
          <el-tag v-if="scope.row.riskLevel === 5" size="small">五</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factorType" label="类型" width="60"></el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
  
  export default {
    data () {
      return {
        riskUnitList:[],
        riskPointList: [],
        riskUnits: [],
        dataForm: {
          riskUnit: '',
          riskpointId: ''
        }
      }
    },
    components: {
      
    },
    activated () {
      this.initAssessUnitList()
    },
    methods: {
       initAssessUnitList() {
        var assessNo = 'cctk20180917145059'
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessUnit/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams(
            {'assessNo': assessNo}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.list
            this.dataForm.riskUnit = data.list[0].riskUnit
            this.riskUnitChange()
            this.getDataList()
          }
        })
      },
      // 当风险单元改变时
      riskUnitChange() {
        this.dataForm.riskpointId = ''
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/listRiskUnitByRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({'riskUnit': this.dataForm.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.list
          }
        })
      },
      initPointList() {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactor/listRiskUnitByRiskUnit`),
          method: 'get',
          params: this.$http.adornParams({'riskUnit': this.dataForm.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.list
          }
        })
      },
      getDataList()
      {
        this.$http({
          url: this.$http.adornUrl('/riskAssess/enterpriseRiskAssessGeneralTable/list'),
          method: 'get',
          params: this.$http.adornParams({
            'unitId': this.dataForm.riskUnit,
            'pointId': this.dataForm.riskpointId}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnits = data.page;
          } else {
            this.riskUnits = [];
          }
        })
      }
    }
  }
</script>
