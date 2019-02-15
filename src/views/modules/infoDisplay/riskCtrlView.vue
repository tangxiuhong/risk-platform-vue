<template>
  <!-- 页面分为左右两个部分 -->
  <div class="riskCtrl_content clear">
    <!-- 左 -->
    <div class="left">
      <el-row class="riskContent">
        <div class="row_label">
          风险单元
        </div>
        <div class="col_content">
          <a><span v-text="unitNum" @click='riskUnitInfo()'></span>个</a>
        </div>
      </el-row>
      <el-row class="riskContent">
        <el-col :span="12">
        <div class="row_label">
          风险点数
        </div>
        <div class="col_content">
          <a><span v-text="pointNum" @click='riskPointInfo()'></span>个</a>
        </div>
        </el-col>
        <el-col :span="12">
          <div class="row_label">
          危险有害因素
        </div>
        <div class="col_content">
          <a><span v-text="factorNum"></span>个</a>
        </div>
        </el-col>
      </el-row>

       <!-- 饼状图 -->
      <el-row class="left_bottom">
        <div class="row_label_pie">
          风险点正常/异常(天)
        </div>
        <div class="left_bottom_pie" id="left_bottom_pie">

        </div>
      </el-row>

    </div>
    <!-- 右 -->
    <div class="right">
      <el-row class="right_top">
        <div class="right_title">风险有害因素趋势图</div>
        <div class="right_top_line" id="right_top_line"></div>
      </el-row>
      <el-row class="right_bottom">
        <div class="right_bottom_select">
          <el-select v-model="riskUnit" clearable filterable placeholder="风险单元"  @change="riskUnitChg()">
          <el-option
            v-for="item in riskUnitList"
            :key="item.id"
            :label="item.riskUnit"
            :value="item.id">
          </el-option>
        </el-select>
        </div>
        <div class="right_bottom_bar" id="right_bottom_bar"></div>
      </el-row>
      <!-- 风险单元 -->
      <risk-unit-info v-if='riskUnitInfoView' ref="riskUnitInfo" @unitInfoHide='unitInfoHides'></risk-unit-info>
      <!-- 风险点-->
      <risk-point-info v-if='riskPointInfoView' ref="riskPointInfo" @pointInfoHide='pointInfoHides'></risk-point-info>
      <!-- 折线图-->
      <risk-line-info v-if='riskLineInfoView' ref="riskLineInfo" @lineInfoHide='lineInfoHides'></risk-line-info>
      <!-- 折线图-->
      <risk-bar-info v-if='riskBarInfoView' ref="riskBarInfo" @barInfoHide='barInfoHides'></risk-bar-info>
    </div>
  </div>
</template>

