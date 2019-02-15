<template>
  <div >
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="num"
        label="序号"
       >
      </el-table-column>
      <el-table-column
        prop="riskPoint"
        label="风险点">
      </el-table-column>
      <el-table-column
        prop="riskType"
        label="风险类型">
      </el-table-column>
      <el-table-column
        prop="result"
        label="造成的后果">
      </el-table-column>
      <el-table-column
        prop="measure"
        label="风险管控措施"
        width="300">
      </el-table-column>
      <el-table-column
        prop="check"
        label="审核要素及赋值"
        width="380">
      </el-table-column>
      <el-table-column
        prop="rate"
        label="权重">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" style="margin-top:30px;text-align:center;">
      <el-button type="primary" >提交</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [{
          num: '一',
          riskPoint: '采矿单元',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1',
          riskPoint: '提升系统',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '提升机操作岗位',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '1.操作工未培训，无证上岗\n' +
          '2.提升机操作证书逾期或失效\n' +
          '3.无岗位操作规程和岗位风险公告\n' +
          '4.存在或曾出现“三违”现象' +
          '触电 人员伤亡 严格执行岗位操作规程' +
          '物体打击 人员伤亡 严格执行岗位操作规程' +
          '噪声 职业伤害 严格执行岗位操作规程',
          rate: '',
          rownum: 4
        }, {
          num: '1.1',
          riskPoint: '',
          riskType: '触电',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '1.1',
          riskPoint: '',
          riskType: '物体打击',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '1.1',
          riskPoint: '',
          riskType: '噪声',
          result: '职业伤害',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '1.2',
          riskPoint: '提升机维修保养岗位',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '1.提升机未定期进行安全检测检验\n' +
          '2.提升机未定期进行维护保养\n' +
          '3.无维护保养规程和记录\n' +
          '4.未定期检查提升机及系统\n' +
          '5.近一年内曾发生提升事故\n',
          rate: '',
          rownum: 4
        }, {
          num: '',
          riskPoint: '',
          riskType: '触电',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '高处坠落',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '物体打击',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '2',
          riskPoint: '运输系统',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '2.1',
          riskPoint: '有轨电、机车',
          riskType: '触电',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '1.使用架线电机车\n' +
          '2.使用蓄电池电机车\n' +
          '3.使用柴油机车\n' +
          '4.架线电机车滑触线设置不符合规程\n' +
          '5.属于淘汰落后设备',
          rate: '',
          rownum: 4
        }, {
          num: '',
          riskPoint: '',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '物体打击',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '车辆伤害',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '二',
          riskPoint: '选矿单元',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1',
          riskPoint: '破碎系统',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '破碎机',
          riskType: '噪声、振动',
          result: '职业伤害',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '1.设计、安装、验收不符合标准规定\n' +
          '2.安全保护装置或措施不完善\n' +
          '3.未定期检查、维护和保养\n' +
          '4.未悬挂破碎机操作规程',
          rate: '',
          rownum: 4
        }, {
          num: '',
          riskPoint: '',
          riskType: '粉尘',
          result: '职业伤害',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '物体打击',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '2',
          riskPoint: '球磨系统',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '2.1',
          riskPoint: '球磨机',
          riskType: '噪声、振动',
          result: '职业伤害',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '1.设计、安装、验收不符合标准规定\n' +
          '2.安全保护装置或措施不完善\n' +
          '3.未定期检查、维护和保养\n' +
          '4.未悬挂球磨机操作规程',
          rate: '',
          rownum: 3
        }, {
          num: '',
          riskPoint: '',
          riskType: '粉尘',
          result: '职业伤害',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '三',
          riskPoint: '尾矿库单元',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1',
          riskPoint: '尾矿库建设',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '尾矿输送设备',
          riskType: '溃坝/坍塌',
          result: '人员伤亡、财产损失',
          measure: '检查、维护、监测，完善安全保护装置或设施',
          check: '1.设计、安装、验收不符合标准规定\n' +
          '2.安全保护装置或措施不完善\n' +
          '3.未定期检查、维护和保养\n' +
          '4.未悬挂设备操作规程',
          rate: '',
          rownum: 0
        }, {
          num: '2',
          riskPoint: '尾矿库管理',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '2.1',
          riskPoint: '安全生产管理',
          riskType: '溃坝、坍塌',
          result: '人员伤亡、财产损失',
          measure: '建立管理制度，拟定管理维护计划，做好日 常巡检和定期观测，制定有应急救援预',
          check: '1.未成立管理机构\n' +
          '2.未制定有管理制度\n' +
          '3.无日常巡检和定期观测\n' +
          '4.无应急救援预案\n' +
          '5.未做专项安全评价\n' +
          '6.无工程档案',
          rate: '',
          rownum: 0
        }, {
          num: '四',
          riskPoint: '排土场单元',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1',
          riskPoint: '排土场系统',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '排土场',
          riskType: '坍塌',
          result: '人员伤亡、财产损失',
          measure: '检查、维护、监测，完善安全保护装置或设施',
          check: '1.设计、安装、验收不符合标准规定\n' +
          '2.安全保护装置或设施不完善\n' +
          '3.未定期监测、检查、维护和保养\n' +
          '4.未建立有在线监测系统',
          rate: '',
          rownum: 0
        }, {
          num: '1.2',
          riskPoint: '推土机',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '1.安全保护措施或装置不完善\n' +
          '3.为定期检查、维护和保养\n' +
          '4.无设备操作规程',
          rate: '',
          rownum: 3
        }, {
          num: '',
          riskPoint: '',
          riskType: '噪声、振动',
          result: '职业伤害',
          measure: '检查、维护保养，完善安全保护装置或设施',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '粉尘',
          result: '职业伤害',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '2',
          riskPoint: '排土场管理',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '2.1',
          riskPoint: '安全管理',
          riskType: '坍塌',
          result: '人员伤亡、财产损失',
          measure: '理制度，拟定管理维护计划，做好日 常巡检和定期观测，制定有应急救援预案',
          check: '1.未成立管理机构\n' +
          '2.未制定有管理制度\n' +
          '3.无日常巡检和定期观测\n' +
          '4.无应急救援预案',
          rate: '',
          rownum: 0
        }, {
          num: '五',
          riskPoint: '辅助系统单元',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1',
          riskPoint: '化验室',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '化验室',
          riskType: '灼烫',
          result: '人员伤亡',
          measure: '检查、维护、监测、完善安全保护装置和设施，做好安全管理',
          check: '1.未制定安全管理制度\n' +
          '2.未悬挂安全作业规程\n' +
          '3.未建立安全保护装置和设施\n' +
          '4.未按要求做好化学品和试剂的管理\n' +
          '5.未按要求配备消防安全设施\n' +
          '6.未建立应急救援预案或措施',
          rate: '',
          rownum: 4
        }, {
          num: '',
          riskPoint: '',
          riskType: '火灾',
          result: '人员伤亡',
          measure: '检查、维护、监测、完善安全保护装置和设施，做好安全管理',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '爆炸',
          result: '人员伤亡',
          measure: '检查、维护、监测、完善安全保护装置和设施，做好安全管理',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '中毒',
          result: '人员伤亡',
          measure: '检查、维护、监测、完善安全保护装置和设施，做好安全管理',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '2.2',
          riskPoint: '电工岗位',
          riskType: '机械伤害',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '1.无岗位操作规程和风险告知\n' +
          '2.未培训合格上岗\n' +
          '3.存在或曾出现“三违”现象',
          rate: '',
          rownum: 3
        }, {
          num: '',
          riskPoint: '',
          riskType: '触电',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '',
          riskPoint: '',
          riskType: '高处坠落',
          result: '人员伤亡',
          measure: '严格执行岗位操作规程',
          check: '',
          rate: '',
          rownum: 1
        }, {
          num: '六',
          riskPoint: '安全生产标准化',
          riskType: '',
          result: '',
          measure: '',
          check: '',
          rate: '修正系数',
          rownum: 0
        }, {
          num: '1.1',
          riskPoint: '企业安全生产标准化',
          riskType: '',
          result: '',
          measure: '未建立安全生产标准化修正系数为 ',
          check: '1.企业未建立安全生产标准化',
          rate: '',
          rownum: 0
        }, {
          num: '1.2',
          riskPoint: '安全生产标准化等级',
          riskType: '',
          result: '',
          measure: '建立安全生产标准化后，三级为 0.9；二级' +
          '为 0.8；一级为 0.7.' +
          '同时建立两项标准化，修正系数取最小值',
          check: '1.地下矿山安全生产标准化（ ）级\n' +
          '2.选矿厂安全生产标准化（ ）级\n' +
          '3.尾矿库安全生产标准化（ ）级',
          rate: '三级 0.9\n' +
          '二级 0.8\n' +
          '一级 0.7',
          rownum: 0
        }]
      }
    },
    components: {
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (row.rownum === 0) {
          return {
            rowspan: 1,
            colspan: 1
          }
        } else if (row.rownum !== 1) {
          if (columnIndex === 1 || columnIndex === 2 || columnIndex === 6 || columnIndex === 7) {
            return {
              rowspan: row.rownum,
              colspan: 1
            }
          }
        } else {
          if (columnIndex === 1 || columnIndex === 2 || columnIndex === 6 || columnIndex === 7) {
            return {
              rowspan: 0,
              colspan: 1
            }
          }
        }
      }
    }
  }
</script>
<style>
  .el-table .cell {
    white-space: pre-line;
  }
</style>

