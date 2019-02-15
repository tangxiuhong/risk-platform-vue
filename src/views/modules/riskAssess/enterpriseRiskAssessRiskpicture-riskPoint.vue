<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="80%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <div>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-form-item label="平面图名称" prop="pictureName">
              <el-input v-model="dataForm.pictureName" placeholder="平面图名称" :disabled="true"></el-input>
            </el-form-item>
          </el-col>  
          <el-col :span="18">
              <el-form-item label="平面图说明" prop="pictureDesc">
                <el-input v-model="dataForm.pictureDesc" placeholder="平面图说明" :disabled="true"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">   
            <el-col :span="6">
              <el-form-item label="风险单元" prop="riskUnit">
              <el-select v-model="dataForm.riskUnit" clearable filterable placeholder="风险单元" @change="riskUnitChange">
                  <el-option
                    v-for="item in riskUnitList"
                    :key="item.id"
                    :label="item.riskUnit"
                    :value="item.id">
                  </el-option>
              </el-select>
              </el-form-item>             
            </el-col>
            <el-col :span="6">
              <el-form-item label="风险点" prop="riskPoint">
              <el-select v-model="dataForm.riskPoint" clearable filterable placeholder="风险点" @change="riskPointChange">
                  <el-option
                    v-for="item in riskPointList"
                    :key="item.id"
                    :label="item.riskPoint"
                    :value="item.id">
                  </el-option>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平面图X轴" prop="xMap">
                <el-input v-model="dataForm.xMap" placeholder="平面图X轴" :disabled="true"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="6">
              <el-form-item label="平面图Y轴" prop="yMap">
                <el-input v-model="dataForm.yMap" placeholder="平面图Y轴" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
        </el-row> 
        <el-row type="flex" justify="center">   
            <el-col :span="24">
              <div   id="picBox" ref="picSvgDiv" style="width: 900px;height: 500px;">
                <svg v-html="dataForm.pictureUrl" ref="picSvg" @click="remarkRiskPoint" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
              </div> 
            </el-col>
        </el-row>

      </div> 
    </el-form>
    <span slot="footer" class="dialog-footer">     
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      <el-button type="primary" @click="dataReset()">清除</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  
  export default {
    data () {
      return {
        picRiskTgLs:[],
        visible: false,
        riskUnitList:[],
        riskPointList:[],
        
        dataForm: {
          id: 0,
          eId: '',
          pictureName: '',
          pictureDesc: '',
          pictureUrl:'',

          riskUnit: '',
          riskPoint: '',
          xMap: '',
          yMap: ''
        }
      }
    },

    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.picRiskTgLs = []
        this.dataForm.pictureUrl = '';
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/lookPictureInfo`),
              method: 'get',
              params: this.$http.adornParams({id:this.dataForm.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm.eId = data.riskPicture.eId;
                  this.dataForm.pictureName = data.riskPicture.pictureName;
                  this.dataForm.pictureDesc = data.riskPicture.pictureDesc;
                  this.dataForm.pictureUrl = data.riskPicture.svgXml;
                  
                  this.$refs.picSvgDiv.style.width = data.riskPicture.viewBoxW+"px";
                  this.$refs.picSvgDiv.style.height = data.riskPicture.viewBoxH+"px";

                  this.$refs.picSvg.setAttribute("viewBox","0 0 "+data.riskPicture.viewBoxW+" "+data.riskPicture.viewBoxH);

              }
            })
          }

          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/listRiskUnits`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.riskUnitList = data.riskUnits;
              }
            })
          }
        })
       
      },
      riskUnitChange(e)
      {
        if(e)
        {
          this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/listRiskPoints`),
              method: 'get',
              params: this.$http.adornParams({unitId:e})
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.riskPointList = data.riskPoints;
              }
            })
        }
      },
      riskPointChange(e)
      {
        if(e)
        {
          this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/lookRiskPointInfo`),
              method: 'get',
              params: this.$http.adornParams({pointId:e,riskPictureId:this.dataForm.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                  
                  this.dataForm.xMap = data.riskPointLocation.xMap;
                  this.dataForm.yMap = data.riskPointLocation.yMap;
                  this.svgCircle(this.dataForm.xMap,this.dataForm.yMap,e);
              }
            })
        }
      },
      svgCircle(x,y,id) 
      {
        if(!id) return;
        var i;
        var point;
        for(i in this.picRiskTgLs)
        {
          var ids = this.picRiskTgLs[i];
          if(ids.id == id)
          {
            point = ids;
            break;
          }
        }
        if(point)
        {
          point.setAttribute("cx", x);
          point.setAttribute("cy", y);
        }else
        {
          var rect = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          rect.setAttribute("cx", x);
          rect.setAttribute("cy", y);
          rect.setAttribute("r", 10);
          rect.setAttribute("fill", "blue");
          rect.setAttribute("stroke-width", 2);
          rect.setAttribute("stroke", "#fff");
          rect.id = id;
          this.$refs.picSvg.appendChild(rect);
          this.picRiskTgLs.push(rect);
        }
      }, 
      remarkRiskPoint(e)
      {
          //alert("ts");
          if(this.dataForm.riskPoint != "")
          {
            this.svgCircle(e.offsetX,e.offsetY,this.dataForm.riskPoint);
            this.dataForm.xMap = e.offsetX;
            this.dataForm.yMap = e.offsetY;
          }
          
      },
      dataReset()
      {
        if(this.dataForm.riskPoint != '')
        {
           var point;
          for(var i in this.picRiskTgLs)
          {
            var ids = this.picRiskTgLs[i];
            if(ids.id == this.dataForm.riskPoint)
            {
              point = ids;
              break;
            }
          }
          if(point)
          {
            this.$refs.picSvg.removeChild(point);

            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/removeRiskPoint`),
              method: 'get',
              params: this.$http.adornParams({pointId:this.dataForm.riskPoint,riskPictureId:this.dataForm.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                  //
              }
            })
          }
          
        }
       
      },
      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.id == '' || this.dataForm.eId == '' || this.dataForm.riskPoint == '' || this.dataForm.xMap == '' || this.dataForm.yMap == '')
        {
          this.$message.error("数据填写完整！");
          return;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessRiskpicture/upDateRiskPointInfo`),
              method: 'post',
              data: this.$http.adornData({
                'riskpictureid': this.dataForm.id,
                'eid':this.dataForm.eId,
                // 'riskUnit': this.dataForm.riskUnit,
                'pointid': this.dataForm.riskPoint,
                'xmap': this.dataForm.xMap,
                'ymap':this.dataForm.yMap

              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    //this.visible = false
                    //this.$emit('refreshDataList')
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
