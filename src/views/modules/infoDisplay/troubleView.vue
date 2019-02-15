<template>
  <div class="trouble_content clear">
    <!-- 页面主要分为左右两块 -->
    <!-- 左边部分 -->
    <div class="left">
      <!-- 左上 -->
      <div class="left_top">
        <ul class="clear">
          <li class="riskNum">
            <div class="li_lable"><span v-text="year"></span>年&nbsp;隐患总数</div>
            <div class="li_content" @click="troubleNum()"><a><span v-text="troubleCount"></span></a>条</div>
          </li>
          <li class="li_style">
            <div class="li_lable">逾期隐患</div>
            <div class="li_content" @click="overTroubleNum()"><a><span v-text="overdueTroubleCount"></span></a>条</div>
          </li>
          <li class="li_style">
            <div class="li_lable">一般隐患</div>
            <div class="li_content" @click="generalTroubleNum()"><a><span v-text="generalTroubleCount"></span></a>条
            </div>
          </li>
          <li class="li_style">
            <div class="li_lable">重大隐患</div>
            <div class="li_content" @click="majorTroubleNum()"><a><span v-text="majorTroubleCount"></span></a>条</div>
          </li>
        </ul>
      </div>
      <!-- 左中 -->
      <div class="left_center clear">
        <!-- 左边的圆环图 -->
        <div class="left_center_pie1" id="left_center_pie1"></div>
        <!-- 右边的圆环图 -->
        <div class="left_center_pie2" id="left_center_pie2">

        </div>

      </div>
      <!-- 左下 -->
      <div class="left_bottom">
        <!-- 左下的柱状图 -->
        <div class="left_bottom_bar" id="left_bottom_bar">

        </div>
      </div>
    </div>
    <!-- 右边部分 -->
    <div class="right">
      <!-- 右上 -->
      <div class="right_top">
        <div class="right_title">隐患消息提示</div>
        <!-- 放表格的部分 -->
        <div class="table_area">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @row-click="rowClick"
            style="width: 100%;">
            <el-table-column
              prop="departmentName"
              header-align="center"
              align="center"
              label="所属部门">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              align="center"
              label="内容">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              header-align="center"
              align="center"
              label="时间">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[1, 2, 3, 4, 5]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
        <div></div>
      </div>
      <!--  右下 -->
      <div class="right_bottom">
        <div class="right_title"><span v-text="year"></span>&nbsp;隐患数对比</div>
        <!-- 右下echarts -->
        <div class="right_bottom_bar_area">
          <div class="right_bottom_bar" id="right_bottom_bar"></div>
        </div>
      </div>
    </div>
    <!-- 隐患总数详情 -->
    <trouble-num-see v-if="troubleNumSee" ref="troubleNumSee" @troubleHide="troubleHides"></trouble-num-see>
    <!-- 逾期隐患详情 -->
    <overTrouble-num-see v-if="overTroubleNumSee" ref="overTroubleNumSee"
                         @overTroubleHide="overTroubleHides"></overTrouble-num-see>
    <!-- 一般/重大隐患详情 -->
    <majorTrouble-num-see v-if="majorTroubleNumSee" ref="majorTroubleNumSee"
                          @majorTroubleHide="majorTroubleHides"></majorTrouble-num-see>
    <!-- 饼状图已整改/未整改隐患详情 -->
    <trouble-rectify-see v-if="troubleRectifySee" ref="troubleRectifySee"
                         @troubleRectifyHide="troubleRectifyHides"></trouble-rectify-see>
    <!-- 隐患消息详情 -->
    <trouble-message-see v-if="troubleMessageSee" ref="troubleMessageSee"
                         @troubleMessageHide="troubleMessageHides"></trouble-message-see>
  </div>
</template>