<script>
  /* eslint-disable eqeqeq */
  import echarts from 'echarts'
  import riskUnitInfo from './riskCtrlView-riskUnitInfo'
  import riskPointInfo from './riskCtrlView-riskPointInfo'
  import riskLineInfo from './riskCtrlView-riskLineInfo'
  import riskBarInfo from './riskCtrlView-riskBarInfo'
  export default {
    data () {
      return {
        unitNum: '0',
        pointNum: '0',
        factorNum:'0',
        pointErrCount: '0',
        pointNormaCount: '0',
        pointName: '',
        pointType: '',
        riskUnit: '',
        leftBottomPie: null,
        rightChartLine: null,
        rightBottomBar: null,
        department: '',
        liContent: 'li_content',
        departmentName: '',
        riskUnitInfoView: false,
        riskPointInfoView: false,
        riskDayInfoView: false,
        riskLineInfoView: false,
        riskBarInfoView: false,
        checkTime: '',
        pageIndex: 1,
        pageSize: 3,
        totalPage: 0,
        dataListLoading: false,
        dataList: [],
        //  部门
        riskUnitList: [],
        chartBarData: [
          {name: ['一级风险', '二级风险', '三级风险', '四级风险'], value1: [3, 8, 2, 7], value2: [5, 9, 1, 6]},
          {
            name: ['A单元', 'B单元', 'C单元', 'D单元', 'E单元', 'F单元', 'G单元'],
            value1: [5, 8, 9, 2, 4, 6, 5],
            value2: [7, 3, 6, 9, 4, 3, 2]
          }
        ],
        ctrlRiskDataSee: false,
        ctrlMonthlySee: false,
        ctrlRiskInfoSee: false
      }
    },
    components: {
      riskUnitInfo,
      riskPointInfo,
      riskLineInfo,
      riskBarInfo
    },
    mounted () {
      this.initRiskUnit()
      this.getRiskUnit()
      this.initLeftBottomPie()
      this.initRightChartLine()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.leftBottomPie) {
        this.leftBottomPie.resize()
      }
      if (this.rightBottomBar) {
        this.rightBottomBar.resize()
      }
      if (this.rightChartLine) {
        this.rightChartLine.resize()
      }
    },
    methods: {
      // 风险单元
      riskUnitInfo () {
        this.riskUnitInfoView = true
        this.$nextTick(() => {
          this.$refs.riskUnitInfo.getDataList()
        })
      },
      unitInfoHides () {
        this.riskUnitInfoView = false
      },
      // 风险点
      riskPointInfo () {
        this.riskPointInfoView = true
        this.$nextTick(() => {
          this.$refs.riskPointInfo.getDataList()
        })
      },
      pointInfoHides () {
        this.riskPointInfoView = false
      },
      // 风险异常统计
      riskLineInfo () {
        this.riskLineInfoView = true
        this.$nextTick(() => {
          this.$refs.riskLineInfo.getDataList(this.checkTime)
        })
      },
      lineInfoHides () {
        this.riskLineInfoView = false
      },
      // 柱状图点击
      riskBarInfo () {
        this.riskBarInfoView = true
        this.$nextTick(() => {
          this.$refs.riskBarInfo.getDataList(this.riskUnit, this.pointName, this.pointType)
        })
      },
      barInfoHides () {
        this.riskBarInfoView = false
      },
      initRiskUnit () {
        this.$http({
          url: this.$http.adornUrl(`/infoDisplay/riskCtrlView/riskUnitList`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.page
            this.riskUnit = this.riskUnitList[0].id
            this.initRightBottomBar()
          }
        })
      },
      // 获取风险单元
      getRiskUnit () {
        this.$http({
          url: this.$http.adornUrl(`/infoDisplay/riskCtrlView/riskPointCount`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.unitNum = data.map.unitCount
            this.pointNum = data.map.pointCount
            this.factorNum= data.map.factorCount
            this.pointErrCount = data.map.pointErrCount
            this.pointNormaCount = parseInt(this.pointNum) - parseInt(this.pointErrCount)
            // var t = this.pointNormaCount
            this.initLeftBottomPie()
          }
        })
      },
      // 左边饼状图
      initLeftBottomPie () {
        var option = {
         
          tooltip: {
            trigger: 'item',
            formatter: '{b}:{c}'
          },
          selectedOffset: 0,
          series: [
            {
              name: '',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '60%'],
              label: {
                normal: {
                  formatter: '{b}{c}条',
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: this.pointErrCount, name: '异常数'},
                {value: this.pointNormaCount, name: '正常数'}
              ]
            },
            {
              name: '',
              type: 'pie',
              selectedMode: 'single',
              radius: ['59%', '80%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: this.pointNum,name:'全部'}
              ]
            }
          ]
        }
        // 给左边饼状图赋值(异常数，正常数)
        this.leftBottomPie = echarts.init(document.getElementById('left_bottom_pie'))
        this.leftBottomPie.setOption(option)
        window.addEventListener('resize', () => {
          this.leftBottomPie.resize()
        })
      },
      // 右上折线图
      initRightChartLine () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['重大隐患', '一般隐患']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '风险异常数',
              type: 'line',
              // 设置图形阴影的代码
              // itemStyle: {
              //   normal: {
              //     areaStyle: {}
              //   }
              // },
              smooth: true,
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
          ]
        }
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskDoErrForMonthCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data = data.map
            this.rightChartLine = echarts.init(document.getElementById('right_top_line'))
            this.rightChartLine.setOption(option)
            window.addEventListener('resize', () => {
              this.rightChartLine.resize()
            })
            // 折线图点击事件
            var _this = this
            this.rightChartLine.on('click', function (param) {
              var date = new Date()
              var year = date.getFullYear()
              _this.checkTime = year + '-' + param.name.substring(0, param.name.length - 1)
              _this.riskLineInfo()
            })
          }
        })
      },

      riskUnitChg (e) {
        this.initRightBottomBar()
      },
      // 右下柱状图
      initRightBottomBar () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['有害因素异常数', '产生隐患数']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['井下电梯岗位', '井口信号']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '有害因素异常数',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FF0000'
                }
              },
              data: [8]
            },
            {
              name: '产生隐患数',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FDFE02'
                }
              },
              data: [7]
            }
          ]
        }
        // 给右下柱状图赋值
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskForCheckErrAndTroubleCount'),
          method: 'get',
          params: this.$http.adornParams({unitId: this.riskUnit})
        }).then(({data}) => {
          if (data && data.code === 0) {
            var nameList = []
            var effectiveCountList = []
            var troubleCountList = []
            if (data.map === '0') {

            } else {
              for (var x in data.map) {
                var rd = data.map[x]
                nameList.push(rd.riskPoint)
                effectiveCountList.push(rd.effectiveCount)
                troubleCountList.push(rd.troubleCount)
              }
            }
            option.xAxis[0].data = nameList
            option.series[0].data = effectiveCountList
            option.series[1].data = troubleCountList
            this.rightBottomBar = echarts.init(document.getElementById('right_bottom_bar'))
            this.rightBottomBar.setOption(option)
            window.addEventListener('resize', () => {
              this.rightBottomBar.resize()
            })
            var _this = this
            // 柱状图点击事件
            this.rightBottomBar.on('click', function (param) {
              _this.pointName = param.name
              if (param.seriesName == '有害因素异常数') {
                _this.pointType = 0
              } else {
                _this.pointType = 1
              }
              _this.riskBarInfo()
            })
          }
        })
      },
      // 获取单元分组查看风险和受控数
      getRiskUnitControlled () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskUnitControlledCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.initRiskBar(this.bottomBar, 'bottom', data.requestMap)
          }
        })
      },
      ctrlDataHides () {
        this.ctrlRiskDataSee = false
      },
      ctrlMonthlyHides () {
        this.ctrlMonthlySee = false
      },
      ctrlRiskInfoHides () {
        this.ctrlRiskInfoSee = false
      }
    }
  }
