<template>
  <div class='risk_content'>
    <!-- 标题部分 -->
    <!--<div class='top'>-->
    <!--<span v-text='year'></span>年 &nbsp;风险一览-->
    <!--</div>-->

    <!-- 内容部分-->
    <!-- 左边部分 -->
    <div class="left">
      <!--上边信息部分-->
      <div class="left_top">
        <!-- 标题部分 -->
        <div class="left_top_title"><span>风险信息</span></div>
        <!-- 数据部分-->
        <div class="left_top_content">
          <ul class="clear">
            <li class="li_1">
              <div class="li_label"><span>风险单元</span></div>
              <div class="li_content" @click='riskUnit()'><span><a v-text='unitCount'></a>个</span></div>
            </li>
            <li class="li_2">
              <div class="li_label"><span>风险点</span></div>
              <div class="li_content" @click='riskPoint()'><span><a v-text='pointCount'></a>条</span></div>
            </li>
            <li class="li_1">
              <div class="li_label"><span>风险数</span></div>
              <div class="li_content" @click='riskName()'><span><a v-text="riskCount"></a>条</span></div>
            </li>
            <li class="li_2">
              <div class="li_label"><span>风险受控</span></div>
              <div class="li_content" @click='riskControlled()'><span><a v-text="riskControlledCount"></a>条</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 下边仪表盘的图-->
      <div class="left_bottom" id="left_bottom">

      </div>
    </div>

    <!-- 右边部分-->
    <div class="right">
      <!-- 上边图片部分-->
      <div class="right_top">
        <el-carousel indicator-position='outside' height='400px'>
          <el-carousel-item v-for='(item,index) in imgList' key="index">
            <img class="animImg" @click="imgChang(item)" :src='item.attachmentPath'/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 下边柱状图部分-->
      <div class="right_bottom" id="right_bottom"></div>
    </div>

    <!-- 风险单元 -->
    <risk-unit-info v-if='riskUnitInfo' ref="riskUnitInfo" @unitHide='unitHides'></risk-unit-info>
    <!-- 风险点 -->
    <risk-point-info v-if='riskPointInfo' ref="riskPointInfo" @riskPointInfoHide='riskPointInfoHides'></risk-point-info>
    <!-- 风险数 -->
    <risk-name-info v-if='riskNameInfo' ref='riskNameInfo' @riskNameInfoHide='riskNameInfoHides'></risk-name-info>
    <!-- 风险分级 -->
    <risk-data v-if='riskDataSee' ref='riskDataSee' @dataHide='dataHides'></risk-data>
    <!--图片放大展示-->
    <risk-view-img v-if="riskViewImg" ref="riskViewImg" @riskImgHide="riskImgHides"></risk-view-img>
    <!--@riskImgHide="riskImgHides"-->
  </div>
</template>

