<template>
  <div class="mod-config">
    <el-row type="flex" class="row-title" justify="right">
      <el-col :span="8">
        <el-select v-model="enterpriseId" filterable placeholder="请选择" clearable @change="changeEnterprise"
                   @focus="getEnterpriseList()">
          <el-option
            v-for="item in enterpriseList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-tabs style="height:60px;" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first"></el-tab-pane>
      <el-tab-pane label="证照信息" name="second"></el-tab-pane>
      <el-tab-pane label="特种设备设施" name="third"></el-tab-pane>
      <el-tab-pane label="周边环境" name="four"></el-tab-pane>
      <el-tab-pane label="风险告知卡" name="five"></el-tab-pane>
      <el-tab-pane label="重大风险公告" name="six"></el-tab-pane>
      <el-tab-pane label="风险管控文件" name="seven"></el-tab-pane>
      <el-tab-pane label="四色分布图" name="eight"></el-tab-pane>
      <el-tab-pane label="安全作业比较图" name="nine"></el-tab-pane>
    </el-tabs>

    <first ref="first" v-show="showfirst"></first>
    <second ref="second" v-show="showsecond"></second>
    <third ref="third" v-show="showthird"></third>
    <four ref="four" v-show="showfour"></four>
    <five ref="five" v-show="showfive"></five>
    <six ref="six" v-show="showsix"></six>
    <seven ref="seven" v-show="showseven"></seven>
    <eight ref="eight" v-show="showeight"></eight>
    <nine ref="nine" v-show="shownine"></nine>
  </div>
</template>

<script>
  import first from './enterpriseInfo'
  import second from './enterpriseCretInfo'
  import third from './enterpriseSpecialInfo'
  import four from './enterprisPeripheryInfoMap'
  import five from './enterpriseRiskCardInfo'
  import six from './enterpriseRiskNoticeInfo'
  import seven from './enterpriseRiskPlanningInfo'
  import eight from './enterpriseSiSeTuInfo'
  import nine from './enterpriseAnQuanTuInfo'

  export default {
    data () {
      return {
        activeName: 'first',
        enterpriseList: [],
        enterpriseId: '',
        first: 'first',
        second: 'second',
        third: 'third',
        four: 'four',
        five: 'five',
        six: 'six',
        seven: 'seven',
        eight: 'eight',
        nine: 'nine',
        showfirst: true,
        showsecond: false,
        showthird: false,
        showfour: false,
        showfive: false,
        showsix: false,
        showseven: false,
        showeight: false,
        shownine: false,
        enterpriseName: '',
        x: '',
        y: '',
        dataRule: {}
      }
    },
    mounted () {
      this.getEnterpriseList()
    },
    components: {
      first,
      second,
      third,
      four,
      five,
      six,
      seven,
      eight,
      nine
    },
    methods: {
      getEnterpriseList () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.enterpriseList = data.list
            this.enterpriseId = this.enterpriseList[0].value
          } else {
            this.enterpriseList = []
          }
        }).then(() => {
          this.showfirst = true
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.currentView = first
          this.$nextTick(() => {
            this.$refs.first.init(this.enterpriseId)
          })
        })
      },
      handleClick (tab, event) {
        if (tab.label === '基本信息') {
          this.showfirst = true
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.first.init(this.enterpriseId)
          })
        } else if (tab.label === '证照信息') {
          this.showfirst = false
          this.showsecond = true
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.second.init(this.enterpriseId)
          })
        } else if (tab.label === '特种设备设施') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = true
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.third.init(this.enterpriseId)
          })
        } else if (tab.label === '周边环境') {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterpriseDetails/getEnterpriseInfoList'),
            method: 'get',
            params: this.$http.adornParams({eId: this.enterpriseId})
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (var z in data.list) {
                this.enterpriseName = data.list[z].enterpriseName
                this.x = data.list[z].mapX
                this.y = data.list[z].mapY
              }
            }
          }).then(() => {
            this.showfirst = false
            this.showsecond = false
            this.showthird = false
            this.showfour = true
            this.showfive = false
            this.showsix = false
            this.showseven = false
            this.showeight = false
            this.shownine = false
            this.currentView = four
            this.$nextTick(() => {
              this.$refs.four.init(this.enterpriseId, this.enterpriseName, this.x, this.y)
            })
          })
        } else if (tab.label === '风险告知卡') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = true
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.five.init(this.enterpriseId)
          })
        } else if (tab.label === '重大风险公告') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = true
          this.showseven = false
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.six.init(this.enterpriseId)
          })
        } else if (tab.label === '风险管控文件') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = true
          this.showeight = false
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.seven.init(this.enterpriseId)
          })
        } else if (tab.label === '四色分布图') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = true
          this.shownine = false
          this.$nextTick(() => {
            this.$refs.eight.init(this.enterpriseId)
          })
        } else if (tab.label === '安全作业比较图') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.showseven = false
          this.showeight = false
          this.shownine = true
          this.$nextTick(() => {
            this.$refs.nine.init(this.enterpriseId)
          })
        }
      },
      changeEnterprise () {
        this.enterpriseId = this.enterpriseId
        this.showfirst = true
        this.showsecond = false
        this.showthird = false
        this.showfour = false
        this.showfive = false
        this.showsix = false
        this.showseven = false
        this.showeight = false
        this.shownine = false
        this.currentView = first
        this.$nextTick(() => {
          this.$refs.first.init(this.enterpriseId)
        })
      }
    }
  }
</script>
