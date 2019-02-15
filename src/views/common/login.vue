<template>
  <div class="loginGround">
    <div class="QR-CodeBox"><img src="../../../static/img/hdwErweima.png" alt="华德威二维码"></div>
    <div class="justCenter">
      <el-row>
        <el-col :span="24">
          <h1 class="maxTitle"><img src="../../../static/img/index.png" alt="程潮矿业有限公司双重预防信息管理平台"
                                    class="chengchaoIcon">程潮矿业有限公司双重预防信息管理平台</h1>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row>
            <el-col><!--走马灯banner-->
              <div class="block">
                <el-carousel class="banHeight">
                  <el-carousel-item v-for="item in news" :key="item.image">
                    <img :src="item.image" @click="lookNews(item)" alt="picture" width="100%" height="100%">
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="scrollMargin">
                <h3 class="noTitle">公告：</h3>
                <div id="noticebox">
                  <div id="notices1" :class="{anim:animate}">
                    <div class="noticeTxt" ref="noticeTxt" @mouseover="overScroll(index)" @mouseout="outScroll(index)"
                         v-for="(notice,index) in notices" @click="noticeShow(notice.title,notice.content)">
                      <i class="el-icon-bell"></i>
                      <el-tooltip :content="notice.content" placement="bottom">
                        <p>{{notice.content}}</p>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col>
              <div class="login-main">
                <div v-if="loginShow">
                  <h3 class="login-title mainTitle">登录</h3>
                  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                           status-icon>
                    <el-form-item prop="userName">
                      <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                      <el-row :gutter="10">
                        <el-col :span="13">
                          <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
                        </el-col>
                        <el-col :span="11" class="login-captcha">
                          <img :src="captchaPath" @click="getCaptcha()">
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-col :span="12">
                      <el-form-item>
                        <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-button class="otherSys" @click="switchTab">其他系统</el-button>
                    </el-col>
                  </el-form>
                </div>
                <div v-if="systemShow" class="otherSysBox">
                  <div class="otherSysList">
                    <div onclick="javaScript:window.open(SITE_CONFIG['riskCalculation'])">风险计算系统</div>
                    <div onclick="javaScript:window.open(SITE_CONFIG['riskCollect'])">数据汇集系统</div>
                    <p>
                      <el-button class="otherSys" @click="backLogin"><i class="el-icon-back"></i> 返回登陆</el-button>
                    </p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="footText">
            <p style=" font-weight: bold;">技术支持单位：湖北兴业华德威安全信息技术股份有限公司</p>
            <p>确保最佳使用效果，建议使用IE9以上版本或Google Chrome</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <problem-consult @refreshDataList="dataFormSubmit"></problem-consult>
    <login-notice v-if="noticeChild" @noticeHide="noticeHides" ref="loginNotice"></login-notice>
    <login-news v-if="loginNews" ref="loginNews" @newsHide="newsHides()"></login-news>
  </div>
</template>