<script>
  import echarts from 'echarts'
  import riskUnitInfo from './riskViewRiskUnit-info'
  import riskPointInfo from './riskViewRiskPoint-info'
  import riskNameInfo from './riskViewRiskName-info'
  import riskData from './riskViewRiskData'
  import riskViewImg from './riskViewImg'

  export default {
    data () {
      return {
        chartBar: null,
        chartPie: null,
        unitCount: '0',
        pointCount: '0',
        riskCount: '0',
        riskControlledCount: '0',
        animate: false,
        year: '',
        imgList: [],
        pageIndex: 1,
        pageSize: 4,
        totalPage: 0,
        dataListLoading: false,
        dataList: [],
        riskUnitInfo: false,
        riskPointInfo: false,
        riskNameInfo: false,
        riskDataSee: false,
        riskViewImg: false
      }
    },
    components: {
      riskUnitInfo, riskPointInfo, riskNameInfo, riskData, riskViewImg
    },
    mounted () {
      this.getUnitCount()
      this.getRiskPoint()
      this.getRiskCount()
      this.getRiskControlled()
      this.getRiskImg()
      this.getYear()
      this.initChartPie()
      this.initChartBar()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartPie) {
        this.chartPie.resize()
      }
    },
    methods: {
      // 获取当前年份
      getYear () {
        var date = new Date()
        this.year = date.getFullYear()
      },
      // 获取企业风险平面图
      getRiskImg () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/listFileByUser'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.imgList = data.sysFiles
          }
        })
      },
      // 图片放大页面
      imgChang (item) {
        this.riskViewImg = true
        this.$nextTick(() => {
          this.$refs.riskViewImg.getRiskImg(item)
        })
      },
      // 关闭图片放大页面
      riskImgHides () {
        this.riskViewImg = false
      },
      //  仪表盘数据
      initChartPie () {
        var option = {
          title: {
            text: '风险\n受控率',
            x: '50%',
            y: '40%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
              color: '#ff0000'
            },
            subtextStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              color: '#0000ff'
            }
          },
          grid: {
            top: '0%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            padding: '0',
            containLabel: true
          },
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              name: '',
              type: 'gauge',
              center: ['50%', '55%'], // 默认全局居中
              radius: '95%',
              axisLine: {
                show: false,
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    ['', '#FECD33'],
                    [1, '#FF6332']
                  ],
                  width: 30
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              pointer: {
                show: false,
                length: '0',
                width: '0'
              },
              detail: {
                formatter: '{value}%',
                offsetCenter: [0, '40%'],
                textStyle: {
                  color: '#3ea1ff',
                  fontWeight: 'bold'
                }
              },
              data: [{
                value: '0',
                label: {
                  textStyle: {
                    fontSize: 12
                  }
                }
              }]
            }
          ]
        }
        // 给饼状图赋值(风险受控率)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/riskControlledRate'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data[0].value = data.map.controlRate
            option.series[0].axisLine.lineStyle.color[0][0] = (data.map.controlRate) / 100
            this.chartPie = echarts.init(document.getElementById('left_bottom'))
            this.chartPie.setOption(option)
            window.addEventListener('resize', () => {
              this.chartPie.resize()
            })
          }
        })
      },
      //  柱状图
      initChartBar () {
        var option = {
          grid: {
            top: '5%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#000000'
                }
              },
              axisTick: {
                lineStyle: {
                  color: '#000000'
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  fontSize: '12'
                }
              },
              data: ['重大风险', '较大风险', '一般风险', '低风险']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              barCategoryGap: '50%',
              itemStyle: {
                normal: {
                  barBorderWidth: 0,
                  barBorderRadius: 4,
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14,
                      color: '#000'
                    }
                  }
                }
              },
              data: [
                {
                  value: '0',
                  itemStyle: {
                    normal: {
                      color: '#FF0000'
                    }
                  }
                },
                {
                  value: '0',
                  itemStyle: {
                    normal: {
                      color: '#FF9900'
                    }
                  }
                }, {
                  value: '0',
                  itemStyle: {
                    normal: {
                      color: '#FDFE02'
                    }
                  }
                }, {
                  value: '0',
                  itemStyle: {
                    normal: {
                      color: '#009cff'
                    }
                  }
                }
              ]
            }
          ]
        }
        let myChart = echarts.init(document.getElementById('right_bottom'))
        // let _this = this
        // 给左下柱状图赋值
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/levelCountList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            for (var x in data.mapList) {
              option.series[0].data[x].value = data.mapList[x].num
            }
            // this.chartBar = echarts.init(document.getElementById('center_left_echarts_bar'))
            this.chartBar = myChart
            this.chartBar.setOption(option)
            window.addEventListener('resize', () => {
              this.chartBar.resize()
            })
            // 点击显示数据表
            // this.chartBar.on('click', function (param) {
            //   switch (param.name) {
            //     case '重大风险':
            //       _this.riskDataSee = true
            //       _this.$nextTick(() => {
            //         _this.$refs.riskDataSee.getDataList(1)
            //       })
            //       break
            //     case '较大风险':
            //       _this.riskDataSee = true
            //       _this.$nextTick(() => {
            //         _this.$refs.riskDataSee.getDataList(2)
            //       })
            //       break
            //     case '一般风险':
            //       _this.riskDataSee = true
            //       _this.$nextTick(() => {
            //         _this.$refs.riskDataSee.getDataList(3)
            //       })
            //       break
            //     case '低风险':
            //       _this.riskDataSee = true
            //       _this.$nextTick(() => {
            //         _this.$refs.riskDataSee.getDataList(4)
            //       })
            //       break
            //   }
            // })
          }
        })
      },
      // 获取风险单元数量
      getUnitCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/unitCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.unitCount = data.map.num
          }
        })
      },
      // 获取辨识风险数量
      getRiskPoint () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/riskPointCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.pointCount = data.map.num
          }
        })
      },
      // 获取风险数量
      getRiskCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/riskNameCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskCount = data.map.num
          }
        })
      },
      // 获取受控风险数量
      getRiskControlled () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskView/controlledCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskControlledCount = data.map.num
          }
        })
      },
      // 风险单元
      riskUnit () {
        this.riskUnitInfo = true
        this.$nextTick(() => {
          this.$refs.riskUnitInfo.getDataList(this.unitCount)
        })
      },
      unitHides () {
        this.riskUnitInfo = false
      },
      // 风险点
      riskPoint () {
        this.riskPointInfo = true
        this.$nextTick(() => {
          this.$refs.riskPointInfo.getDataList(this.pointCount)
        })
      },
      riskPointInfoHides () {
        this.riskPointInfo = false
      },
      // 风险数
      riskName () {
        this.riskNameInfo = true
        this.$nextTick(() => {
          this.$refs.riskNameInfo.getDataList(this.riskCount, null)
        })
      },
      riskNameInfoHides () {
        this.riskNameInfo = false
      },
      // 风险受控信息
      riskControlled () {
        this.riskNameInfo = true
        this.$nextTick(() => {
          let controled = 1
          this.$refs.riskNameInfo.getDataList(this.riskControlledCount, controled)
        })
      },
      // 柱状图风险数据
      dataHides () {
        this.riskDataSee = false
      }
    }
  }
