<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '明细'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">
      <el-form-item label="措施编号" prop="doId">
        <el-input-number v-model="dataForm.doId" controls-position="right" :min="0"
                         label="措施编号" :disabled="true"></el-input-number>
      </el-form-item>
      <el-form-item label="管控措施" prop="riskDo">
        <el-input v-model="dataForm.riskDo" :disabled="true" placeholder="管控措施"></el-input>
      </el-form-item>
      <el-form-item label="风险计算权重" prop="riskWeight">
        <el-input v-model="dataForm.riskWeight" :disabled="true" placeholder="风险计算权重"></el-input>
      </el-form-item>
      <el-form-item label="附件文件名称列表 " prop="attachments">
        <el-input v-model="dataForm.attachments" :disabled="true" placeholder="附件文件名称列表 "></el-input>
      </el-form-item>
    </el-form>

    <ul id="example-1">
      <li v-for="item in fileList" :key="item.name">
        <a :href="item.url" target="_blank">{{ item.name}}</a>
      </li>
    </ul>

    <el-carousel :interval="4000" type="card" height="200px" v-if="carouselVisible">
      <el-carousel-item v-for="item in imgList" :key="item.name">
        <h3>{{ item.name }}</h3>
        <img :src="item.url" alt="picture" width="100%" height="80%">
      </el-carousel-item>
    </el-carousel>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getLocalAddr} from '@/utils'
  var RiskAssessPoint = ''
  export default {
    data() {
      return {
        visible: false,
        fileList: [],
        imgList: [],
        carouselVisible: false,
        dataForm: {
          id: 0,
          factorId: '',
          doId: '',
          riskDo: '',
          attachments: '',
          riskWeight: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: ''
        },
        dataRule: {

          riskDo: [
            {required: true, message: '管控措施不能为空', trigger: 'blur'}
          ],
          attachments: [
            {required: true, message: '附件文件名称列表 ; 分隔不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(id, pId) {
        this.dataForm.factorId = pId
        RiskAssessPoint = pId
        this.dataForm.id = id || 0

        this.visible = true
        params: this.$http.adornParams()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactordo/info/${this.dataForm.id}`),
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.factorId = data.enterpriseRiskAssessFactordo.factorId
                this.dataForm.doId = data.enterpriseRiskAssessFactordo.doId
                this.dataForm.riskDo = data.enterpriseRiskAssessFactordo.riskDo
                this.dataForm.attachments = data.enterpriseRiskAssessFactordo.attachments
                this.dataForm.riskWeight = data.enterpriseRiskAssessFactordo.riskWeight
                this.dataForm.createTime = data.enterpriseRiskAssessFactordo.createTime
                this.dataForm.updateTime = data.enterpriseRiskAssessFactordo.updateTime
                this.dataForm.createUser = data.enterpriseRiskAssessFactordo.createUser
                this.dataForm.updateUser = data.enterpriseRiskAssessFactordo.updateUser
              }
            })
          }
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactordo/listFile/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr = getLocalAddr(sysFiles[x].attachmentPath) // 判断并变更地址
                  var f = {name: sysFiles[x].attachmentName, url: localAddr, id: sysFiles[x].id}
                  this.fileList.push(f)
                  var fi = {name: sysFiles[x].attachmentName, url: localAddr}
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                    this.imgList.push(fi)
                  }
                  if (this.imgList.length > 0) {
                    this.carouselVisible = true
                  }
                }
              }
            })
          }
        })
      },
      handlePreview(file, fileList) {
        console.log(file, fileList)
        window.open(file.url)
      },
      // 表单提交
      dataFormSubmit() {
        this.visible = false
        this.$emit('refreshDataList')
      }
    }
  }
</script>
