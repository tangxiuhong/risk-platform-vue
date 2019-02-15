<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px">
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form-item label="企业名称" prop="enterpriseName">
          <el-select v-model="dataForm.enterpriseName" filterable placeholder="企业名称"  @focus="getEnterpriseTree()"  @change="changeEnterprise">
            <el-option
              v-for="item in eidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业监测点分布图" prop="monitorPointPictureName">
            <el-select v-model="dataForm.monitorPointPictureName" filterable placeholder="企业监测点分布图" @focus="getMonitorPointPicture()" @change="pickMonitorPointPictureUrl">
              <el-option
                v-for="item in monitorPointPictureOptions"
                :key="item.id"
                :label="item.pictureName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="x轴位置" prop="monitorPointXmap">
            <el-input v-model="dataForm.monitorPointXmap" placeholder="x轴位置" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="y轴位置" prop="monitorPointYmap">
            <el-input v-model="dataForm.monitorPointYmap" placeholder="y轴位置" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="监测点名称" prop="monitorPointName">
            <el-input v-model="dataForm.monitorPointName" placeholder="监测点名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="监测点描述" prop="monitorPointDesc">
            <el-input  type="textarea" :rows="3" v-model="dataForm.monitorPointDesc" placeholder="监测点描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <div   id="picBox" ref="picSvgDiv" style="width: 900px;height: 500px;margin-left: 12.5%;">
            <svg v-html="dataForm.monitorPointPictureUrl" ref="picSvg" @click="remarkMonitorPoint" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
          </div>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        picRiskTgLs: [],
        eidOptions: [],
        monitorPointPictureOptions: [],
        dataForm: {
          id: 0,
          enterpriseId: '',
          enterpriseName: '',
          monitorPointName: '',
          monitorPointDesc: '',
          monitorPointPictureId: '',
          monitorPointPictureName: '',
          monitorPointPictureUrl: '',
          monitorPointXmap: 0,
          monitorPointYmap: 0,
          monitorPoint: ''
        },
        dataRule: {
          enterpriseId: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          monitorPointName: [
            { required: true, message: '监测点名称不能为空', trigger: 'blur' }
          ],
          monitorPointDesc: [
            { required: true, message: '监测点描述不能为空', trigger: 'blur' }
          ],
          monitorPointPictureId: [
            { required: true, message: '企业监测点分布图不能为空', trigger: 'blur' }
          ],
          monitorPointXmap: [
            { required: true, message: 'x轴位置不能为空', trigger: 'blur' }
          ],
          monitorPointYmap: [
            { required: true, message: 'y轴位置不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.dataForm.monitorPointPictureUrl = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/enterpriseMonitorPoint/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.enterpriseId = data.enterpriseMonitorPoint.enterpriseId
                this.dataForm.enterpriseName = data.enterpriseMonitorPoint.enterpriseName
                this.dataForm.monitorPointName = data.enterpriseMonitorPoint.monitorPointName
                this.dataForm.monitorPointDesc = data.enterpriseMonitorPoint.monitorPointDesc
                this.dataForm.monitorPointPictureId = data.enterpriseMonitorPoint.monitorPointPictureId
                this.dataForm.monitorPointPictureName = data.enterpriseMonitorPoint.monitorPointPictureName
                this.dataForm.monitorPointXmap = data.enterpriseMonitorPoint.monitorPointXmap
                this.dataForm.monitorPointYmap = data.enterpriseMonitorPoint.monitorPointYmap
                // 加载svg图  监测点位置
                this.pickMonitorPointPictureUrl(this.dataForm.monitorPointPictureId)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/monitor/enterpriseMonitorPoint/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'enterpriseId': this.dataForm.enterpriseId,
                'monitorPointName': this.dataForm.monitorPointName,
                'monitorPointDesc': this.dataForm.monitorPointDesc,
                'monitorPointPictureId': this.dataForm.monitorPointPictureId,
                'monitorPointXmap': this.dataForm.monitorPointXmap,
                'monitorPointYmap': this.dataForm.monitorPointYmap
              })
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
      },
      // 获取企业列表
      getEnterpriseTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eidOptions = data.list
          } else {
            this.eidOptions = []
          }
        })
      },
      // 选中企业
      changeEnterprise (vId) {
        let obj = {}
        obj = this.eidOptions.find((item) => { // 这里的userRoleList就是上面遍历的数据源
          return item.value === vId// 筛选出匹配数据
        })
        this.dataForm.enterpriseId = obj.value
      },
      // 获取企业监测点分布图列表
      getMonitorPointPicture () {
        if (this.dataForm.enterpriseId.length > 0) {
          this.$http({
            url: this.$http.adornUrl('/monitor/enterpriseMonitorPointPicture/monitorPointPictureList/' + this.dataForm.enterpriseId),
            method: 'get',
            params: this.$http.adornParams({
              'enterpriseId': this.dataForm.enterpriseId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.monitorPointPictureOptions = data.list
            } else {
              this.monitorPointPictureOptions = []
            }
          })
        }
      },
      pickMonitorPointPictureUrl (vId) { // 显示分布图
        this.dataForm.monitorPointPictureUrl = ''
        this.dataForm.monitorPointPictureId = vId // 选中分布图ID
        this.picRiskTgLs = []
        this.$http({
          url: this.$http.adornUrl(`/monitor/enterpriseMonitorPointPicture/lookPictureInfo`),
          method: 'get',
          params: this.$http.adornParams({ id: this.dataForm.monitorPointPictureId })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.monitorPointPictureUrl = data.riskPicture.svgXml
            this.$refs.picSvgDiv.style.width = data.riskPicture.viewBoxW + 'px'
            this.$refs.picSvgDiv.style.height = data.riskPicture.viewBoxH + 'px'
            this.$refs.picSvg.setAttribute('viewBox', '0 0 ' + data.riskPicture.viewBoxW + ' ' + data.riskPicture.viewBoxH)
          }
        }).then(() => {  // 显示分布图上监测点
          // if (this.dataForm.id && this.dataForm.id.length > 0) {
          this.$http({
            url: this.$http.adornUrl('/monitor/enterpriseMonitorPoint/selectMonitorPointListByPictureId/' + this.dataForm.monitorPointPictureId),
            method: 'get',
            params: this.$http.adornParams({ id: this.dataForm.monitorPointPictureId })
          }).then(({data}) => {
            if (data && data.code == 0) {
              for (let i = 0; i < data.monitorPointList.length; i++) {
                if (data.monitorPointList[i].id == this.dataForm.id) {
                  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                  rect.setAttribute('cx', this.dataForm.monitorPointXmap)
                  rect.setAttribute('cy', this.dataForm.monitorPointYmap)
                  rect.setAttribute('r', 10)
                  rect.setAttribute('fill', 'green')
                  rect.setAttribute('stroke-width', 2)
                  rect.setAttribute('stroke', '#fff')
                  rect.id = data.monitorPointList[i].id
                  this.$refs.picSvg.appendChild(rect)
                  this.picRiskTgLs.push(rect)
                } else {
                  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                  rect.setAttribute('cx', data.monitorPointList[i].monitorPointXmap)
                  rect.setAttribute('cy', data.monitorPointList[i].monitorPointYmap)
                  rect.setAttribute('r', 10)
                  rect.setAttribute('fill', 'blue')
                  rect.setAttribute('stroke-width', 2)
                  rect.setAttribute('stroke', '#fff')
                  rect.id = data.monitorPointList[i].id
                  this.$refs.picSvg.appendChild(rect)
                    // this.picRiskTgLs.push(rect)
                }
              }
            }
          })
          // }
        })
      },
      svgCircle (x, y, id) { // 在svg画圆点
        if (!id) return
        var i
        var point
        for (i in this.picRiskTgLs) {
          var ids = this.picRiskTgLs[i]
          if (ids.id == id) {
            point = ids
            break
          }
        }
        if (point) {
          point.setAttribute('cx', x)
          point.setAttribute('cy', y)
        } else {
          var rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          rect.setAttribute('cx', x)
          rect.setAttribute('cy', y)
          rect.setAttribute('r', 10)
          rect.setAttribute('fill', 'blue')
          rect.setAttribute('stroke-width', 2)
          rect.setAttribute('stroke', '#fff')
          rect.id = id
          this.$refs.picSvg.appendChild(rect)
          this.picRiskTgLs.push(rect)
        }
      },
      remarkMonitorPoint (e) { // 图上设置检测点位置
        this.dataForm.monitorPointXmap = e.offsetX
        this.dataForm.monitorPointYmap = e.offsetY
        var monitorPoint = e
        if (this.dataForm.id) {
          monitorPoint = this.dataForm.id
        }
        this.svgCircle(this.dataForm.monitorPointXmap, this.dataForm.monitorPointYmap, monitorPoint)
      },
      dataReset () {
        if (this.dataForm.monitorPoint != '') {
          var point
          for (var i in this.picRiskTgLs) {
            var ids = this.picRiskTgLs[i]
            if (ids.id == this.dataForm.monitorPoint) {
              point = ids
              break
            }
          }
          if (point) {
            this.$refs.picSvg.removeChild(point)

            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/removeRiskPoint`),
              method: 'get',
              params: this.$http.adornParams({pointId: this.dataForm.monitorPoint, riskPictureId: this.dataForm.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                //
              }
            })
          }
        }
      }
    }
  }
</script>
<style>
  .textLeft {
    text-align: left;
  }

  .textBlod {
    font-weight: bold;
    font-size: 1em;
  }

  #picBox {
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    float: left;
  }

  #picBox svg {
    position: absolute;
    border-style:solid;
  }
</style>
