<template>
  <div class="monitor_content">
    <!-- 页面分为上下两个部分 -->
    <div class="top clear">
      <!-- 上左 -->
      <div class="top_left">
        <!-- 上左搜索框 -->
        <div class="search_area">
          <!--  <el-select v-model="monitor" placeholder="监测系统" class="search_sensor">
              <el-option
                v-for="item in monitorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>-->
          <el-select v-model="areaName" placeholder="区域" class="search" filterable clearable @change="getChangeData()">
            <el-option
              v-for="item in sensorAreaOptions"
              :key="item.areaName"
              :label="item.areaName"
              :value="item.areaName">
            </el-option>
          </el-select>
          <el-select v-model="sensor" placeholder="传感器名称" class="search_sensor" filterable clearable
                     @focus="getDeviceNameTree()" @change="getChangeData2()">
            <el-option
              v-for="item in sensorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="area" placeholder="所放区域" class="search_sensor" filterable clearable>
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getAreaData()" :disabled="!sensor || !area">查询</el-button>
        </div>
        <!-- 上左具体内容-->
        <div class="show_content">
          <ul class="clear">
            <li id="echarts_line_1"></li>
            <li id="echarts_line_2"></li>
            <li id="echarts_line_3"></li>
            <li id="echarts_line_4"></li>
          </ul>
        </div>
      </div>
      <!-- 上右 -->
      <div class="top_right">
        <!-- 上右搜索框 -->
        <div class="search_area">
          <div class="selectList">

            <select class="sel" v-model="id" @change="getConfigList()">
              <option value="" selected style="display: none;">设备IP</option>
              <option v-for="item in ipOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                {{item.label}}
              </option>
            </select>
            <select class="sel" id="channels">
              <option value="" selected style="display: none;">通道列表</option>
              <option></option>
            </select>
            <select class="sel2" v-model="winType" @change="changeWndNum(winType);">
              <option value="" selected style="display: none;">窗口分割数</option>
              <option value="1">1x1</option>
              <option value="2" selected>2x2</option>
              <option value="3">3x3</option>
              <option value="4">4x4</option>
            </select>
          </div>
        </div>
        <!-- 上右具体内容-->
        <div class="show_content" style="position: relative;">
          <div class="left">
            <div id="divPlugin_view" class="plugin_view"></div>
            <table cellspacing="0" cellpadding="0" style="position: absolute; right: 0; top: 40%;">
              <tr>
                <img title="全屏"
                     style="cursor: pointer;"
                     @click="clickFullScreen();"
                     :src="img1">
              </tr>
              <tr>
                <img title="开始预览" id="play"
                     style="cursor: pointer;"
                     v-on:mouseover="bigImg(1)" @mouseout="normalImg(1)"
                     @click="clickStartRealPlay();"
                     :src="img2">
              </tr>
              <tr>
                <img title="停止预览" id="stop"
                     style="cursor: pointer;"
                     v-on:mouseover="bigImg(2)" @mouseout="normalImg(2)"
                     @click="clickStopRealPlay();"
                     :src="img3">
              </tr>
              <tr>
                <img title="抓图"
                     style="cursor: pointer;"
                     v-on:mouseover="bigImg(3)" @mouseout="normalImg(3)"
                     @click="clickCapturePic();"
                     :src="img4">
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom clear">
      <!-- 下左 -->
      <div class="bottom_left">
        <div class="show_more"><a @click="getSensorConfigInfo()"><span>更多...</span></a></div>
        <!-- 传感器配置信息 -->.
        <div class="table_area">
          <!-- 放表格的部分 -->
          <el-table
            :data="configDataList"
            border
            height="230"
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="deviceName"
              header-align="center"
              align="center"
              label="传感器名称">
            </el-table-column>
            <el-table-column
              width="100px"
              prop="high1"
              header-align="center"
              align="center"
              label="正常值上限">
            </el-table-column>
            <el-table-column
              width="100px"
              prop="low1"
              header-align="center"
              align="center"
              label="正常值下限">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="maxExcep"
              header-align="center"
              align="center"
              label="报警上限">
            </el-table-column>
            <el-table-column
              prop="deviceLoca"
              header-align="center"
              align="center"
              label="安装位置">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="configSizeChangeHandle"
            @current-change="configCurrentChangeHandle"
            :current-page="configPageIndex"
            :page-sizes="[1, 2, 3, 4, 5]"
            :page-size="configPageSize"
            :total="configTotalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
      <!-- 下右 -->
      <div class="bottom_right">
        <div class="show_more"><a @click="getSensorWarnInfo"><span>更多...</span></a></div>
        <!-- 表格内容 -->.
        <div class="table_area">
          <!-- 放表格的部分 -->
          <el-table
            :data="warnDataList"
            border
            height="230"
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="deviceName"
              header-align="center"
              align="center"
              label="传感器名称">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="alertDegree"
              header-align="center"
              align="center"
              label="报警级别">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="realValue"
              header-align="center"
              align="center"
              label="当前值">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="unit"
              header-align="center"
              align="center"
              label="计量单位">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="maxExcep"
              header-align="center"
              align="center"
              label="报警上限">
            </el-table-column>
            <el-table-column
              width="80px"
              prop="minExcep"
              header-align="center"
              align="center"
              label="报警下限">
            </el-table-column>
            <el-table-column
              width="180px"
              prop="alarmTime"
              header-align="center"
              align="center"
              label="报警时间">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="warnSizeChangeHandle"
            @current-change="warnCurrentChangeHandle"
            :current-page="warnPageIndex"
            :page-sizes="[1, 2, 3, 4, 5]"
            :page-size="warnPageSize"
            :total="warnTotalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 传感器配置详细信息 -->
    <sensor-config-info v-if="sensorConfigInfo" ref="sensorConfigInfo"
                        @sensorConfigInfoHide="sensorConfigInfoHides"></sensor-config-info>
    <!-- 传感器预警详细信息 -->
    <sensor-warn-info v-if="sensorWarnInfo" ref="sensorWarnInfo"
                      @sensorWarnInfoHide="sensorWarnInfoHides"></sensor-warn-info>
  </div>
