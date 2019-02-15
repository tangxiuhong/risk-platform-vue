<template>
  <div class="gbDiv">
    <el-row class="row-title">
      <el-col :span="8">
        <el-select v-model="enterpriseId" placeholder="请选择" @change="changeEnterprise" style="margin: 10px;">
          <el-option
            v-for="item in enterpriseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <!-- <span style="float: left">{{ item.name }}</span>
             <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>-->
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <h2 class="risk-title">企业自动风险态势图</h2>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="colBottom">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>{{industryName}}</span>
          </div>
          <div class="text">
            <template v-if="riskLevel == 0">
              <div style="color:red; background: rgba(255,0,0,.25);">重大风险</div>
            </template>
            <template v-if="riskLevel == 1">
              <div style="color:red; background: rgba(255,0,0,.25);">重大风险</div>
            </template>
            <template v-if="riskLevel == 2">
              <div style="color:yellow; background: rgba(255,255,0,.25);">较大风险</div>
            </template>
            <template v-if="riskLevel == 3">
              <div style="color:green; background: rgba(0,128,0,.25);">一般风险</div>
            </template>
            <template v-if="riskLevel == 4">
              <div style="color:blue; background: rgba(0,0,255,.25);">较低风险</div>
            </template>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>综合风险</span>
          </div>
          <div id="allRiskDataBar" class="allRiskDataCls"></div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>监测预警</span>
          </div>
          <div class="realRiskDataCls">
            <div id="realRiskDataBar"></div>
            <div style="height:45px;line-height:45px;text-align: center;">
              <el-tag type="info" color="orange" style="color:#444">实时监测&nbsp;&nbsp;{{realRiskTotalCount}}</el-tag>
              <el-tag type="info" color="yellow" style="color:#444">视频监测&nbsp;&nbsp;0</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>固有风险</span>
          </div>
          <div id="fixedRiskDataBar" class="fixedRiskDataCls">
          </div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>天气环境</span>
          </div>
          <div class="weatherCls">
            <el-row type="flex" justify="center">
              <el-col :span="10">
                <div>鄂州市:</div>
                <img :src="weathers.src">
              </el-col>
              <el-col :span="10">
                <div>&nbsp;</div>
                <div>{{weathers.desc}}</div>
                <div>{{weathers.wind}}</div>
                <div>{{weathers.air}}</div>
                <div style="color:orange">{{weathers.alarm}}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <span>隐患排查</span>
          </div>
          <div class="yhTxtBox">
            <div class="yhTxt">
              <p>未登记一般隐患: <span>{{troubleData.noRegistereds}}条</span></p>
              <p>未进行必须检查项目: <span>{{troubleData.noCheckeds}}条</span></p>
              <p>一般隐患: <span>{{troubleData.nomalTrouble}}条</span></p>
              <p>一般隐患上升重大隐患: <span>{{troubleData.nomalToHighTroble}}条</span></p>
              <p>重大隐患: <span>{{troubleData.highTrouble}}条</span></p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <p class="dyhead">管理风险 <span>(安全生产责任事故)</span></p>
          </div>
          <el-table :data="manageDataList" v-loading="dataListLoading" height="200" class="card-table">
            <el-table-column prop="date" header-align="center" align="center" label="时间"></el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="事故名称"></el-table-column>
            <el-table-column prop="level" header-align="center" align="center" label="事故等级"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfixs">
            <p class="dyhead">大数据因子 <span>(行业及企业事故)</span></p>
          </div>
          <el-table :data="bigDataList" v-loading="dataListLoading" height="200" class="card-table">
            <el-table-column prop="date" header-align="center" align="center" label="时间"></el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="事故名称"></el-table-column>
            <el-table-column prop="level" header-align="center" align="center" label="事故等级"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data () {
      return {
        enterpriseList: [],
        enterpriseCode: '',
        enterpriseId: '',
        enterpriseName: '',
        industryCode: '',
        industryName: '',
        riskLevel: 4,

        realRiskData: {
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0
        },
        fixedRiskData: {
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0
        },
        troubleData: {
          noRegistereds: 0,
          noCheckeds: 0,
          nomalTrouble: 0,
          nomalToHighTroble: 0,
          highTrouble: 0
        },
        weathers: { // 天气代码,天气名称,风力，气温，预警信息
          code: '',
          src: '',
          wind: '',
          air: '',
          alarm: ''
        },
        manageDataList: [],
        bigDataList: [],
        dataListLoading: false
      }
    },
    mounted () {
      this.getEnterpriseList()
    },
    beforeCreate () {
      window.intervalObj = ''
    },
    activated () {
      this.intervalBegin()
    },
    deactivated () {
      console.log('keep-alive 组件停用时调用开始')
      this.intervalEnd()
      console.log('keep-alive 组件停用时调用结束')
    },
    computed: {
      realRiskTotalCount: function () {
        return this.realRiskData.level1 + this.realRiskData.level2 + this.realRiskData.level3 + this.realRiskData.level4;
      }
    },
    methods: {
      getEnterpriseList () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/enterpriseList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.enterpriseList = data.list
            this.enterpriseId = this.enterpriseList[0].id
            this.getEnterpriseInfo()
            this.getRealRiskData()
            this.getFixedRiskData()
            this.getTroubleData()
            this.getManageDataList()
            this.getBigDataList()
            this.getWeathers()
          }
        })
      },
      // 获取企业基本风险信息
      getEnterpriseInfo () {
        var option = {
          // backgroundColor: 'cadetblue',
          tooltip: {formatter: "{a} <br/>{c} {b}", show: false},
          series: [
            {
              name: '风险级别',
              type: 'gauge',
              min: 4,
              max: 0,
              splitNumber: 4,
              radius: '100%',
              axisLine: {             // 坐标轴线
                lineStyle: {        // 属性lineStyle控制线条样式
                  color: [[0.25, 'blue'], [0.5, 'yellow'], [0.75, 'orange'], [1, 'red']],
                  width: 25,
                  shadowColor: '#fff', // 默认透明
                  shadowBlur: 10
                }
              },
              axisLabel: {            // 坐标轴小标记
                show: false,
                textStyle: {        // 属性lineStyle控制线条样式
                  fontWeight: 'bolder',
                  color: '#fff',
                  shadowColor: '#fff', // 默认透明
                  shadowBlur: 10
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 0,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto',
                  shadowColor: '#fff', // 默认透明
                  shadowBlur: 20
                }
              },
              splitLine: {           // 分隔线
                length: 0,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  width: 0,
                  color: '#fff',
                  shadowColor: '#fff', // 默认透明
                  shadowBlur: 10
                }
              },
              pointer: {           // 分隔线
                shadowColor: '#fff', // 默认透明
                shadowBlur: 5
              },
              title: {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: 'blue',
                  shadowColor: '#fff', // 默认透明
                  shadowBlur: 10
                },
                offsetCenter: [0, -16]
              },
              detail: {
                backgroundColor: 'rgba(30,144,255,0.8)',
                width: 60,
                height: 30,
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor: '#fff', // 默认透明
                shadowBlur: 1,
                offsetCenter: [0, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 20,
                  color: '#fff'
                },
                formatter: function (value) {
                  if (value == 0.5) return 1
                  if (value == 1.5) return 2
                  if (value == 2.5) return 3
                  if (value == 3.5) return 4
                }
              },
              data: [{value: 2.5, name: '一般风险'}]
            }]
        };
        console.log('2企业信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/enterpriseInfo'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            // this.enterpriseId = data.list.enterpriseId;
            this.enterpriseName = data.list.enterpriseName;
            this.industryCode = data.list.industryCode;
            this.industryName = data.list.industryName;
            this.riskLevel = data.list.riskLevel;

            option.series[0].data.value = data.list.riskLevel - 0.5;

            if (data.list.riskLevel == 1 || data.list.riskLevel == 0) {
              option.series[0].data = [{value: 0.5, name: '重大风险'}];
              option.series[0].title.textStyle.color = 'red';
            }
            if (data.list.riskLevel == 2) {
              option.series[0].data = [{value: 1.5, name: '较大风险'}];
              option.series[0].title.textStyle.color = 'orange';
            }
            if (data.list.riskLevel == 3) {
              option.series[0].data = [{value: 2.5, name: '一般风险'}];
              option.series[0].title.textStyle.color = 'yellow';
            }
            if (data.list.riskLevel == 4) {
              option.series[0].data = [{value: 3.5, name: '较低风险'}];
              option.series[0].title.textStyle.color = 'blue';
            }

            this.allRiskDataBar = echarts.init(document.getElementById('allRiskDataBar'))
            this.allRiskDataBar.setOption(option)
            window.addEventListener('resize', () => {
              this.allRiskDataBar.resize()
            })
          }
        })
      },
      // 获取企业监测数据风险信息
      getRealRiskData () {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            show: false,
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }],
          color: ['blue', 'yellow', 'orange', 'red']
        };
        console.log('3企业监测数据风险信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/realRiskData'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.realRiskData.level4 = data.list.level4;
            this.realRiskData.level3 = data.list.level3;
            this.realRiskData.level2 = data.list.level2;
            this.realRiskData.level1 = data.list.level1;

            var serieslist = [{value: data.list.level4, name: '4级_' + data.list.level4},
              {value: data.list.level3, name: '3级_' + data.list.level3},
              {value: data.list.level2, name: '2级_' + data.list.level2},
              {value: data.list.level1, name: '1级_' + data.list.level1}];
            option.legend.data = ['4级_' + data.list.level4,
              '3级_' + data.list.level3,
              '2级_' + data.list.level2,
              '1级_' + data.list.level1];
            option.series[0].data = serieslist;

            this.RealRiskDataChartBar = echarts.init(document.getElementById('realRiskDataBar'))
            this.RealRiskDataChartBar.setOption(option)
            window.addEventListener('resize', () => {
              this.RealRiskDataChartBar.resize()
            })

          }
        })
      },
      // 获取企业固定风险信息
      getFixedRiskData () {
        var option = {
          grid: {
            top: 2,
          },
          tooltip: {formatter: '{a} <br/>{b}'},
          xAxis: [{
            type: 'category',
            axisLabel: {interval: 0, rotate: 45, margin: 2, textStyle: {color: "#222"}},
            data: ['1级', '2级', '3级', '4级']
          }],
          yAxis: [{type: 'value'}],
          series: [{
            type: 'bar',
            itemStyle: {
              normal:
                {
                  color: function (params) {
                    var colorList = ['blue', 'yellow', 'orange', 'red'];
                    return colorList[params.dataIndex]
                  },
                }
            },
            data: [9, 10, 5, 12],
          }]
        }

        console.log('4企业固定风险信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/fixedRiskData'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.fixedRiskData.level4 = data.list.level4;
            this.fixedRiskData.level3 = data.list.level3;
            this.fixedRiskData.level2 = data.list.level2;
            this.fixedRiskData.level1 = data.list.level1;

            var serieslist = [{value: data.list.level4, name: '4级_' + data.list.level4},
              {value: data.list.level3, name: '3级_' + data.list.level3},
              {value: data.list.level2, name: '2级_' + data.list.level2},
              {value: data.list.level1, name: '1级_' + data.list.level1}];

            option.series[0].data = [data.list.level4, data.list.level3, data.list.level2, data.list.level1];
            option.xAxis[0].data = ['4级_' + data.list.level4, '3级_' + data.list.level3, '2级_' + data.list.level2, '1级_' + data.list.level1];

            this.fixedRiskDataBar = echarts.init(document.getElementById('fixedRiskDataBar'))
            this.fixedRiskDataBar.setOption(option)
            window.addEventListener('resize', () => {
              this.fixedRiskDataBar.resize()
            })
          }
        })
      },

      // 获取企业隐患信息
      getTroubleData () {
        console.log('5企业隐患信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/troubleData'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleData.noRegistereds = data.list.noRegistereds
            this.troubleData.noCheckeds = data.list.noCheckeds
            this.troubleData.nomalTrouble = data.list.nomalTrouble
            this.troubleData.nomalToHighTroble = data.list.nomalToHighTroble
            this.troubleData.highTrouble = data.list.highTrouble
          }
        })
      },

      // 获取企业管理信息
      getManageDataList () {
        console.log('6企业隐患信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/manageDataList'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.manageDataList = data.list
          }
        })
      },

      // 获取企业大数据信息
      getBigDataList () {
        console.log('7企业大数据信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/bigDataList'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.bigDataList = data.list
          }
        })
      },

      // 获取企业天气信息
      getWeathers () {
        console.log('8企业天气信息：' + this.enterpriseId)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/dynamicRiskView/weathers'),
          method: 'get',
          params: this.$http.adornParams({eId: this.enterpriseId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.weathers.code = data.list.code
            if (data.list.src == null) {
              this.weathers.src = require('../../../../static/img/weather/undefined.png')
            } else {
              this.weathers.src = require('../../../../static/img/' + data.list.src)
            }
            this.weathers.desc = data.list.desc
            this.weathers.wind = data.list.wind
            this.weathers.air = data.list.air
            this.weathers.alarm = data.list.alarm
          }
        })
      },
      changeEnterprise () {
        console.log('9改变焦点：' + this.enterpriseId)
        this.getEnterpriseInfo()
        this.getRealRiskData()
        this.getFixedRiskData()
        this.getTroubleData()
        this.getManageDataList()
        this.getBigDataList()
        this.getWeathers()
      },
      intervalBegin () {
        console.log('开始定时器')
        window.intervalObj = setInterval(this.changeEnterprise, 10000)
        console.log('定时器执行时间：' + window.intervalObj)
      },
      intervalEnd () {
        console.log('停止定时器')
        clearInterval(window.intervalObj)
      }
    }
  }
