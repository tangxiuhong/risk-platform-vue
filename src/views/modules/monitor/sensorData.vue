<template>
  <div class="sensor_content">
    <!-- 顶部搜索框-->
    <div class="all_search">
      <el-select v-model="eId" placeholder="企业" filterable clearable @focus="getEnterpriseTree()"
                 @change="getAllDataList()">
        <el-option
          v-for="item in eIdOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="areaName" placeholder="区域" class="search" @change="getAllDataList2()" filterable clearable>
        <el-option
          v-for="item in areaOptions"
          :key="item.areaName"
          :label="item.areaName"
          :value="item.areaName">
        </el-option>
      </el-select>
    </div>
    <!-- 页面分为上下两块 -->
    <!-- 上边部分 -->
    <div class="top clear">
      <!-- 上左 -->
      <div class="top_left">
        <!-- 标题部分 -->
        <div class="table_title"><span>安装图片</span></div>
        <!-- 安装图片 -->
        <div class="picture_view">
          <el-carousel indicator-position="outside" height="300px">
            <el-carousel-item v-for="(item, index) in imgList" :key="index">
              <!--<img :src="item.attachmentPath" style="width:100%;height:92%;"/>-->
              <img class="animImg" @click="imgChang(item)" :src='item.attachmentPath'/>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 上右 -->
      <div class="top_right">
        <div class="table_title"><span>监测点实时数据</span></div>
        <div class="search_area">
          <el-select v-model="deviceId" placeholder="传感器名称" class="search" filterable clearable
                     @focus="getDeviceNameTree()" @change="getDataList">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="show_more">
            <a @click="getSensorDataInfo()"><span>更多...</span></a>
          </div>
          <!--<el-radio-group v-model="sensorDataTime" style="margin-left:4%;" @change="getDataList()">-->
          <!--<el-radio :label="0">今天</el-radio>-->
          <!--<el-radio :label="1">一周内</el-radio>-->
          <!--<el-radio label="2">一个月内</el-radio>-->
          <!--</el-radio-group>-->
        </div>
        <div class="table_content">
          <el-table
            :data="dataList"
            border
            height="210"
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="deviceName"
              header-align="center"
              align="center"
              label="传感器名称">
            </el-table-column>
            <el-table-column
              width="120px"
              prop="realValue"
              header-align="center"
              align="center"
              label="当前值">
            </el-table-column>
            <el-table-column
              width="120px"
              prop="high1"
              header-align="center"
              align="center"
              label="正常值上限">
            </el-table-column>
            <el-table-column
              width="120px"
              prop="low1"
              header-align="center"
              align="center"
              label="正常值下限">
            </el-table-column>
            <el-table-column
              width="160px"
              prop="updateTime"
              header-align="center"
              align="center"
              label="实时数据时间">
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
      </div>
    </div>
    <!-- 下边部分 -->
    <div class="bottom clear">
      <!-- 下左 -->
      <div class="bottom_left">

        <div class="table_title"><span>监测点配置</span></div>
        <div class="search_area">
          <el-select v-model="deviceIdConfig" placeholder="传感器名称" class="search" filterable clearable
                     @focus="getDeviceNameTree()" @change="getConfigDataList()">
            <el-option
              v-for="item in optionsConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="table_content">
          <el-table
            :data="configDataList"
            border
            height="210"
            v-loading="dataListLoadingConfig"
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
              width="100px"
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
            :current-page="pageIndex"
            :page-sizes="[1, 2, 3, 4, 5]"
            :page-size="configPageSize"
            :total="configTotalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
      <!-- 下右 -->
      <div class="bottom_right">
        <div class="table_title"><span>监测点预警数据</span></div>
        <div class="search_area">
          <el-select v-model="deviceIdWarn" placeholder="传感器名称" class="search" filterable clearable
                     @focus="getDeviceNameTree()" @change="getWarnDataList">
            <el-option
              v-for="item in optionsWarn"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-radio-group v-model="warnDataTime" style="margin-left:4%;" @change="getWarnDataList()">
            <el-radio :label="0">今天</el-radio>
            <el-radio :label="1">一周内</el-radio>
            <el-radio label="2">一个月内</el-radio>
          </el-radio-group>
        </div>
        <div class="table_content">
          <el-table
            :data="warnDataList"
            border
            height="210"
            v-loading="dataListLoadingWarn"
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
              prop="mixExcep"
              header-align="center"
              align="center"
              label="报警下限">
            </el-table-column>
            <el-table-column
              width="160px"
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
    <!-- 传感器数据详细信息 -->
    <sensor-data-info v-if="sensorDataInfo" ref="sensorDataInfo"
                      @sensorDataInfoHide="sensorDataInfoHides"></sensor-data-info>
    <!--图片放大展示-->
    <risk-view-img v-if="riskViewImg" ref="riskViewImg" @riskImgHide="riskImgHides"></risk-view-img>
  </div>