</template>

<script>
  /* eslint-disable camelcase,no-undef,eqeqeq */
  import echarts from 'echarts'
  import sensorConfigInfo from './sensorConfig-info'
  import sensorWarnInfo from './sensorWarn-info'
  // 全局保存当前选中窗口
  // 可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
  var g_iWndIndex = 0
  export default {
    data () {
      return {
        timer: '',
        type: 0,
        chartBar: null,
        echartsLine1: null,
        echartsLine2: null,
        echartsLine3: null,
        echartsLine4: null,
        configPageIndex: 1,
        configPageSize: 3,
        configTotalPage: 0,
        warnPageIndex: 1,
        warnPageSize: 3,
        warnTotalPage: 0,
        dataListLoading: false,
        sensorConfigInfo: false,
        sensorWarnInfo: false,
        sensor: '',
        area: '',
        id: '',
        szIP: '',
        winType: '',
        img1: '',
        img2: '',
        img3: '',
        img4: '',
        areaName: '',
        configDataList: [],
        warnDataList: [],
        ipOptions: [],
        sensorOptions: [],
        areaOptions: [{
          value: 1,
          label: 'A区',
          deviceId: '0'
        }, {
          value: 2,
          label: 'B区',
          deviceId: '0'
        }, {
          value: 3,
          label: 'C区',
          deviceId: '0'
        }, {
          value: 4,
          label: 'D区',
          deviceId: '0'
        }],
        option: [],
        // 模拟数据库中的数据
        sensorList: [
          {name: '无数据', unit: '%', timeList: ['00:00'], valueList: [0]},
          {name: '无数据', unit: '%', timeList: ['00:00'], valueList: [0]},
          {name: '无数据', unit: '%', timeList: ['00:00'], valueList: [0]},
          {name: '无数据', unit: '%', timeList: ['00:00'], valueList: [0]}
        ],
        sensorAreaOptions: []
      }
    },
    components: {
      sensorConfigInfo,
      sensorWarnInfo
    },
    mounted () {
      this.getAreaName()
      this.getDeviceNameTree()
      this.initImg()
      this.getConfigDataList()
      this.getWarnDataList()
      this.getVideoIP()
      this.initSensorData()
      // this.initSensorData()
      // this.initChartLine(this.echartsLine1, this.sensorList[0], 'echarts_line_1', 'A', '#FF0000')
      // this.initChartLine(this.echartsLine2, this.sensorList[1], 'echarts_line_2', 'B', '#FF9900')
      // this.initChartLine(this.echartsLine3, this.sensorList[2], 'echarts_line_3', 'C', '#FDFE02')
      // this.initChartLine(this.echartsLine4, this.sensorList[3], 'echarts_line_4', 'D', '#009cff')
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.echartsLine1) {
        this.echartsLine1.resize()
      }
      if (this.echartsLine2) {
        this.echartsLine2.resize()
      }
      if (this.echartsLine3) {
        this.echartsLine3.resize()
      }
      if (this.echartsLine4) {
        this.echartsLine4.resize()
      }
      this.initVideo()
      this.intervalBegin()
    },
    deactivated () {
      console.log('keep-alive 组件停用时调用开始')
      this.intervalEnd()
      console.log('keep-alive 组件停用时调用结束')
    },
    methods: {
      initImg () {
        this.img1 = require('../../../../static/img/video/quan.png')
        this.img2 = require('../../../../static/img/video/RealPlayAll.png')
        this.img3 = require('../../../../static/img/video/StopAll.png')
        this.img4 = require('../../../../static/img/video/Capture.png')
      },
      bigImg (x) {
        if (x == 1) {
          this.img2 = require('../../../../static/img/video/SelRealPlayAll.png')
        } else if (x == 2) {
          this.img3 = require('../../../../static/img/video/SelStopAll.png')
        } else if (x == 3) {
          this.img4 = require('../../../../static/img/video/SelCapture.png')
        }
      },
      normalImg (x) {
        if (x == 1) {
          this.img2 = require('../../../../static/img/video/RealPlayAll.png')
        } else if (x == 2) {
          this.img3 = require('../../../../static/img/video/StopAll.png')
        } else if (x == 3) {
          this.img4 = require('../../../../static/img/video/Capture.png')
        }
      },
      getChangeData () {
        this.getDeviceNameTree()
        this.getChangeData2()
      },
      getChangeData2 () {
        this.getConfigDataList()
        this.getWarnDataList()
      },
      initVideo () {
        // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall()
        if (iRet == -2) {
          alert('您的Chrome浏览器版本过高，不支持NPAPI插件！')
          return
        } else if (iRet == -1) {
          this.openMessage()
          // $('#mesDiv').show()
          // let down = confirm('您的电脑未安装视频控件,点击确定下载安装！')
          // if (down == true) {
          //   this.openMessage()
          //   // window.location.href = '../../../../static/plugins/video/WebComponentsKit.exe'
          // }
          return
        }

        // 初始化插件参数及插入插件
        var w = document.body.clientWidth * 0.35
        var h = document.body.clientHeight * 0.3
        WebVideoCtrl.I_InitPlugin(w, h, {
          bWndFull: true, // 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
          iWndowType: 2,
          cbSelWnd: function (xmlDoc) {
            g_iWndIndex = $(xmlDoc).find('SelectWnd').eq(0).text()
            // var szInfo = '当前选择的窗口编号：' + g_iWndIndex
            // this.showCBInfo(szInfo);
          }
        })
        // WebVideoCtrl.I_WriteOBJECT_XHTML('divPlugin_view')
        WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin_view')

        // 窗口事件绑定
        $(window).bind({
          resize: function () {
            var $Restart = $('#restartDiv')
            if ($Restart.length > 0) {
              var oSize = getWindowSize()
              $Restart.css({
                width: oSize.width + 'px',
                height: oSize.height + 'px'
              })
            }
          }
        })
      },
      // 格式化时间
      dateFormat (oDate, fmt) {
        var o = {
          'M+': oDate.getMonth() + 1, // 月份
          'd+': oDate.getDate(), // 日
          'h+': oDate.getHours(), // 小时
          'm+': oDate.getMinutes(), // 分
          's+': oDate.getSeconds(), // 秒
          'q+': Math.floor((oDate.getMonth() + 3) / 3), // 季度
          'S': oDate.getMilliseconds()// 毫秒
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      },
      // 获取窗口尺寸
      getWindowSize () {
        nWidth = $(this).width() + $(this).scrollLeft()
        nHeight = $(this).height() + $(this).scrollTop()

        return {width: nWidth, height: nHeight}
      },
      // 窗口分割数
      changeWndNum (iType) {
        // console.log(iType)
        iType = parseInt(iType, 10)
        WebVideoCtrl.I_ChangeWndNum(iType)
      },
      // 登录
      clickLogin (szIP, szPort, szUsername, szPassword) {
        if (szIP == '' || szPort == '') {
          return
        }
        // console.log(this.szIP + ' ' + this.szPort + ' ' + this.szUsername + ' ' + this.szPassword)
        var _this = this
        WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
          success: function (xmlDoc) {
            // console.log('登陆成功  szIP' + szIP)
            $('#ip').prepend("<option value='" + szIP + "'>" + szIP + '</option>')
            setTimeout(function () {
              $('#ip').val(_this.szIP)
              _this.getChannelInfo()
            }, 10)
          }
        })
      },
      // 退出
      clickLogout () {
        if (this.szIP == '') {
          return
        }
        var iRet = WebVideoCtrl.I_Logout(this.szIP)
        if (iRet == 0) {
          // console.log('退出成功')
          // this.ipOptions = ''
          this.getChannelInfo()
        }
      },
      // 获取通道
      getChannelInfo () {
        // console.log('获取通道 this.szIP  ' + this.szIP)
        var oSel = $('#channels').empty()
        if (this.szIP == '') {
          return
        }
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(this.szIP, {
          async: false,
          success: function (xmlDoc) {
            // console.log('模拟通道')
            var oChannels = $(xmlDoc).find('VideoInputChannel')

            $.each(oChannels, function (i) {
              var id = $(this).find('id').eq(0).text()
              var name = $(this).find('name').eq(0).text()
              if (name == '') {
                name = 'Camera ' + (i < 9 ? '0' + (i + 1) : (i + 1))
              }
              oSel.append("<option value='" + id + "' bZero='false'>" + name + '</option>')
            })
          }
        })
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(this.szIP, {
          async: false,
          success: function (xmlDoc) {
            // console.log('数字通道')
            var oChannels = $(xmlDoc).find('InputProxyChannelStatus')

            $.each(oChannels, function (i) {
              var id = $(this).find('id').eq(0).text()
              var name = $(this).find('name').eq(0).text()
              var online = $(this).find('online').eq(0).text()
              if (online == 'false') { // 过滤禁用的数字通道
                return true
              }
              if (name == '') {
                name = 'IPCamera ' + (i < 9 ? '0' + (i + 1) : (i + 1))
              }
              oSel.append("<option value='" + id + "' bZero='false'>" + name + '</option>')
            })
          }
        })
        // 零通道
        WebVideoCtrl.I_GetZeroChannelInfo(this.szIP, {
          async: false,
          success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find('ZeroVideoChannel')

            $.each(oChannels, function (i) {
              var id = $(this).find('id').eq(0).text()
              var name = $(this).find('name').eq(0).text()
              if (name == '') {
                name = 'Zero Channel ' + (i < 9 ? '0' + (i + 1) : (i + 1))
              }
              if ($(this).find('enabled').eq(0).text() == 'true') { // 过滤禁用的零通道
                oSel.append("<option value='" + id + "' bZero='true'>" + name + '</option>')
              }
            })
          }
        })
      },
      // 获取数字通道
      clickGetDigitalChannelInfo () {
        // this.szIP = $('#ip').val()
        var iAnalogChannelNum = 0

        $('#digitalchannellist').empty()

        if (this.szIP == '') {
          return
        }

        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(this.szIP, {
          async: false,
          success: function (xmlDoc) {
            iAnalogChannelNum = $(xmlDoc).find('VideoInputChannel').length
          }
        })
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(this.szIP, {
          async: false,
          success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find('InputProxyChannelStatus')

            $.each(oChannels, function () {
              var id = parseInt($(this).find('id').eq(0).text(), 10)
              var ipAddress = $(this).find('ipAddress').eq(0).text()
              var srcInputPort = $(this).find('srcInputPort').eq(0).text()
              var managePortNo = $(this).find('managePortNo').eq(0).text()
              var online = $(this).find('online').eq(0).text()
              var proxyProtocol = $(this).find('proxyProtocol').eq(0).text()

              var objTr = $('#digitalchannellist').get(0).insertRow(-1)
              var objTd = objTr.insertCell(0)
              objTd.innerHTML = (id - iAnalogChannelNum) < 10 ? 'D0' + (id - iAnalogChannelNum) : 'D' + (id - iAnalogChannelNum)
              objTd = objTr.insertCell(1)
              objTd.width = '25%'
              objTd.innerHTML = ipAddress
              objTd = objTr.insertCell(2)
              objTd.width = '15%'
              objTd.innerHTML = srcInputPort
              objTd = objTr.insertCell(3)
              objTd.width = '20%'
              objTd.innerHTML = managePortNo
              objTd = objTr.insertCell(4)
              objTd.width = '15%'
              objTd.innerHTML = online == 'true' ? '在线' : '离线'
              objTd = objTr.insertCell(5)
              objTd.width = '25%'
              objTd.innerHTML = proxyProtocol
            })
          }
        })
      },
      // 开始预览
      clickStartRealPlay () {
        // console.log('开始预览 szIP' + this.szIP)
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
        var iStreamType = parseInt(1, 10)
        var iChannelID = parseInt($('#channels').val(), 10)
        var bZeroChannel = $('#channels option').eq($('#channels').get(0).selectedIndex).attr('bZero') == 'true'
        // console.log('bZeroChannel: ' + bZeroChannel)
        if (this.szIP == '') {
          return
        }
        if (oWndInfo != null) { // 已经在播放了，先停止
          WebVideoCtrl.I_Stop()
        }
        WebVideoCtrl.I_StartRealPlay(this.szIP, {
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          bZeroChannel: bZeroChannel
        })
      },
      // 停止预览
      clickStopRealPlay () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
        if (oWndInfo != null) {
          WebVideoCtrl.I_Stop()
        }
      },
      // 抓图
      clickCapturePic () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
        if (oWndInfo != null) {
          var szChannelID = $('#channels').val()
          var szPicName = oWndInfo.szIP + '_' + szChannelID + '_' + new Date().getTime()
          var iRet = WebVideoCtrl.I_CapturePic(szPicName)
          if (iRet == 0) {
            this.$message.success('抓图成功！')
          } else {
            this.$message.error('抓图失败！')
          }
        }
      },
      // 全屏
      clickFullScreen () {
        WebVideoCtrl.I_FullScreen(true)
      },

      // // 设置区域
      // setArea () {
      //   // console.log(this.area)
      //   if (this.area == 1) {
      //     this.sensorA = this.sensor
      //     this.initSensorDataA()
      //   }
      //   if (this.area == 2) {
      //     this.sensorB = this.sensor
      //     this.initSensorDataB()
      //   }
      //   if (this.area == 3) {
      //     this.sensorC = this.sensor
      //     this.initSensorDataC()
      //   }
      //   if (this.area == 4) {
      //     this.sensorD = this.sensor
      //     this.initSensorDataD()
      //   }
      // },
      // // 选择A区
      // initSensorDataA () {
      //   console.log('A区' + this.sensorA)
      //   this.$http({
      //     url: this.$http.adornUrl('/infoDisplay/monitorView/sensorView'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       'deviceId': this.sensorA
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       console.log('传感器数据A调用')
      //       // console.log(this.option)
      //       // console.log('颜色' + this.option.color)
      //       // console.log('是否有数据：' + (data.map.name == null))
      //       this.option.color[0] = 'red'
      //       this.option.title.text[0] = 'A' + ' ' + data.map.name
      //       this.option.xAxis.data = data.map.timeList
      //       this.option.series[0].data = data.map.valueList
      //       this.echartsLine1.setOption(this.option)
      //       if (data.map.name == null) {
      //         this.echartsLine1.setOption(this.option)
      //       }
      //     }
      //   })
      // },
      // // 选择B区
      // initSensorDataB () {
      //   this.$http({
      //     url: this.$http.adornUrl('/infoDisplay/monitorView/sensorView'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       'deviceId': this.sensorB
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       console.log('传感器数据B调用')
      //       this.option.color[0] = 'orange'
      //       this.option.title.text[0] = 'B' + ' ' + data.map.name
      //       this.option.xAxis.data = data.map.timeList
      //       this.option.series[0].data = data.map.valueList
      //       this.echartsLine2.setOption(this.option)
      //       if (data.map.name == null) {
      //         this.echartsLine2.setOption(this.option)
      //       }
      //     }
      //   })
      // },
      // // 选择C区
      // initSensorDataC () {
      //   this.$http({
      //     url: this.$http.adornUrl('/infoDisplay/monitorView/sensorView'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       'deviceId': this.sensorC
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       console.log('传感器数据C调用')
      //       this.option.color[0] = 'yellow'
      //       this.option.title.text[0] = 'C' + ' ' + data.map.name
      //       this.option.xAxis.data = data.map.timeList
      //       this.option.series[0].data = data.map.valueList
      //       this.echartsLine3.setOption(this.option)
      //       if (data.map.name == null) {
      //         this.echartsLine3.setOption(this.option)
      //       }
      //     }
      //   })
      // },
      // // 选择D区
      // initSensorDataD () {
      //   this.$http({
      //     url: this.$http.adornUrl('/infoDisplay/monitorView/sensorView'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       'deviceId': this.sensorD
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       console.log('传感器数据D调用')
      //       this.option.color[0] = 'blue'
      //       this.option.title.text[0] = 'D' + ' ' + data.map.name
      //       this.option.xAxis.data = data.map.timeList
      //       this.option.series[0].data = data.map.valueList
      //       this.echartsLine4.setOption(this.option)
      //       if (data.map.name == null) {
      //         this.echartsLine4.setOption(this.option)
      //       }
      //     }
      //   })
      // },
      //  初始化传感器数据
      initSensorData () {
        this.echartsLine1 = echarts.init(document.getElementById('echarts_line_1'))
        this.echartsLine2 = echarts.init(document.getElementById('echarts_line_2'))
        this.echartsLine3 = echarts.init(document.getElementById('echarts_line_3'))
        this.echartsLine4 = echarts.init(document.getElementById('echarts_line_4'))
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/monitorView/initSensorView'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log('传感器初始数据调用')
            for (var x in data.dataList) {
              this.sensorList[x] = data.dataList[x]
              this.areaOptions[x].deviceId = data.dataList[x].deviceId
            }
            this.getEchartData()
          }
        })
      },
      getEchartData () {
        this.initChartLine(this.echartsLine1, this.sensorList[0], 'A', '#009cff')
        this.initChartLine(this.echartsLine2, this.sensorList[1], 'B', '#009cff')
        this.initChartLine(this.echartsLine3, this.sensorList[2], 'C', '#009cff')
        this.initChartLine(this.echartsLine4, this.sensorList[3], 'D', '#009cff')
      },
      //  折线图
      initChartLine (chartLine, data, text, color) {
        var option = {
          color: [color],
          title: {
            text: text + ' ' + (data.name == undefined ? '无数据' : data.name),
            textStyle: {
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: '6%',
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '18%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timeList
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '',
              type: 'line',
              // 设置图形阴影的代码
              // itemStyle: {
              //   normal: {
              //     areaStyle: {}
              //   }
              // },
              smooth: true,
              data: data.valueList
            }
          ]
        }
        chartLine.setOption(option)
        window.addEventListener('resize', () => {
          chartLine.resize()
        })
      },
      // 区域切换，将传感器id赋值给区域
      getAreaData () {
        this.areaOptions[this.area - 1].deviceId = this.sensor
        this.showSensorData()
      },
      // 根据条件切换传感器数据（ 保留一段时间）
      showSensorData () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/monitorView/sensorView'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceId0': this.areaOptions[0].deviceId,
            'deviceId1': this.areaOptions[1].deviceId,
            'deviceId2': this.areaOptions[2].deviceId,
            'deviceId3': this.areaOptions[3].deviceId
          })
        }).then(({data}) => {
          for (var x in data.dataList) {
            this.sensorList[x] = data.dataList[x]
          }
          this.getEchartData()
        })
      },
      // 获取配置信息列表
      getConfigDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.configPageIndex,
            'limit': this.configPageSize,
            'deviceId': this.sensor,
            'areaName': this.areaName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.configDataList = data.page.list
            this.configTotalPage = data.page.totalCount
          } else {
            this.configDataList = []
            this.configTotalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 获取预警信息列表
      getWarnDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorDataWarn/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.warnPageIndex,
            'limit': this.warnPageSize,
            'deviceId': this.sensor,
            'date': '0',
            'areaName': this.areaName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.warnDataList = data.page.list
            this.warnTotalPage = data.page.totalCount
          } else {
            this.warnDataList = []
            this.warnTotalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 配置每页数
      configSizeChangeHandle (val) {
        this.configPageSize = val
        this.configPageIndex = 1
        this.getConfigDataList()
      },
      // 配置当前页
      configCurrentChangeHandle (val) {
        this.configPageIndex = val
        this.getConfigDataList()
      },
      // 预警每页数
      warnSizeChangeHandle (val) {
        this.warnPageSize = val
        this.warnPageIndex = 1
        this.getWarnDataList()
      },
      // 预警当前页
      warnCurrentChangeHandle (val) {
        this.warnPageIndex = val
        this.getWarnDataList()
      },
      // 查询区域
      getAreaName () {
        this.$http({
          url: this.$http.adornUrl(`/monitor/sensorConfig/sensorConfigAreaName`),
          method: 'get',
          params: this.$http.adornParams({
            eid: this.eId
          })
        }).then(({data}) => {
          this.sensorAreaOptions = data.list
        })
      },
      // 获取传感器名称
      getDeviceNameTree () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/deviceNameList'),
          method: 'get',
          params: this.$http.adornParams({
            'eId': this.eId,
            'areaName': this.areaName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            // console.log('初始化传感器树')
            this.sensorOptions = data.list
            if (this.sensorA == '' && data.list[0] != null) {
              this.sensorA = data.list[0].value
            }
            if (this.sensorB == '' && data.list[1] != null) {
              this.sensorB = data.list[1].value
            }
            if (this.sensorC == '' && data.list[2] != null) {
              this.sensorC = data.list[2].value
            }
            if (this.sensorD == '' && data.list[3] != null) {
              this.sensorD = data.list[3].value
            }
          } else {
            this.sensorOptions = []
          }
        })
      },
      // 获取视频ip树
      getVideoIP () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorView/videoIPTree'),
          method: 'get',
          params: this.$http.adornParams({
            'eId': this.eId
          })
        }).then(({data}) => {
          if (data && data.code == 0) {
            this.ipOptions = data.list
          } else {
            this.ipOptions = []
          }
        })
      },
      // 获取视频配置信息
      getConfigList () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorView/videoConfigList'),
          method: 'get',
          params: this.$http.adornParams({
            'id': this.id
          })
        }).then(({data}) => {
          if (data && data.code == 0) {
            this.szIP = data.mapList[0].ip
            this.clickLogout()
            this.clickLogin(this.szIP, data.mapList[0].port, data.mapList[0].codeName, data.mapList[0].pwd)
          }
        })
      },
      // 打开配置详情
      getSensorConfigInfo () {
        $('#divPlugin_view').css('display', 'none')
        this.sensorConfigInfo = true
        this.$nextTick(() => {
          this.$refs.sensorConfigInfo.getDataList()
        })
      },
      // 隐藏配置详情
      sensorConfigInfoHides () {
        $('#divPlugin_view').css('display', 'block')
        this.sensorConfigInfo = false
      },
      // 打开预警详情
      getSensorWarnInfo () {
        $('#divPlugin_view').css('display', 'none')
        this.sensorWarnInfo = true
        this.$nextTick(() => {
          this.$refs.sensorWarnInfo.getDataList()
        })
      },
      // 隐藏预警详情
      sensorWarnInfoHides () {
        $('#divPlugin_view').css('display', 'block')
        this.sensorWarnInfo = false
      },
      // 定时刷新echarts图
      intervalBegin () {
        this.timer = setInterval(() => {
          this.showSensorData()
        }, 3000)
      },
      // 窗口切换后关闭定时器
      intervalEnd () {
        clearInterval(this.timer)
        console.log('停止定时器')
      },
      // 插件安装提示
      openMessage () {
        this.$confirm('您的电脑未安装视频控件,点击确定下载安装！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = require('../../../../static/plugins/video/WebComponentsKit.exe')
        })
      }
    }
  }