</script>
<style>

  .clear {
    display: block;
    overflow: hidden;
  }

  .riskCtrl_content {
    width: 100%;
    height: 780px;
  }
  .riskCtrl_content a{
    cursor:pointer;
  }
  .riskCtrl_content .left {
    float: left;
    width: 25%;
    height: 100%;
  }

  .riskCtrl_content .riskContent {
    width: 100%;
    height: 25%;
    font-size: 16px;
    text-align: center;
  }

  .riskCtrl_content .row_label {
    width: 100%;
    height: 20%;
    line-height: 40px;
    background-color: #CCCCCC;
  }

  .riskCtrl_content .col_content {
    width: 100%;
    height: 70%;
    line-height: 120px;
    font-size: 30px;
    background-color: #F2F2F2;
  }

  .riskCtrl_content .left_bottom {
    width: 100%;
    height: 100%;
    font-size: 16px;
    text-align: center;
  }

  .riskCtrl_content .row_label_pie {
    width: 100%;
    height: 5%;
    line-height: 40px;
    background-color: #CCCCCC;
  }

  .riskCtrl_content .left_bottom_pie {
    width: 100%;
    height: 50%;
    background-color: #F2F2F2;
  }

  .riskCtrl_content .right {
    float: left;
    width: 70%;
    height: 100%;
    boder: 1px solid red
  }

  .riskCtrl_content .right_top {
    width: 100%;
    height: 45%;
    margin-left: 45px;
  }

  .riskCtrl_content .right_top_line {
    width: 100%;
    height: 96%;
  }

  .riskCtrl_content .right_bottom {
    width: 100%;
    margin-top:2%;
    height: 45%;
    margin-left: 40px;
  }

  .riskCtrl_content .right_bottom_bar {
    width: 100%;
    height: 100%;
  }

</style>