<script>
  /* eslint-disable eqeqeq */

  import echarts from 'echarts'
  import troubleNumSee from './troubleViewTroubleNum-see'
  import overTroubleNumSee from './troubleViewOverTroubleNum-see'
  import majorTroubleNumSee from './troubleViewMajorTroubleNum-see'
  import troubleRectifySee from './troubleRectify-see'
  import troubleMessageSee from './troubleMessage-see'

  export default {
    data () {
      return {
        leftBottomBar: null,
        leftCenterPie1: null,
        leftCenterPie2: null,
        rightBottomBar: null,
        year: '',
        troubleCount: '0',
        overdueTroubleCount: '0',
        majorTroubleCount: '0',
        generalTroubleCount: '0',
        pageIndex: 1,
        pageSize: 5,
        totalPage: 0,
        dataListLoading: false,
        dataList: [],
        troubleNumSee: false,
        overTroubleNumSee: false,
        majorTroubleNumSee: false,
        troubleRectifySee: false,
        troubleMessageSee: false,
        chartBarData: [
          {
            name: ['一般隐患', '重大隐患'],
            riskNumList: [5, 8],
            controlledNumList: [7, 3]
          }
        ]
      }
    },
    components: {
      troubleNumSee,
      overTroubleNumSee,
      majorTroubleNumSee,
      troubleRectifySee,
      troubleMessageSee
    },
    mounted () {
      this.initLeftCenterPie1()
      this.initLeftCenterPie2()
      this.initRightBottomBar()
      this.getTroubleCount()
      this.getOverdueTroubleCount()
      this.getMajorTroubleCount()
      this.getGeneralTroubleCount()
      this.getYear()
      this.getDataList()
      this.initLeftBottomBar()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.leftBottomBar) {
        this.leftBottomBar.resize()
      }
      // 左边第一个环状图
      if (this.leftCenterPie1) {
        this.leftCenterPie1.resize()
      }
      // 左边第二个环状图
      if (this.leftCenterPie2) {
        this.leftCenterPie2.resize()
      }
      if (this.RightBottomBar) {
        this.RightBottomBar.resize()
      }
    },
    methods: {
      // 获取当前年份
      getYear () {
        var date = new Date()
        this.year = date.getFullYear()
      },
      // 获取隐患总数
      getTroubleCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.troubleCount = data.map.num
          }
        })
      },
      // 获取逾期隐患数量
      getOverdueTroubleCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/overdueTroubleCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.overdueTroubleCount = data.map.num
          }
        })
      },
      // 获取重大隐患数量
      getMajorTroubleCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleCount'),
          method: 'get',
          params: this.$http.adornParams(
            {'troubleType': 2}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.majorTroubleCount = data.map.num
          }
        })
      },
      // 获取一般隐患数量
      getGeneralTroubleCount () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleCount'),
          method: 'get',
          params: this.$http.adornParams(
            {'troubleType': 1}
          )
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.generalTroubleCount = data.map.num
          }
        })
      },
      // 获取单元分组查看风险和受控数
      getLeftBottomData () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskCtrlView/riskUnitControlledCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.initLeftBottomBar(this.bottomBar, data.requestMap)
          }
        })
      },
      // 左下柱状图
      initLeftBottomBar () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['隐患数量', '已整改隐患数量']
          },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['一般隐患', '重大隐患']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '隐患数量',
              barCategoryGap: '75%',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FECD33'
                }
              },
              data: []
            },
            {
              name: '已整改隐患数量',
              barCategoryGap: '65%',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FF6332'
                }
              },
              data: []
            }
          ]
        }
        // 给左下柱状图赋值
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleTypeCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data = data.map.typeList
            option.series[1].data = data.map.troubleChangeList
            this.leftBottomBar = echarts.init(document.getElementById('left_bottom_bar'))
            this.leftBottomBar.setOption(option)
            window.addEventListener('resize', () => {
              this.leftBottomBar.resize()
            })
          }
        })
      },
      // 左边环状图1
      initLeftCenterPie1 () {
        var option = {
          color: ['#FF6332', '#FECD33', '#FDFE02'],
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
                {value: '', name: '未整改隐患'},
                {value: '', name: '已整改隐患'}
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
                {value: 0}
              ]
            }
          ]
        }
        // 给左边环状图1赋值(已整改，未整改)
        var _this = this
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleChangeCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data[0].value = data.map.notChange
            option.series[0].data[1].value = data.map.haveChange
            this.leftCenterPie1 = echarts.init(document.getElementById('left_center_pie1'))
            this.leftCenterPie1.setOption(option)
            window.addEventListener('resize', () => {
              this.leftCenterPie1.resize()
            })
            this.leftCenterPie1.on('click', function (param) {
              _this.leftCenterPie1.resize()
              var rectifyStatus = param.name == '未整改隐患' ? 1 : param.name == '已整改隐患' ? 2 : ''
              if (rectifyStatus == 1) {
                _this.troubleRectifySee = true
                _this.$nextTick(() => {
                  _this.$refs.troubleRectifySee.getDataList(param.value, rectifyStatus)
                })
              } else if (rectifyStatus == 2) {
                _this.troubleRectifySee = true
                _this.$nextTick(() => {
                  _this.$refs.troubleRectifySee.getDataList(param.value, rectifyStatus)
                })
              }
            })
          }
        })
      },
      // 左边环状图2
      initLeftCenterPie2 () {
        var option = {
          title: {
            text: '隐患整改率',
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
            top: '3%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            padding: '3',
            containLabel: true
          },
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              name: '',
              type: 'gauge',
              center: ['50%', '50%'], // 默认全局居中
              radius: '80%',
              axisLine: {
                show: false,
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    ['', '#FECD33'],
                    [1, '#FF6332']
                  ],
                  width: 25
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
                value: '',
                label: {
                  textStyle: {
                    fontSize: 12
                  }
                }
              }]
            }
          ]
        }
        // 给左边环状图2赋值(隐患整改率)
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleChangeRateCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data[0].value = data.map.troubleRate
            option.series[0].axisLine.lineStyle.color[0][0] = (data.map.troubleRate) / 100
            this.leftCenterPie2 = echarts.init(document.getElementById('left_center_pie2'))
            this.leftCenterPie2.setOption(option)
            window.addEventListener('resize', () => {
              this.leftCenterPie2.resize()
            })
          }
        })
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
              name: '重大隐患',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FF0000'
                }
              },
              data: []
            },
            {
              name: '一般隐患',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#FDFE02'
                }
              },
              data: []
            }
          ]
        }
        // 给右下柱状图赋值
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleForMonthCount'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            option.series[0].data = data.map.majorTrouble
            option.series[1].data = data.map.generalTrouble
            this.rightBottomBar = echarts.init(document.getElementById('right_bottom_bar'))
            this.rightBottomBar.setOption(option)
            window.addEventListener('resize', () => {
              this.rightBottomBar.resize()
            })
          }
        })
      },
      // 获取右上消息数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/troubleView/troubleMessageList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'dataTime': 1
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
      // 隐患数量
      troubleNum () {
        this.troubleNumSee = true
        this.$nextTick(() => {
          this.$refs.troubleNumSee.getDataList(this.troubleCount)
        })
      },
      troubleHides () {
        this.troubleNumSee = false
      },
      // 打开逾期隐患
      overTroubleNum () {
        this.overTroubleNumSee = true
        this.$nextTick(() => {
          this.$refs.overTroubleNumSee.getDataList(this.overdueTroubleCount)
        })
      },
      overTroubleHides () {
        this.overTroubleNumSee = false
      },
      // 打开重大隐患详情
      majorTroubleNum () {
        this.majorTroubleNumSee = true
        this.$nextTick(() => {
          this.$refs.majorTroubleNumSee.getDataList(this.majorTroubleCount, 2)
        })
      },
      // 打开一般隐患详情
      generalTroubleNum () {
        this.majorTroubleNumSee = true
        this.$nextTick(() => {
          this.$refs.majorTroubleNumSee.getDataList(this.generalTroubleCount, 1)
        })
      },
      // 表格某一行点击
      rowClick (row, column, cell, event) {
        this.troubleMessageSee = true
        this.$nextTick(() => {
          this.$refs.troubleMessageSee.getDataList(row.troubleRdId)
        })
      },
      majorTroubleHides () {
        this.majorTroubleNumSee = false
      },
      troubleRectifyHides () {
        this.leftCenterPie1.resize()
        this.troubleRectifySee = false
      },
      troubleMessageHides () {
        this.troubleMessageSee = false
      }
    }
  }