</template>

<script>
  import sensorDataInfo from './sensorData-info'
  import riskViewImg from '../infoDisplay/riskViewImg'
  import {getLocalAddr} from '@/utils'

  export default {
    data () {
      return {
        eId: '',
        areaName: '',
        deviceId: '',
        deviceIdConfig: '',
        deviceIdWarn: '',
        sensorDataTime: 0,
        warnDataTime: 0,
        pageIndex: 1,
        pageSize: 3,
        totalPage: 0,
        configPageIndex: 1,
        configPageSize: 3,
        configTotalPage: 0,
        warnPageIndex: 1,
        warnPageSize: 3,
        warnTotalPage: 0,
        dataTime: 1,
        dataTime1: 1,
        dataListLoading: false,
        dataListLoadingConfig: false,
        dataListLoadingWarn: false,
        sensorDataInfo: false,
        riskViewImg: false,
        height: '',
        imgList: [],
        dataList: [],
        configDataList: [],
        warnDataList: [],
        eIdOptions: [],
        areaOptions: [],
        options: [],
        optionsConfig: [],
        optionsWarn: []
      }
    },
    mounted () {
      this.getDataList()
      this.getConfigDataList()
      this.getWarnDataList()
      this.getAllDataList()
      this.getAreaName()
      this.getImgList()
    },
    activated () {
      // this.getHeight()
      this.intervalBegin()
    },
    deactivated () {
      console.log('keep-alive 组件停用时调用开始')
      this.intervalEnd()
      console.log('keep-alive 组件停用时调用结束')
    },
    components: {
      sensorDataInfo, riskViewImg
    },
    methods: {
      // 获取高度
      getHeight () {
        this.height = document.documentElement['clientHeight']
        let groundHeight = document.getElementsByClassName('sensor_content')[0]
        groundHeight.style.height = document.body.clientHeight - 180 + 'px'
      },
      // 定时刷新echarts图
      intervalBegin () {
        this.timer = setInterval(() => {
          this.getDataList()
        }, 10000)
      },
      // 企业查询改变事件
      getAllDataList () {
        // 查询区域
        this.getAreaName()
        this.getAllDataList2()
      },
      // 区域查询改变事件
      getAllDataList2 () {
        this.getDeviceNameTree()
        this.getDataList()
        this.getConfigDataList()
        this.getWarnDataList()
      },
      // 通过企业id查询区域
      getAreaName () {
        this.$http({
          url: this.$http.adornUrl(`/monitor/sensorConfig/sensorConfigAreaName`),
          method: 'get',
          params: this.$http.adornParams({
            eid: this.eId
          })
        }).then(({data}) => {
          this.areaOptions = data.list
        })
      },
      // 获实时取数据列表
      getDataList () {
        // this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorData/newInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'eId': this.eId,
            'areaName': this.areaName,
            'deviceId': this.deviceId,
            'date': this.sensorDataTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            console.log('刷新实时数据')
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 获取配置信息列表
      getConfigDataList () {
        this.dataListLoadingConfig = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.configPageIndex,
            'limit': this.configPageSize,
            'eId': this.eId,
            'areaName': this.areaName,
            'deviceId': this.deviceIdConfig
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.configDataList = data.page.list
            this.configTotalPage = data.page.totalCount
          } else {
            this.configDataList = []
            this.configTotalPage = 0
          }
          this.dataListLoadingConfig = false
        })
      },
      // 获取预警信息列表
      getWarnDataList () {
        this.dataListLoadingWarn = true
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorDataWarn/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.warnPageIndex,
            'limit': this.warnPageSize,
            'eId': this.eId,
            'areaName': this.areaName,
            'deviceId': this.deviceIdWarn,
            'date': this.warnDataTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.warnDataList = data.page.list
            this.warnTotalPage = data.page.totalCount
          } else {
            this.warnDataList = []
            this.warnTotalPage = 0
          }
          this.dataListLoadingWarn = false
        })
      },
      // 实时数据每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 实时数据当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
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
      // 预警数据每页数
      warnSizeChangeHandle (val) {
        this.warnPageSize = val
        this.warnPageIndex = 1
        this.getWarnDataList()
      },
      // 预警数据当前页
      warnCurrentChangeHandle (val) {
        this.warnPageIndex = val
        this.getWarnDataList()
      },
      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorConfig/sensorConfigEnterpriseNameTree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eIdOptions = data.list
          } else {
            this.eIdOptions = []
          }
        })
      },
      // 获取图片列表
      getImgList () {
        this.$http({
          url: this.$http.adornUrl('/monitor/sensorInstallationDrawing/listFile/'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            var sysFiles = data.sysFiles
            var x
            for (x in sysFiles) {
              var localAddr = getLocalAddr(sysFiles[x].attachmentPath) // 判断并变更地址
              var fi = {attachmentPath: localAddr}
              if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                this.imgList.push(fi)
              }
            }
          } else {
            this.imgList = []
          }
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
            this.options = data.list
            this.optionsConfig = data.list
            this.optionsWarn = data.list
          } else {
            this.options = []
            this.optionsConfig = []
            this.optionsWarn = []
          }
        })
      },
      // 打开传感器数据详情
      getSensorDataInfo () {
        this.sensorDataInfo = true
        this.$nextTick(() => {
          this.$refs.sensorDataInfo.getDataList()
        })
      },
      // 隐藏预警详情
      sensorDataInfoHides () {
        this.sensorDataInfo = false
      },
      // 窗口切换后关闭定时器
      intervalEnd () {
        console.log('停止定时器')
        clearInterval(this.timer)
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
      }
    }
  }