<script>
  /* eslint-disable eqeqeq,camelcase */

  import {getUUID} from '@/utils'
  import ProblemConsult from './consulting'
  import loginNotice from './notice'
  import loginNews from './login-news'
  import {getLocalAddr} from '@/utils'

  export default {
    data () {
      return {
        animate: false,
        animateTxt: false,
        notices: [],
        noticeChild: false,
        notContent: '',
        notTitle: '',
        noticeSize: 0,
        news: [],
        loginNews: false,
        checked: true,
        loginShow: true,
        systemShow: false,
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        userData: [],
        dataRule: {
          userName: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: '',
        event: ''
      }
    },
    components: {ProblemConsult, loginNotice, loginNews},
    beforeCreate () {
      window.intervalScroll = ''
    },
    created () {
      this.getCaptcha()
    },
    beforeMount () {
      window.addEventListener('resize', this.resetDocumentClientHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.resetDocumentClientHeight)
    },
    mounted () {
      this.resetDocumentClientHeight()
      this.getNoticeInfo()
      this.getNewsInfo()
      this.scrollSet()
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        },
        set (val) {
          this.$store.commit('common/updateDocumentClientHeight', val)
        }
      }
    },
    beforeDestroy () {
      clearInterval(window.intervalScroll)
    },
    methods: {
      // 设置背景图片高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        let groundHeight = document.getElementsByClassName('loginGround')[0]
        groundHeight.style.height = this.documentClientHeight + 'px'
      },
      // 获取首页新闻
      getNewsInfo () {
        this.$http({
          url: this.$http.adornUrl('/notice/sysNews/getNewsInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0 && data.list != null && data.list.length > 0) {
            console.log(data.list)

            for (var x in data.list) {
              var picUrl = data.list[x].image;
              var localAddr = getLocalAddr(picUrl);
              data.list[x].image = localAddr;
            }
            this.news = data.list
          } else {
            var noNews = new Object()
            noNews.title = '首页新闻'
            noNews.content = '暂无数据......'
            noNews.image = require('../../../static/img/bkground.jpg')
            this.news.push(noNews)
          }
        })
      },
      lookNews (item) {
        this.loginNews = true
        this.$nextTick(() => {
          this.$refs.loginNews.init(item)
        })
      },
      newsHides () {
        this.loginNews = false
      },
      // 获取首页公告
      getNoticeInfo () {
        this.$http({
          url: this.$http.adornUrl('/notice/sysNotice/getNoticeInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0 && data.list != null && data.list.length > 0) {
            this.noticeSize = data.list.length
            this.notices = data.list
          } else {
            this.noticeSize = 1
            var notice = new Object()
            notice.content = '暂无数据......'
            notice.title = '公告'
            this.notices.push(notice)
          }
        })
      },
      // 公告滚动setTimeout
      timeScroll () {
        this.notices.push(this.notices[0])
        this.notices.shift()
        this.animate = false
      },
      // 公告滚动
      scroll () {
        if (this.noticeSize > 2) {
          this.animate = true
          this.animateTxt = false
          setTimeout(() => {
            this.timeScroll()
          }, 1500)
        }
      },
      scrollSet () {
        window.intervalScroll = setInterval(this.scroll, 2500)
      },
      // 鼠标经过停止滚动
      overScroll (index) {
        clearInterval(window.intervalScroll)
      },
      // 鼠标离开开始滚动
      outScroll (index) {
        window.intervalScroll = setInterval(this.scroll, 2500)
      },
      noticeHides () {
        this.noticeChild = false
      },
      noticeShow (title, content) {
        this.noticeChild = true
        this.$nextTick(() => {
          this.$refs.loginNotice.init(title, content)
        })
      },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'captcha': this.dataForm.captcha,
                'uuid': this.dataForm.uuid
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token, {expires: '30m'})
                this.$router.replace({name: 'home'})
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/kaptcha.jpg?uuid=${this.dataForm.uuid}`)
      },
      // 切换登录与其他系统显示
      switchTab () {
        this.systemShow = true
        this.loginShow = false
      },
      backLogin () {
        this.systemShow = false
        this.loginShow = true
      }
    }
  }
</script>

<style lang="scss">
  .loginGround {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 5%;
    background-image: url("../../../static/img/background.jpg");
    background-size: 100% 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden
  }

  .QR-CodeBox {
    position: fixed;
    left: 2%;
    top: 2%;
    z-index: 9999;
    width: 140px;
    height: auto;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background: rgba(255, 255, 255, .5);
    overflow: hidden;
  }

  .QR-CodeBox::after {
    content: '安卓版';
    font-size: 12px;
    color: #fff;
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 1.5em;
  }

  .QR-CodeBox img {
    width: 100%;
  }

  .justCenter {
    width: 950px;
    margin: 0 auto;
  }

  .maxTitle {
    font-size: 2.5em;
    line-height: 2.5em;
    text-align: center;
    color: #fff;
    font-family: "黑体";
  }

  .chengchaoIcon {
    width: 160px;
    margin-top: -5px;
    margin-right: 5px;
  }

  .block, .banHeight {
    height: 350px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .scrollMargin {
    height: 100px;
    overflow: hidden;
    margin-top: 20px;
    background: rgba(255, 255, 255, .2);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }

  .noTitle {
    line-height: 2em;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    color: #000;
    text-indent: 1em;
  }

  .notmarque {
    height: 100%;
    overflow: hidden;
  }

  #noticebox {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  #notices1 {
    overflow: hidden;
  }

  .anim {
    transition: all 1.1s;
    margin-top: -33px;
  }

  #notices1 div {
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 1px 5%;
    display: inline-block;
    width: 100%;
    color: #fff;
    overflow: hidden;
    font-size: 1em;
    transition: background .3s linear, line-height .3s linear, box-shadow .3s linear, color .3s linear, font-size .3s linear;
    -o-transition: background .3s linear, line-height .3s linear, box-shadow .3s linear, color .3s linear, font-size .3s linear;
    -moz-transition: background .3s linear, line-height .3s linear, box-shadow .3s linear, color .3s linear, font-size .3s linear;
    -webkit-transition: background .3s linear, line-height .3s linear, box-shadow .3s linear, color .3s linear, font-size .3s linear;
    cursor: default;
  }

  #notices1 div i {
    float: left;
    line-height: 2em;
    width: 5%;
  }

  #notices1 div p {
    float: left;
    line-height: 2em;
    width: 95%;
    overflow: hidden;
  }

  #notices1 div p .scrollTxt {
    position: relative;
    left: 0;
  }

  #notices1 div:hover {
    color: #45c2b5;
    background: rgba(0, 0, 0, 1);
    box-shadow: 0 0 10px #555;
    font-size: 1.2em;
    text-decoration: none;
  }

  #bottom {
    width: 399px;
    height: 10px;
    overflow: hidden;
  }

  .login-main {
    overflow: hidden;
    padding: 41px 10%;
    background: rgba(255, 255, 255, .2);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    height: 470px;
  }

  .mainTitle {
    line-height: 2em;
    margin-bottom: 27px;
    font-size: 1.4em;
    color: #fff;
  }

  .el-form-item {
    margin-bottom: 40px;
  }

  .otherSys {
    float: right;
    background: rgba(255, 255, 255, .8) !important;
    border: rgba(255, 255, 255, .8) !important;
  }

  .otherSys:hover {
    background: rgba(255, 255, 255, 1) !important;
    border: rgba(255, 255, 255, 1) !important;
  }

  .otherSysBox {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: Center;
  }

  .otherSysList {
    width: 100%;
  }

  .otherSysList div {
    background: #45c2b5;
    line-height: 4em;
    text-align: center;
    margin: 10% 0;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    transition: all 0.4s;
    -webkit-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -o-transition: all 0.4s;
  }

  .otherSysList div:hover {
    background: #fff;
    color: #17B3A3;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -o-transform: scale(1.1);
    -ms-transform: scale(1.1);
  }

  .footText {
    width: 100%;
    padding: 20px 0;
    font-size: 14px;
    line-height: 1.5em;
    color: #fff;
    text-align: center;
  }

  p, h1, h2, h3 {
    display: block;
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
  }

  .el-carousel__container {
    height: 100%;
  }

  .login-captcha img {
    width: 100%;
  }

  ul, li {
    list-style: none
  }

  @media screen and (min-width: 1367px) {
    .chengchaoicon {
      width: 70px;
      margin-top: -10px;
    }
  }
</style>
