<template>
  <div class="rtspView_content clear">
      <!-- 上面部分 -->
      <div class="searchArea">
        <el-form :inline="true" :model="dataForm" >
          <el-form-item>
            <el-select v-model="dataForm.enterpriseId" filterable placeholder="企业名称" clearable @focus="getEnterpriseTree" @change="getStreamNameList()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="dataForm.id" placeholder="视频流名称" filterable clearable>
              <el-option
                v-for="item in streamOptions"
                :key="item.id"
                :label="item.cameraName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 页面分为左右两个部分,左边放视频，右边放图片 -->
      <!-- 左边部分 -->
       <div class="left">
         <video id="my-video" class="video-js vjs-default-skin"  preload="auto" style="height:780px;width:780px" :autoplay="playStatus">
           <source :src="streamUrl" type="application/x-mpegURL">
         </video>
       </div>
      <!-- 右边部分 -->
      <div class="right">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="attachmentPath"
            header-align="center"
            align="center"
            label="异常图片">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="left">
                <img :src="scope.row.attachmentPath" width="100%" alt=""/>
                <div slot="reference" >
                  <img :src="scope.row.attachmentPath" style="width:50px;height:50px;"/>
                </div>
              </el-popover>
            </template>
            <!--<template slot-scope="scope">
              <img :src="scope.row.attachmentPath" style="width:50px;height:50px;"/>
            </template>-->
          </el-table-column>
          <el-table-column
            prop="attachmentName"
            header-align="center"
            align="center"
            label="异常时间">
            <template slot-scope="scope">
              <span v-text="scope.row.attachmentName.substring(0,8)"></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, prev, next, jumper">
        </el-pagination>
      </div>

      <!-- 放置更多点击图片 -->
      <div class="more">
         <span style="color:#00a0e9" @click="lookHandle()">更多>></span>
      </div>
    <!--  查看更多 -->
    <look-more v-if='lookMoreVisible' ref="lookMore" @refreshDataList='getDataList'></look-more>
  </div>
</template>

<script>
  import videojs from 'video.js'
  import 'videojs-contrib-hls'
  import lookMore from './rtspView-lookMore'
  export default {
    data () {
      return {
        dataForm: {
          enterpriseId: '',
          id: '',
          recordId: ''
        },
        entId: '',
        configId: '',
        options: [],
        streamOptions: [],
        dataList: [],
        dataListLoading: false,
        streamUrl: 'http://172.16.5.94:9092/hls/cctk/index.m3u8',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        playStatus: 'autoplay',
        lookMoreVisible: false
      }
    },
    components: {
      lookMore
    },
    mounted () {
      this.init()
      this.getDataList()
      this.getStreamNameList()
      videojs('my-video', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true
      }, function () {
        this.play()
      })
    },
    activated () {
      this.intervalBegin()
    },
    deactivated () {
      console.log('keep-alive 组件停用时调用开始')
      this.intervalEnd()
      console.log('keep-alive 组件停用时调用结束')
    },
    methods: {
      intervalBegin () {
        console.log('开始定时器')
        window.intervalObj = setInterval(this.getDataList, 10000)
        console.log('定时器执行时间：' + window.intervalObj)
      },
      intervalEnd () {
        console.log('停止定时器')
        clearInterval(window.intervalObj)
      },

      // 获取企业树
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.list
          } else {
            this.options = []
          }
        })
      },
      // 获取摄像头名称列表
      getStreamNameList () {
        this.$http({
          url: this.$http.adornUrl('/ai/aiConfig/getStreamNameList'),
          method: 'get',
          params: this.$http.adornParams({
            'enterpriseId': this.dataForm.enterpriseId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.streamOptions = data.list
          } else {
            this.streamOptions = []
          }
        })
      },
      // 获取流地址
      getStreamUrl () {
        this.$http({
          url: this.$http.adornUrl(`/ai/aiConfig/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.streamPath = data.aiConfig.httpPath
            this.dataForm.recordId = data.aiConfig.id
          }
        })
      },
      init () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.entId = data.list[0].value
          } else {
            this.options = []
          }
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ai/aiConfig/getStreamNameList'),
            method: 'get',
            params: this.$http.adornParams({
              'enterpriseId': this.entId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.configId = data.list[0].id
            } else {
              this.streamOptions = []
            }
          }).then(() => {
            console.log('企业ID:' + this.entId + ' ' + this.configId)
            this.$http({
              url: this.$http.adornUrl(`/ai/aiConfig/info/${this.configId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.aiConfig.httpPath)
                this.dataForm.recordId = data.aiConfig.id
                this.streamPath = data.aiConfig.httpPath
              }
            }).then(() => {
              console.log('2 recordId:' + this.dataForm.recordId)
              this.getDataList()
            })
          })
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/rtspView/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'state': '1'
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
      // 查看更多
      lookHandle () {
        this.lookMoreVisible = true
        this.$nextTick(() => {
          this.$refs.lookMore.init(this.dataForm.recordId)
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

  .rtspView_content {
    width: 100%;
    height: 780px;
  }
  .rtspView_content .left{
    width:65%;
    height:100%;
    float:left;
  }
  .rtspView_content .right{
    width:28%;
    height:100%;
    margin-left:1%;
    float:left;
  }
  .rtspView_content .more{
    width:5%;
    margin-left:1%;
    float:left;
    cursor:pointer;
  }

</style>