</script>

<style>
  .box-card {
    background: #f9fafc;
    min-height: 280px;
  }

  .risk-title {
    text-align: center;
    display: block;
    font-size: 1.5em;
    -webkit-margin-before: 0.83em;
    -webkit-margin-after: 0.83em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

  .colBottom .el-col {
    margin-bottom: 15px;
  }

  .row-title {
    background-color: #f9fafc;
    margin-bottom: 20px;
  }

  .yhTxtBox {
    text-align: center;
  }

  .yhTxt {
    display: inline-table;
    text-align: right;
    color: #606266;
  }

  .yhTxt p {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
  }

  .yhTxt p span {
    font-weight: bold;
  }

  .clearfixs {
    text-align: center;
    font-weight: bold;
  }

  .text {
    min-height: 155px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text div {
    font-size: 2em;
    padding: 20px;
    border-radius: 100%;
    line-height: 2em;
    -webkit-box-shadow: inset 0px 0px 5px rgba(255, 255, 255, .5);
    -moz-box-shadow: inset 0px 0px 5px rgba(255, 255, 255, .5);
    box-shadow: inset 0px 0px 5px rgba(255, 255, 255, .5);
  }

  .gbDiv .el-card__body {
    padding: 15px 0;
    min-height: 230px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .gbDiv .el-card__header {
    background: #f2f4fb;
  }

  .dyhead {
    margin: 0 !important;
  }

  #realRiskDataBar {
    width: 100%;
    height: 120px;
  }

  .realRiskDataCls {
    width: 100%;
    height: 160px;
  }

  .weatherCls {
    width: 100%;
    height: 130px;
  }

  .fixedRiskDataCls {
    width: 98%;
    height: 120px;
    padding: 0 1%;
  }

  .allRiskDataCls {
    text-align: center;
    width: 100%;
    height: 140px;
  }

  .card-table, .card-table tr, .card-table th, .card-table td {
    background: none;
  }

  .card-table td:hover {
    background: rgba(255, 255, 255, .3);
  }

  .card-table::-webkit-scrollbar {
    width: 6px
  }

  .card-table::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .5);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .card-table::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, .2);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }
</style>
