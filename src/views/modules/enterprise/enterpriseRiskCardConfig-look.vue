<template>
  <el-dialog
    :title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" ref="dataForm"
             label-width="110px">
      <div  class="riskCardLook">
        <!-- 标题部分 -->
        <div class="title"><span>重点岗位风险告知卡</span></div>
        <!-- 第一行 -->
        <div class="left_content">
          <span>岗位名称：</span>
          <span>{{dataForm.positionName}}</span>
        </div>
        <!-- 表格内容 -->
       <table>
          <tr>
            <td style="width:10%;">工作内容</td>
            <td style="width:35%;">{{dataForm.workContent}}</td>
            <td style="width:5%">工作<br/>场所</td>
            <td colspan="2" style="width:15%;">{{dataForm.workplace}}</td>
            <td style="width:10%;">风险等级</td>
            <td style="width:25%;">{{dataForm.riskLevel==1? 'Ⅰ级': dataForm.riskLevel==2? 'Ⅱ级':dataForm.riskLevel==3? 'Ⅲ级':'IV级'}}</td>
          </tr>
          <tr v-for="(item,index) in dataForm.dataList" :key="index">
             <td v-if="index==0" :rowspan="dataForm.dataList.length">
                危险有害因素
             </td>
             <td>{{item.harmfulFactors}}</td>
              <td v-if="index==0" :rowspan="dataForm.dataList.length" style="text-align:center;">
                事<br/>故<br/>模<br/>式
              </td>
              <td v-if="index==0" :rowspan="dataForm.dataList.length">{{dataForm.accidentModel}}</td>
              <td v-if="index==0" :rowspan="dataForm.dataList.length" style="text-align:center;width:5%;">管<br/>控<br/>措<br/>施</td>
              <td colspan="2">{{item.controlMeasures}}</td>
          </tr>
          <tr>
             <td>应急措施</td>
             <td colspan="6">{{dataForm.emergencyMeasure}}</td>
          </tr>
        </table>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          positionName: '',
          workContent: '',
          workplace: '',
          riskLevel: '',
          emergencyMeasure: '',
          accidentModel: '',
          dataList: [ ]
        }
      }
    },
    methods: {
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      init (id) {
        this.resetForm('dataForm')
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskCardConfig/lookRiskCardInfo/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.positionName = data.dataMap.enterPriseRiskCardConfig.positionName
                this.dataForm.workContent = data.dataMap.enterPriseRiskCardConfig.workContent
                this.dataForm.workplace = data.dataMap.enterPriseRiskCardConfig.workplace
                this.dataForm.riskLevel = data.dataMap.enterPriseRiskCardConfig.riskLevel
                this.dataForm.emergencyMeasure = data.dataMap.enterPriseRiskCardConfig.emergencyMeasure
                this.dataForm.accidentModel = data.dataMap.enterPriseRiskCardConfig.accidentModel
                this.dataForm.dataList = data.dataMap.dataList
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
  }

  .clear {
    display: block;
    overflow: hidden;
  }
  table{
    border-collapse:collapse;
    border-spacing:0;
  }
  .riskCardLook td{
    border:1px solid #DCDFE6;
    padding-left:5px;
  }
</style>