</script>
<style>

  .clear {
    display: block;
    overflow: hidden;
  }

  .trouble_content {
    width: 100%;
    height: 780px;
  }

  .trouble_content .left {
    float: left;
    width: 45%;
    height: 100%;
  }

  .trouble_content .left_top {
    width: 100%;
    height: 10%;
  }

  .trouble_content .left_top ul {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  .trouble_content .left_top .riskNum {
    float: left;
    width: 26%;
    height: 100%;
    font-size: 16px;
    text-align: center;
  }

  .trouble_content .left_top ul li {
    float: left;
    width: 22.5%;
    height: 100%;
    font-size: 16px;
    text-align: center;
  }

  .trouble_content .li_style {
    margin-left: 2%;
  }

  .trouble_content .li_lable {
    width: 100%;
    height: 40%;
    line-height: 32px;
    background-color: #CCCCCC;
  }

  .trouble_content .li_content {
    width: 100%;
    height: 60%;
    line-height: 48px;
    background-color: #F2F2F2;
  }

  .trouble_content .li_content a {
    font-weight: bold;
  }

  .trouble_content .left_center {
    width: 100%;
    height: 50%;
  }

  .trouble_content #left_center_pie1 {
    float: left;
    width: 50%;
    height: 100%;
  }

  .trouble_content #left_center_pie2 {
    float: left;
    width: 50%;
    height: 100%;
  }

  .trouble_content .left_bottom {
    width: 100%;
    height: 40%;
  }

  .trouble_content #left_bottom_bar {
    width: 100%;
    height: 100%;
  }

  .trouble_content .right {
    float: left;
    width: 53%;
    height: 100%;
    margin-left: 2%;
  }

  .trouble_content .right_title {
    font-size: 16px;
    padding: 5px;
    width: 40%;
    background-color: #F2F2F2;
  }

  .trouble_content .right_top {
    width: 100%;
    height: 50%;
  }

  .trouble_content .table_area {
    width: 100%;
    height: 90%;
    margin-top: 1%;
  }

  .trouble_content .right_bottom {
    width: 100%;
    height: 50%;
  }

  .trouble_content .right_bottom_bar_area {
    width: 100%;
    height: 90%;
    margin-top: 1%;
  }

  .trouble_content #right_bottom_bar {
    width: 100%;
    height: 100%;
  }

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
