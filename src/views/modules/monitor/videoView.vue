<template>
  <div class="video_content">
    <!-- 顶部搜索框-->
    <div class="all_search">
      <!--<label>企业:</label>-->
      <select class="sel" v-model="eId" @focus="getEnterpriseTree() "
              @change="getVideoIP()">
        <option value="" selected style="display: none;">选择企业</option>
        <option v-for="item in eIdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                selected="selected[0]">
          {{item.label}}
        </option>
      </select>
      <!--<label>设备IP:</label>-->
      <select class="sel" v-model="id" @focus="getVideoIP()"
              @change="getConfigList()">
        <option value="" selected style="display: none;">设备IP</option>
        <option v-for="item in ipOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
          {{item.label}}
        </option>
      </select>
      <!--<label>通道列表:</label>-->
      <select class="sel" id="channels">
        <option value="" selected style="display: none;">通道列表</option>
        <option></option>
      </select>
      <!--<label>窗口分割数:</label>-->
      <select class="sel2" v-model="winType" @change="changeWndNum(winType);">
        <option value="" selected style="display: none;">窗口分割数</option>
        <option value="1">1x1</option>
        <option value="2" selected>2x2</option>
        <option value="3">3x3</option>
        <option value="4">4x4</option>
      </select>
    </div>
    <!-- 视频主体部分 -->
    <div class="video_major clear">
      <!-- 主体分为两个部分 -->
      <!-- 左边视频部分 -->
      <!--onmouseover="this.src = '../../../../static/img/video/quan.png'"-->
      <!--onmouseout="this.src ='../../../../static/img/video/quan.png'"-->
      <div class="left">
        <div id="divPlugin" class="plugin"></div>
        <table cellspacing="0" cellpadding="0" width="136" style="margin: 0 auto;">
          <tr>
            <td>
              <img title="全屏"
                   style="cursor: pointer;"
                   @click="clickFullScreen();"
                   :src="img1">
            </td>
            <td>
              <img title="开始预览" id="play"
                   style="cursor: pointer;"
                   v-on:mouseover="bigImg(1)" @mouseout="normalImg(1)"
                   @click="clickStartRealPlay();"
                   :src="img2">
            </td>
            <td>
              <img title="停止预览" id="stop"
                   style="cursor: pointer;"
                   v-on:mouseover="bigImg(2)" @mouseout="normalImg(2)"
                   @click="clickStopRealPlay();"
                   :src="img3">
            </td>
            <td>
              <img title="抓图"
                   style="cursor: pointer;"
                   v-on:mouseover="bigImg(3)" @mouseout="normalImg(3)"
                   @click="clickCapturePic();"
                   :src="img4">
            </td>
          </tr>
        </table>
      </div>
      <!-- 右边表格部分 -->
      <div class="right">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="infoId"
            header-align="center"
            align="center"
            label="信号通道">
          </el-table-column>
          <el-table-column
            prop="watchSite"
            header-align="center"
            align="center"
            label="视频位置">
          </el-table-column>
          <el-table-column
            prop="memo"
            header-align="center"
            align="center"
            label="说明">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[1, 2, 3,4,5]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  /* eslint-disable camelcase,no-undef,eqeqeq */

  // 全局保存当前选中窗口
  // 可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
  var g_iWndIndex = 0
  export default {
    data () {
      return {
        id: '',
        eId: '',
        channels: '',
        pageIndex: 1,
        pageSize: 3,
        totalPage: 0,
        dataListLoading: false,
        dataList: [],
        eIdOptions: [],
        ipOptions: [],
        szIP: '',
        winType: '',
        img1: '',
        img2: '',
        img3: '',
        img4: ''
      }
    },
    mounted () {
      this.getDataList()
      this.initImg()
      this.getEnterpriseTree()
      this.getVideoIP()
    },
    activated () {
      this.initVideo()
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
      initVideo () {
        // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall()
        if (iRet == -2) {
          alert('您的Chrome浏览器版本过高，不支持NPAPI插件！')
          return
        } else if (iRet == -1) {
          this.openMessage()
          // alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
          // $('#mesDiv').show()
          // let down = confirm('您的电脑未安装视频控件,点击确定下载安装！')
          // if (down == true) {
          //   window.location.href = '../../../../static/plugins/video/WebComponentsKit.exe'
          // }
          return
        }

        // 初始化插件参数及插入插件
        var w = document.body.clientWidth * 0.52
        var h = document.body.clientHeight * 0.68
        WebVideoCtrl.I_InitPlugin(w, h, {
          bWndFull: true, // 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
          iWndowType: 2,
          cbSelWnd: function (xmlDoc) {
            g_iWndIndex = $(xmlDoc).find('SelectWnd').eq(0).text()
            // var szInfo = '当前选择的窗口编号：' + g_iWndIndex
            // this.showCBInfo(szInfo);
          }
        })
        WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin')

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
        // this.szIP = $('#loginip').val()
        // var szPort = $('#port').val()
        // var szUsername = $('#username').val()
        // var szPassword = $('#password').val()

        if (szIP == '' || szPort == '') {
          return
        }
        // console.log('准备登录： ' + szIP, szPort, szUsername, szPassword)
        var _this = this
        WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
          success: function (xmlDoc) {
            // console.log('登录成功  szIP：' + szIP)
            // $('#ip').prepend("<option value='" + szIP + "'>" + szIP + '</option>')
            // setTimeout(function () {
            //   $('#ip').val(_this.szIP)
            // }, 10)
            _this.getChannelInfo()
          },
          error: function () {
            // console.log(szIP + '登录失败！')
            this.loginMessage()
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
        var szip = this.szIP
        // console.log('获取通道 this.szIP  ' + szip)
        var oSel = $('#channels').empty()
        if (this.szIP == '') {
          return
        }
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(szip, {
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
            // console.log(szip + ' 获取模拟通道成功！')
          },
          error: function () {
            // console.log(szip + ' 获取模拟通道失败！')
          }
        })
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(szip, {
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
            // console.log(szip + ' 获取数字通道成功！')
          },
          error: function () {
            // console.log(szip + ' 获取数字通道失败！')
          }
        })
        // 零通道
        WebVideoCtrl.I_GetZeroChannelInfo(szip, {
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
            // console.log(szip + ' 获取零通道成功！')
          },
          error: function () {
            // console.log(szip + ' 获取零通道失败！')
          }
        })
      },
      // 开始预览
      clickStartRealPlay () {
        var $ = require('jquery')
        var szip = this.szIP
        // console.log('开始预览 szIP' + szip)
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
        var iStreamType = parseInt(1, 10)
        var iChannelID = parseInt($('#channels').val(), 10)
        var bZeroChannel = $('#channels option').eq($('#channels').get(0).selectedIndex).attr('bZero') == 'true'
        if (szip == '') {
          return
        }
        if (oWndInfo != null) { // 已经在播放了，先停止
          WebVideoCtrl.I_Stop()
        }
        var iRet = WebVideoCtrl.I_StartRealPlay(szip, {
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          bZeroChannel: bZeroChannel
        })
        if (iRet == 0) {
          // console.log('开始预览成功！')
        } else {
          // console.log('开始预览失败！')
        }
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

      // 获实视频备注数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/videoInfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'eId': this.eId,
            'vId': this.id
          })
        }).then(({data}) => {
          if (data && data.code == 0) {
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
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorView/videoConfigEnterpriseTree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 0) {
            this.eIdOptions = data.list
            // console.log(data.list)
            this.getDataList()
          } else {
            this.eIdOptions = []
          }
        })
      },
      // 获取ip树
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
      // 获取配置信息
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
            // console.log(data)
            this.getDataList()
            this.clickLogout()
            // console.log('获取配置信息： ' + this.szIP, data.mapList[0].port, data.mapList[0].codeName, data.mapList[0].pwd)
            this.clickLogin(this.szIP, data.mapList[0].port, data.mapList[0].codeName, data.mapList[0].pwd)
          }
        })
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
      },
      // 登陆提示
      loginMessage () {
        this.$message({
          message: '请求失败！',
          type: 'warning'
        })
      }
    }
  }
</script>
<style scoped>
  @import "../../../../static/plugins/video/video.css";

  .clear {
    display: block;
    overflow: hidden;
  }

  .video_content {
    width: 100%;
    height: 780px;
  }

  .video_content .all_search {
    width: 100%;
    height: 6%;
  }

  .video_content .video_major {
    margin-top: 1%;
    width: 100%;
    height: 93%;
  }

  .video_content .left {
    float: left;
    width: 70%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .video_content .right {
    float: left;
    margin-left: 1%;
    width: 29%;
    height: 100%;
  }

  /*select原生样式修改*/
  .all_search {
    display: flex;
  }

  .all_search select::-ms-expand, .all_search option::-ms-expand {
    display: none;
    outline: none;
  }

  .all_search select, .all_search option {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
  }

  .all_search select::-ms-expand, .all_search option::-ms-expand {

  }

  .all_search select {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 40px;
    line-height: 100%;
    padding: 0 15px;
  }

  .all_search select:hover {
    border: 1px solid #c0c4cc;
  }

  .all_search select:focus {
    border: 1px solid #17B3A3;
  }

  .all_search option {
    font-size: 14px;
    color: #606266;
    line-height: 2em;
  }

</style>
