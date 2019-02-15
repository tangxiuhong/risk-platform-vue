<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">

      <el-form-item label="措施编号" prop="doId">
          <el-input-number v-model="dataForm.doId" controls-position="right" :min="0"
                           label="措施编号"></el-input-number>
        </el-form-item>
      <el-form-item label="管控措施" prop="riskDo">
        <el-input type="textarea" v-model="dataForm.riskDo" style="border-radius:5px;"
                  placeholder="管控措施"></el-input>
      </el-form-item>
      <el-form-item label="风险计算权重" prop="riskWeight">
        <el-input v-model="dataForm.riskWeight" placeholder="风险计算权重"></el-input>
      </el-form-item>
      <el-form-item label="是否接受" size="mini" prop="isAccept">
        <el-radio-group v-model="dataForm.isAccept">
          <el-radio :label="0">可接受</el-radio>
          <el-radio :label="1">不可接受</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-upload
      ref="upload"
      class="upload-riskPointDetail"
      :action="uploadUrl"
      name="file"
      :auto-upload="false"
      multiple
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :on-change="handleChange">
      <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
    </el-upload>

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
  var RiskAssessPoint = '';
  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
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
          isAccept: '',
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
          doId: [
            {required: true, message: '措施编号不能为空', trigger: 'blur'}
          ],
          riskWeight: [
            {required: true, message: '风险计算权重不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, pId) {
        this.dataForm.factorId = pId
        RiskAssessPoint = pId
        this.dataForm.id = id || 0

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactordo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.factorId = data.enterpriseRiskAssessFactordo.factorId
                this.dataForm.doId = data.enterpriseRiskAssessFactordo.doId
                this.dataForm.riskDo = data.enterpriseRiskAssessFactordo.riskDo
                this.dataForm.attachments = data.enterpriseRiskAssessFactordo.attachments
                this.dataForm.riskWeight = data.enterpriseRiskAssessFactordo.riskWeight
                this.dataForm.isAccept = data.enterpriseRiskAssessFactordo.isAccept
                this.dataForm.createTime = data.enterpriseRiskAssessFactordo.createTime
                this.dataForm.updateTime = data.enterpriseRiskAssessFactordo.updateTime
                this.dataForm.createUser = data.enterpriseRiskAssessFactordo.createUser
                this.dataForm.updateUser = data.enterpriseRiskAssessFactordo.updateUser
              }
            })
          }

          this.uploadUrl = this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactordo/uploadFile?token=` + this.$cookie.get('token'));

          this.fileList = [];
          this.imgList = [];
          this.carouselVisible = false;
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

      submitUpload () {
        this.$refs.upload.submit();
      },
      handleRemove (file, fileList) {

        var id = file.id;
        var fileName = file.name;
        var url = '';
        if (file.id) {
          url = '/riskAssess/enterpriseRiskAssessFactordo/deleteFileById?id=' + id;
        } else {
          url = '/riskAssess/enterpriseRiskAssessFactordo/deleteFileByName?fileName=' + fileName;
        }
        if (url) {
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg);
            }
          })
        }
        this.handleChange(file, fileList);
      },

      handlePreview (file, fileList) {
        console.log(file, fileList);
        window.open(file.url);
      },

      handleChange (file, fileList) {
        this.imgList = [];
        var x;
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url};
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.imgList.push(fi);
          }
        }

        if (this.imgList.length > 0) {
          this.carouselVisible = true;
        } else {
          this.carouselVisible = false;
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessFactordo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'factorId': RiskAssessPoint,
                'doId': this.dataForm.doId,
                'riskDo': this.dataForm.riskDo,
                'attachments': this.dataForm.attachments,
                'riskWeight': this.dataForm.riskWeight,
                'isAccept': this.dataForm.isAccept,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser
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
      }
    }
  }
</script>
