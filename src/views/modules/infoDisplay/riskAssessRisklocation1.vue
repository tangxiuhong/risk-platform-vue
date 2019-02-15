<template>
  <!--<el-tabs type="border-card">-->
  <!--<el-tab-pane label="平面图">-->
  <div class="mod-config">

    <!--<div>-->

    <el-form :inline="true" :model="dataForm">
      <el-form-item class="picCls">
        <el-select v-model="dataForm.riskPictureid" placeholder="风险平面图" clearable @change="riskPictureChange">
          <el-option
            v-for="item in riskPictureList"
            :key="item.pictureId"
            :label="item.pictureName"
            :value="item.pictureId">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-button type="primary" @click="viewPoints">确定</el-button>-->
    </el-form>


    <div id="picBox" ref="picSvgDiv" style="width: 700px; height: 500px;">
      <svg v-html="dataForm.pictureUrl" style="width: 500px; height: 500px" ref="picSvg" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"></svg>

    </div>

    <!--</div>-->
    <!-- 弹窗, 新增 / 修改 -->
    <check-info v-if="checkInfoVisible" ref="checkInfo"></check-info>
  </div>

</template>

<script>
  import checkInfo from './riskAssessRisklocation-checkInfo'

  export default {
    data () {
      return {
        picRiskTgLs: [],
        riskPictureList: [],
        riskPointList: [],
        cPoints: [],
        dataForm: {
          riskPictureid: '',
          pictureUrl: ''
        },
        riskPointId: '',
        riskUnit: '',
        riskPoint: '',
        riskLevel: '',
        riskStatus: '',
        checkTime: '',
        checkInfoVisible: false,
        periodId: '',

        assessNoList: [],
        riskUnitList: [],
        dataFormList: {
          assessNo: '',
          riskUnit: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        svgWidth: ''
      }
    },
    components: {
      checkInfo
    },
    updated () {

    },
    activated () {
      this.getRiskPictureList()
    },
    deactivated () {
      this.clearInterval()
    },
    methods: {
      // 获取数据列表
      getRiskPictureList () {
        this.picRiskTgLs = []
        this.riskPictureList = []
        this.riskPointList = []
        this.cPoints = []
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/riskAssessRisklocation/listRiskPictures'),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskPointList = data.picsAndPoints.pointList;
            this.riskPictureList = data.picsAndPoints.picList;
            if (data.picsAndPoints.picList) {
              var picId = data.picsAndPoints.picList[0].pictureId;
              this.dataForm.riskPictureid = picId;
              this.riskPictureChange(picId);
              this.svgZooms()
            }
          }
        })
        this.periodId = setInterval(() => {
          this.intervalTask()
        }, 6000)
      },
      clearInterval () {
        if (this.periodId != '') {
          window.clearInterval(this.periodId);
        }
      },
      riskPictureChange (e) {
        this.picRiskTgLs = [];
        this.dataForm.pictureUrl = '';
        if (e == '') return;
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/lookPictureInfo`),
          method: 'get',
          params: this.$http.adornParams({id: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.riskPictureid = e;
            this.dataForm.pictureUrl = data.riskPicture.svgXml;
            this.$refs.picSvgDiv.style.width = parseInt(data.riskPicture.viewBoxW) + "px"
            this.$refs.picSvgDiv.style.height = parseInt(data.riskPicture.viewBoxH) + "px"
            let picBox = $('#picBox').width()
            $('#picBox').css({'width': picBox})
            let viewsBoxW = Math.max(parseInt(data.riskPicture.viewBoxW), picBox + 2, 1000)
            this.$refs.picSvg.setAttribute("viewBox", "0 0 " + viewsBoxW + " " + data.riskPicture.viewBoxH)
            this.viewPoints()
          }
        })
      },
      viewPoints () {
        var e = this.dataForm.riskPictureid;
        var x;
        this.picRiskTgLs = [];
        this.cPoints = [];
        for (x in this.riskPointList) {
          if (this.riskPointList[x].pictureId === e) {
            var pid = this.riskPointList[x].pointId;
            var xMap = this.riskPointList[x].xMap;
            var yMap = this.riskPointList[x].yMap;
            var level = this.riskPointList[x].riskLevel;
            this.cPoints.push(pid);
            //this.svgCircle(xMap,yMap,pid,level);
          }
        }
        this.intervalTask();
      },
      intervalTask () {
        if (this.dataForm.riskPictureid == '') return;
        if (this.cPoints.length <= 0) return;
        this.$http({
          url: this.$http.adornUrl(`/infoDisplay/riskAssessRisklocation/listDynamicRisks`),
          method: 'get',
          params: this.$http.adornParams({pointIds: this.cPoints.join(",")})
        }).then(({data}) => {
          if (data && data.code === 0) {
            var pl = data.pointRiskLevels;
            var x;
            for (x in pl) {
              var pid = pl[x].pointId;
              var xMap = pl[x].xMap;
              var yMap = pl[x].yMap;
              var level = pl[x].dynamicLevel;
              if(level===0) level = 4;
              console.log(pid + "/" + level);
              this.svgCircle(xMap, yMap, pid, level);
            }
          }
        })
      },
      svgCircle (x, y, id, level) {
        if (!id) return;
        var i;
        var point;
        for (i in this.picRiskTgLs) {
          var ids = this.picRiskTgLs[i];
          if (ids.id == id) {
            point = ids;
            break;
          }
        }
        if (point) {
          point.setAttribute("cx", x);
          point.setAttribute("cy", y);
          if (level == 1) {
            point.setAttribute("fill", "red");
          }
          if (level == 2) {
            point.setAttribute("fill", "orange");
          }
          if (level == 3) {
            point.setAttribute("fill", "yellow");
          }
          if (level == 4) {
            point.setAttribute("fill", "blue");
          }
        } else {
          var rect = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          rect.setAttribute("cx", x);
          rect.setAttribute("cy", y);
          rect.setAttribute("r", 10);
          if (level == 1) {
            rect.setAttribute("fill", "red");
          }
          if (level == 2) {
            rect.setAttribute("fill", "orange");
          }
          if (level == 3) {
            rect.setAttribute("fill", "yellow");
          }
          if (level == 4) {
            rect.setAttribute("fill", "blue");
          }

          rect.setAttribute("stroke-width", 2);
          rect.setAttribute("stroke", "#fff");
          rect.id = id;
          //rect.onclick = this.loadPointInfo(id);
          var ts = this;
          rect.onclick = function (e) {
            var pid = e.target.id;
            ts.riskPointId = pid;
            ts.viewCheckInfo();
          }

          this.$refs.picSvg.appendChild(rect);
          this.picRiskTgLs.push(rect);
        }
      },
      svgCircleClear () {
        //
      },
      viewCheckInfo () {
        if (this.riskPointId == '') return;
        this.checkInfoVisible = true
        this.$nextTick(() => {
          this.$refs.checkInfo.init(this.riskPointId)
        })
      },
      svgZooms () {
        var evnt = function (event) {
          var button = event.button
          var evnTarget = event.target || event.srcElement
          if (event.pageX == null && event.clientX != null) {
            eventDoc = evnTarget.ownerDocument || document
            doc = eventDoc.documentElement
            body = eventDoc.body
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
          }
          if (!event.preventDefault) {
            event.preventDefault = function () {
              this.returnValue = false
            }
          }

          if (!event.stopPropagation) {
            event.stopPropagation = function () {
              this.cancelBubble = true;
            }
          }

          if (event.which == null && (event.charCode != null || event.keyCode != null)) {
            event.which = event.charCode != null ? event.charCode : event.keyCode
          }

          // Add which for click: 1 === left; 2 === middle; 3 === right
          // Note: button is not normalized, so don't use it
          if (!event.which && button !== undefined) {
            button = event.which & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0))
          }
          return event
        }

        function getOffset (o) {
          var left = 0,
            top = 0
          while (o != null && o != document.body) {
            top += o.offsetTop
            left += o.offsetLeft
            o = o.offsetParent
          }
          return {
            left: left,
            top: top
          }
        };
        (function () {
          var d = document,
            bind = function (b, a, c) {
              b.addEventListener ? b.addEventListener(a, function (event) {
                c.call(b, evnt(event))
              }, false) : b.attachEvent('on' + a, function (event) {
                c.call(b, evnt(window.event))
              })
            },
            on = function (b, o) {
              for (var a in o) {
                bind(b, a, o[a])
              }
            }

          var isRun,
            startX,
            startY,
            endX,
            endY,
            rX,
            rY,
            bgX = 0,
            bgY = 0,
            $b = d.getElementById('picBox')
          var ww = parseInt($b.style.width)
          var wh = parseInt($b.style.height)
          var svg = $b.getElementsByTagName('svg')[0]
          var img = svg.style
          var imgw = parseInt(img.width)
          console.log(imgw)
          var imgh = parseInt(img.height)
          var scaleSize = 1

          function rs () {
            var w, h
            // 以完全显示图片为基准,如果改为>，则为以铺满屏幕为基准
            if (ww / wh > imgw / imgh) {
              w = ww
              h = imgh * ww / imgw
              bgX = 0
              bgY = -(h - wh) / 2
              scaleSize = ww / imgw //初始比率
            } else {
              w = imgw * wh / imgh
              h = wh
              bgX = -(w - ww) / 2
              bgY = 0
              scaleSize = wh / imgh
            }

            img.width = w + 'px'
            img.height = h + 'px'
            img.left = bgX + 'px'
            img.top = bgY + 'px'
          }

          rs()
          /* Init */
          on($b, {
            'mousedown': function (e) {
              // 按中建快速还原大小
              if (e.which === 2) {
                rs()
              }
              if (e.which === 1 && e.target && (e.target === svg || e.target === $b)) {
                isRun = true
                startX = e.pageX
                startY = e.pageY
                e.preventDefault()
              }
            },
            'mouseup': function (e) {
              if (e.which !== 1) {
                return
              }

              img.cursor = 'default'
              isRun = false
              if (typeof (rX) !== 'undefined')// 去掉该判断会出现单击后，放大缩小不是鼠标位置的情况；处理加载后就点击的情况；即rX是undefined
              {
                bgX = rX
                bgY = rY
                // console.log("mouseup坐标x" + rX)
                // console.log("mouseup坐标y" + rY)
              }

              e.preventDefault();
            },
            'mousemove': function (e) {
              if (e.which !== 1) {
                return
              }
              if (isRun) {
                e.preventDefault()
                img.cursor = 'move'
                endX = e.pageX
                endY = e.pageY
                rX = bgX + endX - startX
                rY = bgY + endY - startY
                img.left = rX + 'px'
                img.top = rY + 'px'
                // console.log("mousemove坐标x" + rX)
                // console.log("mousemove坐标y" + rY)
              }
            },
            'mousewheel': function (e) {
              // 以鼠标为中心缩放，同时进行位置调整
              var x = e.pageX
              var y = e.pageY
              e.preventDefault()

              if (e.target && (e.target === svg)) {
                var l = getOffset($b)
                x = x - l.left
                y = y - l.top

                var p = (e.wheelDelta) / 1200
                var ns = scaleSize
                ns += p
                ns = ns < 0.1 ? 0.1 : (ns > 10 ? 10 : ns) // 可以缩小到0.1,放大到5倍

                // 计算位置，以鼠标所在位置为中心
                // 以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
                bgX = bgX - (x - bgX) * (ns - scaleSize) / (scaleSize);
                bgY = bgY - (y - bgY) * (ns - scaleSize) / (scaleSize);
                scaleSize = ns // 更新倍率

                img.width = imgw * ns + 'px'
                img.height = imgh * ns + 'px'
                img.top = bgY + 'px'
                img.left = bgX + 'px'
              }
            }
          })
        })()
      }
    }
  }
</script>
<style>

  .title {
    font-weight: bold;
  }

  #picBox {
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    min-width: 100%;
    min-height: 100%;
    height: 600px;
  }

  #picBox svg {
    position: absolute;
  }

  .picCls {
    margin-bottom: 10px;
  }

</style>
