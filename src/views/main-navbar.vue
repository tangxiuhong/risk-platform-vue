<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;"><img src="../../static/img/index.png" width="180px"
                                                                  height="auto"/></a>
        <a class="site-navbar__brand-mini" href="javascript:;"><img src="../../static/img/index-logo.png" width="100%"
                                                                    height="auto"/></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--left">
        <el-menu-item index="1" class="navTitle">
          程潮矿业有限公司双重预防信息管理平台
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="bigicon" index="2" style="border-bottom: 0;" @click="screen">
          <i class="el-icon-rank" title="浏览器内全屏"></i>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link" style="outline: none;">消息</span>
            <a class="messageHide" v-show="messageHide">{{messageCount}}</a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(messageContent,index) in messageContents" v-if="index <= 4"
                                @click.native="smallMsgShow(messageContent)" key="id">
                <el-row style="max-width: 200px;">
                  <el-col :span="24" style="
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  line-height: 1.5em;
                  padding-top:6px;
                  color: #606266;">{{messageContent.content}}
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="24" style="font-size: 12px; color: #999;">{{messageContent.intervalTime}}</el-col>
                  </el-col>
                </el-row>
              </el-dropdown-item>
              <el-dropdown-item @click.native="bigMsgShow" style="font-weight: bold">更多+</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="4">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="../../static/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!--消息小弹框-->
    <small-message v-if="smallMsg" @mesHidden="mesHide" ref="smallMessage"></small-message>
    <!--消息大弹框-->
    <big-message v-if="bigMsg" @bigMsgHidden="bigMsgHide" ref="bigMsg"></big-message>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import SmallMessage from './main-smallMessage'
  import BigMessage from './main-bigMessage'
  import {getUUID} from '@/utils'
  // import { clearLoginInfo } from '@/utils'

  let flag = 0

  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        smallMsg: false,
        bigMsg: false,
        messageHide: false,
        messageContents: [],
        messageCount: 0,
        webSocket: null
      }
    },
    components: {
      UpdatePassword,
      SmallMessage,
      BigMessage
    },
    computed: {
      navbarLayoutType: {
        get () {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get () {
          return this.$store.state.common.sidebarFold
        },
        set (val) {
          this.$store.commit('common/updateSidebarFold', val)
        }
      },
      mainTabs: {
        get () {
          return this.$store.state.common.mainTabs
        },
        set (val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      userName: {
        get () {
          return this.$store.state.user.name
        }
      },
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    created () {
      this.initWebSocket()
      this.getUnreadMessageCount()
      this.getLastMessage()
    },
    mounted () {
      setInterval(() => {
        this.intervalTask()
      }, 10000)
    },
    destroyed: function () {
      // 页面销毁时关闭长连接
      this.webSocketClose()
    },
    methods: {
      // 切换浏览器窗口大小
      screen: function () {
        if (flag === 0) {
          this.fullScreen()
          flag = 1
        } else {
          this.exitFullScreen()
          flag = 0
        }
      },
      // 点击放大浏览器窗口
      fullScreen: function () {
        var el = document.documentElement,
          rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
          wscript

        if (typeof rfs != 'undefined' && rfs) {
          rfs.call(el)
          return
        }

        if (typeof window.ActiveXObject != 'undefined') {
          wscript = new ActiveXObject('WScript.Shell')
          if (wscript) {
            wscript.SendKeys('{F11}')
          }
        }
      },
      // 点击还原浏览器窗口
      exitFullScreen: function () {
        var el = document,
          cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
          wscript

        if (typeof cfs != 'undefined' && cfs) {
          cfs.call(el)
          return
        }

        if (typeof window.ActiveXObject != 'undefined') {
          wscript = new ActiveXObject('WScript.Shell')
          if (wscript != null) {
            wscript.SendKeys('{F11}')
          }
        }
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$cookie.delete('token')
              this.$store.commit('resetStore')
              this.$router.options.isAddDynamicMenuRoutes = false
              // clearLoginInfo()
              this.$router.push({name: 'login'})
            }
          })
        }).catch(() => {
        })
      },
      smallMsgShow (messageContent) {
        this.smallMsg = true
        this.$nextTick(() => {
          this.$refs.smallMessage.init(messageContent)
          var url = '/sms/sysSmsRecord/updateMessageStatus/' + messageContent.id
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getUnreadMessageCount()
              this.getLastMessage()
            }
          })
        })
      },
      mesHide () {
        this.smallMsg = false
      },
      bigMsgShow () {
        this.bigMsg = true
        this.$nextTick(() => {
          this.$refs.bigMsg.getDataList()
        })
      },
      bigMsgHide () {
        this.bigMsg = false
      },
      // 首页获取未读消息的条数
      getUnreadMessageCount () {
        var userId = this.userId
        var url = '/sms/sysSmsRecord/getUnreadMessageCount/' + userId
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.messageCount = data.smsRecordCount
            if (this.messageCount === 0) {
              this.messageHide = false
            } else {
              this.messageHide = true
            }
          }
        })
      },
      // 首页获取最近消息的条数
      getLastMessage () {
        var userId = this.userId
        var url = '/sms/sysSmsRecord/getLastMessage/' + userId
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.messageContents = data.smsRecordList
          }
        })
      },
      // 定时任务
      intervalTask () {
        this.getLastMessage()
        this.getUnreadMessageCount()
      },
      initWebSocket () {
        console.log('消息推送：用户ID:' + this.userId)
        // 初始化webSocket
        const userId = this.userId + '_' + getUUID()
        const wsUri = window.SITE_CONFIG.wsUrl + '/ws/sms/' + userId
        this.webSocket = new WebSocket(wsUri)
        this.webSocket.onopen = this.webSocketOnOpen
        this.webSocket.onerror = this.webSocketOnError
        this.webSocket.onmessage = this.webSocketOnMessage
        this.webSocket.onclose = this.webSocketClose
      },
      webSocketOnOpen() {
        console.log('WebSocket连接成功')
      },
      webSocketOnError(e) {
        // 错误
        console.log('WebSocket连接发生错误')
      },
      webSocketOnMessage(e) {
        // 接受数据
        const redata = JSON.parse(e.data)
        console.log(redata)
        this.smallMsg = true
        this.$nextTick(() => {
          this.$refs.smallMessage.init(redata)
        })
      },
      webSocketSend(agentData) {
        // 数据发送
        this.webSocket.send(agentData)
      },
      webSocketClose(e) {
        // 关闭
        console.log('connection closed')
      }
    }
  }