</script>
<style>

  .clear {
    display: block;
    overflow: hidden;
  }

  .risk_content {
    width: 100%;
    height: 780px;
  }

  .risk_content .top {
    width: 100%;
    font-size: 24px;
    font-weight: bold;
    height: 5%;
    text-align: center;
    line-height: 24px;
  }

  .risk_content .left {
    float: left;
    width: 30%;
    height: 100%;
  }

  .risk_content .left_top {
    width: 100%;
    height: 50%;
  }

  .risk_content #left_bottom {
    width: 100%;
    height: 50%;
  }

  .risk_content .right {
    float: left;
    width: 69%;
    height: 100%;
    margin-left: 1%;
  }

  .risk_content .left_top {
    width: 100%;
    height: 50%;
  }

  .risk_content .left_top_title {
    width: 100%;
    height: 10%;
    text-align: center;
    line-height: 36px;
    font-size: 16px;
    background-color: #E4E4E4;
  }

  .risk_content .left_top_content {
    width: 100%;
    height: 90%;
  }

  .risk_content .left_top_content ul {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0px;
    padding: 0px;
    text-align: center;
  }

  .risk_content .left_top_content ul .li_1 {
    float: left;
    width: 49%;
    height: 32%;
    margin-top: 8%;
  }

  .risk_content .left_top_content ul .li_2 {
    float: right;
    width: 49%;
    height: 32%;
    margin-top: 8%;
  }

  .risk_content .li_label {
    width: 100%;
    height: 40%;
    font-size: 16px;
    background-color: #CCCCCC;
    padding: 14px 0;
  }

  .risk_content .li_content {
    width: 100%;
    height: 60%;
    font-size: 18px;
    background-color: #F2F2F2;
    padding: 20px 0;
  }

  .risk_content .right_top {
    width: 100%;
    height: 58%;
  }

  .animImg {
    width: 100%;
    height: 100%;
  }

  .risk_content #right_bottom {
    width: 100%;
    height: 42%;
  }

  /*弹出框公共样式*/
  .riskBox {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 9999;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .riskBox::-webkit-scrollbar {
    width: 0;
  }

  .close {
    text-align: right;
    font-size: 20px;
  }

  .riskTitle {
    font-size: 18px;
    line-height: 2.5em;
  }
</style>