</script>
<style>

  .clear {
    display: block;
    overflow: hidden;
  }

  .sensor_content {
    width: 100%;
    height: 780px;
  }

  .sensor_content .all_search {
    width: 100%;
    height: 6%;
  }

  .sensor_content .top {
    width: 100%;
    height: 43.5%;
  }

  .sensor_content .search_area {
    width: 100%;
    height: 12%;
    margin-top: 0.5%;
  }

  .sensor_content .search_area .show_more {
    float: right;
    padding-right: 20px;
  }

  .sensor_content .search {
    margin-left: 0%;
  }

  .sensor_content .top_left {
    float: left;
    width: 49.5%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .sensor_content .animImg {
    width: 100%;
    height: 100%;
  }

  .sensor_content .top_right {
    float: left;
    width: 49.5%;
    margin-left: 1%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .sensor_content .table_title {
    width: 100%;
    height: 8%;
    font-size: 16px;
    padding: 5px;
    width: 40%;
    background-color: #F2F2F2;
  }

  .sensor_content .table_content {
    margin-top: 0.5%;
  }

  .sensor_content .bottom {
    width: 100%;
    height: 43%;
    margin-top: 1%;
  }

  .sensor_content .bottom_left {
    float: left;
    width: 49.5%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

  .sensor_content .bottom_right {
    float: left;
    width: 49.5%;
    margin-left: 1%;
    height: 100%;
    border: 1px solid #EBEEF5;
  }

</style>