</script>
<style>
  .navTitle {
    font-weight: bold;
    font-size: 2.5em;
    font-family: '微软雅黑';
    color: #1d75b4;
  }

  .el-badge {
    display: inline-block;
    padding: 0 5px;
  }

  .site-navbar__header {
    background: #1d75b4;
    height: 75px;
  }

  .site-navbar__brand {
    height: 75px;
    line-height: 75px;
  }

  .site-sidebar {
    top: 70px
  }

  .site-sidebar--fold .el-menu.site-sidebar__menu {
    width: 75px;
  }

  .site-sidebar--fold .site-navbar__body, .site-sidebar--fold .site-content__wrapper {
    margin-left: 85px;
  }

  .site-navbar__body {
    height: 75px;
  }

  .site-sidebar--fold .site-navbar__header, .site-sidebar--fold .site-navbar__brand, .site-sidebar--fold .site-sidebar, .site-sidebar--fold .site-sidebar__inner, .site-sidebar--fold .el-menu.site-sidebar__menu {
    width: 85px !important;
  }

  .el-tooltip, .el-submenu__title {
    padding: 0 30px !important;
  }

  .el-menu {
    border-right: 0;
  }

  .site-sidebar--fold .site-content--tabs > .el-tabs > .el-tabs__header {
    left: 85px;
  }

  .site-content--tabs {
    padding-top: 80px;
  }

  .messageHide {
    position: absolute !important;
    top: 14px !important;
    right: -20px !important;
    background: #d00 !important;
    height: 16px !important;
    line-height: 16px !important;
    font-size: 12px !important;
    -webkit-border-radius: 50px !important;
    -moz-border-radius: 50px !important;
    border-radius: 50px !important;
    padding: 0 8px !important;
    color: #fff !important;
  }

  @media screen and (min-width: 1367px) {
    .navTitle {
      font-size: 2.8em;
    }
  }
</style>