</script>
<style>
  @import "../../../../static/plugins/video/video.css";

  .clear {
    display: block;
    overflow: hidden;
  }

  .monitor_content {
    width: 100%;
    height: 780px;
  }

  .monitor_content .top {
    width: 100%;
    height: 50%;
  }

  .monitor_content .top_left {
    float: left;
    width: 49%;
    height: 100%;
  }

  .monitor_content .top_right {
    float: left;
    width: 49%;
    margin-left: 2%;
    height: 100%;
  }

  .monitor_content .search_area {
    width: 100%;
    height: 13%;
  }

  .monitor_content .show_content {
    width: 100%;
    height: 88%;
  }

  .monitor_content .show_content ul {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  .monitor_content .show_content ul li {
    float: left;
    width: 50%;
    height: 49%;
    border: 1px solid #DCDFE6;
  }

  .monitor_content .bottom {
    width: 100%;
    height: 49%;
  }

  .monitor_content .bottom_left {
    float: left;
    width: 49%;
    height: 100%;
  }

  .monitor_content .bottom_right {
    float: left;
    width: 49%;
    margin-left: 2%;
    height: 100%;
  }

  .monitor_content .show_more {
    width: 100%;
    height: 8%;
    text-align: right;
    padding: 20px 15px 0px 0px;
  }

  .monitor_content .table_area {
    width: 100%;
    height: 92%;
  }

  .sensorBox {
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1999;
    padding: 20px;
    width: 100%;
    height: 100%;
  }

  .sensorBox::-webkit-scrollbar {
    width: 0;
  }

  .sensorClose {
    text-align: right;
    font-size: 20px;
  }

  .sensorTitle {
    font-size: 18px;
    line-height: 2.5em;
  }

  /*select原生样式修改*/
  .selectList {
    display: flex;
  }

  .selectList select::-ms-expand, .selectList option::-ms-expand {
    display: none;
    outline: none;
  }

  .selectList select, .selectList option {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
  }

  .selectList select::-ms-expand, .selectList option::-ms-expand {

  }

  .selectList select {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 40px;
    line-height: 100%;
    padding: 0 15px;
  }

  .selectList select:hover {
    border: 1px solid #c0c4cc;
  }

  .selectList select:focus {
    border: 1px solid #17B3A3;
  }

  .selectList option {
    font-size: 14px;
    color: #606266;
    line-height: 2em;
  }

</style>
