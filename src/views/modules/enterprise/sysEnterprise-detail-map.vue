<template>
  <div class="mapBox">
    <div class="outMap">
      <div class="innerMap">
        <el-row>
          <el-col>
            <el-row :gutter="10">
              <el-col :span="22">
                <el-form ref="form" :model="dataForm" label-width="70px">
                  <el-col :span="12">
                    <el-form-item label="X轴坐标">
                      <el-input v-model="dataForm.mapx" :disabled="true" placeholder="X轴坐标"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Y轴坐标">
                      <el-input v-model="dataForm.mapy" :disabled="true" placeholder="Y轴坐标"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
              <el-col :span="2"><i class="el-icon-close" style="float: right; font-size: 20px; line-height: 2em;"
                                   @click="Hidden()"></i></el-col>
            </el-row>
          </el-col>
          <el-col>
            <div id="mapDiv"></div>
          </el-col>
          <el-col>
            <div style="margin-top: 30px; text-align: right">
              <el-button type="primary" @click="HiddenAndMap()">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          mapx: 0,
          mapy: 0
        }
      }
    },
    methods: {
      init (x, y) {
        let map, zoom = 11
        this.dataForm.mapx = x
        this.dataForm.mapy = y
        map = new T.Map('mapDiv')
        let lnglat = new T.LngLat(x, y)
        // 初始化
        map.centerAndZoom(lnglat, zoom)
        let icon = new T.Icon('/static/img/blu.png', new T.Point(20, 20))
        let marker = new T.Marker(lnglat, icon)
        map.addOverLay(marker)
        let self = this
        map.addEventListener('click', function (p) {
          var lnglat = map.containerPointToLngLat(p.containerPoint)
          self.dataForm.mapx = lnglat.lng
          self.dataForm.mapy = lnglat.lat
          map.clearOverLays()
          var icon = new T.Icon('/static/img/blu.png', lnglat)
          var marker = new T.Marker(lnglat, icon)
          map.addOverLay(marker)
        })
      },

      Hidden () {
        this.$emit('hidden');
      },
      HiddenAndMap () {
        this.$emit('HiddenAndMap', this.dataForm.mapx, this.dataForm.mapy)
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPointDetail/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({})
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .mapBox {
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    bottom: 0;
    overflow: scroll;
    width: 100%;
    height: 100%;
  }

  .outMap {
    background: #fff;
    width: 45%;
    margin: 20px auto;
    border-radius: 5px;
    padding: 30px;
  }

  #mapDiv {
    width: 100%;
    height: 500px;
  }
</style>
