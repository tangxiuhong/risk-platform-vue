<template>
  <div class="weather_content">
    <!-- 页面分为上下两个部分 -->
    <!-- 上面部分 -->
    <div class="top clear">
      <!-- 上左 今日天气 -->
      <div class="top_left">
        <div class="title_area"><span>今日天气</span></div>
        <div class="weather_picture">
          <img :src="todayWeatherImg" class="img_size"/>
        </div>
        <div class="weather_desc"><span v-text="todayWeatherInfo"></span></div>
      </div>
      <!-- 上右 天气预警 -->
      <div class="top_right">
        <div class="title_area"><span>天气预警</span></div>
        <div class="weather_picture">
          <img :src="warnWeatherImg" class="img_size"/>
        </div>
        <div class="weather_desc"><span v-text="warnWeatherInfo"></span></div>
      </div>
    </div>
    <!-- 下面部分 -->
    <div class="bottom">
      <div class="bottom_title_area"><span>未来一周天气</span></div>
      <div class="weather_picture_area">
        <el-carousel :interval="3000" type="card" height="330px">
          <!-- 第一个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date1"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg1" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo1"></span>
            </div>
          </el-carousel-item>
          <!-- 第二个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date2"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg2" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo2"></span>
            </div>
          </el-carousel-item>
          <!-- 第三个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date3"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg3" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo3"></span>
            </div>
          </el-carousel-item>
          <!-- 第四个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date4"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg4" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo4"></span>
            </div>
          </el-carousel-item>
          <!-- 第五个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date5"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg5" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo5"></span>
            </div>
          </el-carousel-item>
          <!-- 第六个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date6"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg6" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo6"></span>
            </div>
          </el-carousel-item>
          <!-- 第七个走马灯 -->
          <el-carousel-item>
            <!-- 日期 -->
            <div class="bottom_date_area"><span v-text="date7"></span></div>
            <!-- 图片 -->
            <div class="bottom_picture_area">
              <img :src="weekWeatherImg7" class="img_size"/>
            </div>
            <!-- 描述 -->
            <div class="bottom_desc_area">
              <span v-text="weekWeatherInfo7"></span>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        src: '',
        date1: '',
        date2: '',
        date3: '',
        date4: '',
        date5: '',
        date6: '',
        date7: '',
        todayWeatherImg: '',
        weekWeatherInfo1: '',
        weekWeatherInfo2: '',
        weekWeatherInfo3: '',
        weekWeatherInfo4: '',
        weekWeatherInfo5: '',
        weekWeatherInfo6: '',
        weekWeatherInfo7: '',
        weekWeatherImg1: '',
        weekWeatherImg2: '',
        weekWeatherImg3: '',
        weekWeatherImg4: '',
        weekWeatherImg5: '',
        weekWeatherImg6: '',
        weekWeatherImg7: '',
        todayWeatherInfo: '',
        warnWeatherInfo: '',
        warnWeatherImg: ''
      }
    },
    mounted () {
      this.getTodayWeather()
      this.getWarnWeather()
      this.getWeekWeather()
    },
    activated () {
    },
    methods: {
      // 今日天气
      getTodayWeather () {
        this.$http({
          url: this.$http.adornUrl('/monitor/weather/hourWeatherInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.map == null) {
              this.todayWeatherInfo = '无数据'
              this.todayWeatherImg = require('../../../../static/img/weather/undefined.png')
            } else {
              this.todayWeatherInfo = data.map.weatherInfo
              this.todayWeatherImg = require('../../../../static/img/' + data.map.statusBigpicDay)
            }
          }
        })
      },
      // 天气预警
      getWarnWeather () {
        this.$http({
          url: this.$http.adornUrl('/monitor/weatherAlarms/weatherInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.map == null) {
              this.warnWeatherInfo = '无数据'
              this.warnWeatherImg = require('../../../../static/img/weather/undefined.png')
            } else {
              this.warnWeatherInfo = (data.map.title + ' ' + data.map.txt)
            }
          }
        })
      },
      // 一周天气
      getWeekWeather () {
        this.$http({
          url: this.$http.adornUrl('/monitor/weatherDaily/weekWeatherInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data)
            if (data.mapList.length === 0) {
              // 图片
              this.weekWeatherImg1 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg2 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg3 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg4 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg5 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg6 = require('../../../../static/img/weather/undefined.png')
              this.weekWeatherImg7 = require('../../../../static/img/weather/undefined.png')
            } else {
              // 日期
              this.date1 = data.mapList[0].date
              this.date2 = data.mapList[1].date
              this.date3 = data.mapList[2].date
              this.date4 = data.mapList[3].date
              this.date5 = data.mapList[4].date
              this.date6 = data.mapList[5].date
              this.date7 = data.mapList[6].date
              // 信息
              this.weekWeatherInfo1 = data.mapList[0].weatherInfo
              this.weekWeatherInfo2 = data.mapList[1].weatherInfo
              this.weekWeatherInfo3 = data.mapList[2].weatherInfo
              this.weekWeatherInfo4 = data.mapList[3].weatherInfo
              this.weekWeatherInfo5 = data.mapList[4].weatherInfo
              this.weekWeatherInfo6 = data.mapList[5].weatherInfo
              this.weekWeatherInfo7 = data.mapList[6].weatherInfo
              // 图片
              this.weekWeatherImg1 = require('../../../../static/img/' + data.mapList[0].statusBigpicDay)
              this.weekWeatherImg2 = require('../../../../static/img/' + data.mapList[1].statusBigpicDay)
              this.weekWeatherImg3 = require('../../../../static/img/' + data.mapList[2].statusBigpicDay)
              this.weekWeatherImg4 = require('../../../../static/img/' + data.mapList[3].statusBigpicDay)
              this.weekWeatherImg5 = require('../../../../static/img/' + data.mapList[4].statusBigpicDay)
              this.weekWeatherImg6 = require('../../../../static/img/' + data.mapList[5].statusBigpicDay)
              this.weekWeatherImg7 = require('../../../../static/img/' + data.mapList[6].statusBigpicDay)
            }
          }
        })
      }
    }
  }
