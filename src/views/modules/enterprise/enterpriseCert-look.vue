<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-row :gutter="10">
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="dataForm.enterpriseName" placeholder="企业名称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="证书名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="证书名称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="证书编号" prop="cade">
            <el-input v-model="dataForm.cade" placeholder="证书编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="证书开始时间" prop="effectiveStarttime">
            <el-date-picker v-model="dataForm.effectiveStarttime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="证书有效开始时间" :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="证书结束时间" prop="effectiveEndtime">
            <el-date-picker v-model="dataForm.effectiveEndtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="证书有效结束时间" :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="发证机关" prop="issuingAuthority">
            <el-input v-model="dataForm.issuingAuthority" placeholder="发证机关" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="备注" prop="description">
            <el-input type="textarea" v-model="dataForm.description" placeholder="描述" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="证书状态" prop="state">
            <el-radio-group v-model="dataForm.state" :disabled="true">
              <el-radio :label="0">无效证书</el-radio>
              <el-radio :label="1">有效证书</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="附件列表：" prop="imgList">
            <el-upload
              ref="upload"
              class="upload-recordDetail"
              :action="uploadUrl"
              name="file"
              :auto-upload="false"
              :disabled="true"
              multiple
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :on-change="handleChange">
            </el-upload>

            <el-carousel :interval="3000" arrow="always" height="330px" v-if="imgList.length>0">
              <el-carousel-item v-for="item in imgList" :key="item.name">
                <!-- 图片 -->
                <div style="width:100%;height:100%;">
                  <h3>{{ item.name }}</h3>
                  <img :src="item.url" alt="picture" width="100%" height="80%">
                </div>
              </el-carousel-item>

            </el-carousel>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        uploadUrl: '',
        fileList: [],
        carouselVisible: false,
        dataForm: {
          id: 0,
          eid: '',
          name: '',
          cade: '',
          effectiveStarttime: '',
          effectiveEndtime: '',
          issuingAuthority: '',
          description: '',
          state: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          isSync: 0,
          enterpriseName: ''
        },
        imgList: [],
        dataRule: {}
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/enterprise/enterpriseCert/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseCert/listFile/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr =getLocalAddr(sysFiles[x].attachmentPath); 
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
              this.$nextTick(() => {
                if (this.dataForm.id) {
                  this.$http({
                    url: this.$http.adornUrl(`/enterprise/enterpriseCert/lookInfo/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.dataForm.id = data.dataMap.dataList[0].id
                      this.dataForm.name = data.dataMap.dataList[0].name
                      this.dataForm.cade = data.dataMap.dataList[0].cade
                      this.dataForm.effectiveStarttime = data.dataMap.dataList[0].effectiveStarttime
                      this.dataForm.effectiveEndtime = data.dataMap.dataList[0].effectiveEndtime
                      this.dataForm.issuingAuthority = data.dataMap.dataList[0].issuingAuthority
                      this.dataForm.description = data.dataMap.dataList[0].description
                      this.dataForm.state = data.dataMap.dataList[0].state
                      this.dataForm.enterpriseName = data.dataMap.dataList[0].enterpriseName
                    }
                  })
                }
              })
            })
          }
        })
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/emergency/emergencyPlan/deleteFileById?id=' + id
        } else {
          url = '/emergency/emergencyPlan/deleteFileByName?fileName=' + fileName
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
              this.$message.error(data.msg)
            }
          })
        }
        this.handleChange(file, fileList)
      },
      handlePreview (file, fileList) {
        // console.log(file, fileList)
        window.open(file.url)
      },
      handleChange (file, fileList) {
        this.imgList = []
        var x
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url}
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.imgList.push(fi)
          }
        }
        if (this.imgList.length > 0) {
          this.carouselVisible = true
        } else {
          this.carouselVisible = false
        }
      }
    }
  }
</script>