</script>
<style>

  .clear {
    display: block;
    overflow: hidden;
  }

  .weather_content {
    width: 100%;
    height: 780px;
  }

  .weather_content .top {
    width: 100%;
    height: 49.5%;
  }

  .weather_content .top_left {
    float: left;
    width: 49.5%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .weather_content .title_area {
    font-size: 16px;
    padding: 5px;
    width: 40%;
    background-color: #F2F2F2;
  }

  .weather_content .bottom_title_area {
    font-size: 16px;
    padding: 5px;
    width: 20%;
    background-color: #F2F2F2;
  }

  .weather_content .weather_picture {
    width: 50%;
    margin-left: 25%;
    height: 76%;
    margin-top: 1%;
  }

  .weather_content .weather_desc {
    font-size: 16px;
    width: 100%;
    height: 10%;
    margin-top: 0.8%;
    text-align: center;
  }

  .weather_content .top_right {
    float: left;
    margin-left: 1%;
    width: 49.5%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .weather_content .bottom {
    margin-top: 1%;
    width: 100%;
    height: 49.5%;
    border: 1px solid #EBEEF5;
  }

  .weather_content .weather_picture_area {
    width: 100%;
    height: 86%;
    margin-top: 1%;
    font-size: 16px;
  }

  .weather_content .bottom_date_area {
    height: 10%;
    width: 100%;
    text-align: center;
    padding: 6px 0;
  }

  .weather_content .bottom_picture_area {
    height: 80%;
    width: 50%;
    margin-left: 25%;
  }

  .weather_content .bottom_desc_area {
    height: 10%;
    width: 100%;
    text-align: center;
    padding: 6px 0;
  }

  .weather_content .img_size {
    width: 100%;
    height: 100%;
  }

  .weather_content .el-carousel__item {
    background-color: #EBEEF5;
  }
</style>
