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
          <el-form-item label="设备/设施名称" prop="equName">
            <el-input v-model="dataForm.equName" placeholder="设备/设施名称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="规格/型号/参数" prop="model">
            <el-input v-model="dataForm.model" placeholder="规格/型号/参数" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="数量" prop="quantity">
            <el-input-number v-model="dataForm.quantity" controls-position="right" :min="0"
                             label="数量" :disabled="true"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="维保截止日期" prop="upkeepEndDate">
            <el-date-picker v-model="dataForm.upkeepEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="维保截止日期" :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="检校截止日期" prop="checkupEndDate">
            <el-date-picker v-model="dataForm.checkupEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="检校截止日期" :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="dataForm.description" placeholder="描述" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="主要负责人" prop="principal">
            <el-input v-model="dataForm.principal" placeholder="主要负责人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="移动电话" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="主要负责人移动电话" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="设备/设施地点" prop="installationSite">
            <el-input v-model="dataForm.installationSite" placeholder="设备/设施地点" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dataForm.status" :disabled="true">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">停用</el-radio>
              <el-radio :label="3">维修保养</el-radio>
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
          equName: '',
          model: '',
          standard: '',
          paramter: '',
          quantity: '',
          productionDate: '',
          installationDate: '',
          upkeepEndDate: '',
          checkupEndDate: '',
          description: '',
          principal: '',
          mobile: '',
          installationSite: '',
          status: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          isSync: '',
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
          this.uploadUrl = this.$http.adornUrl(`/enterprise/enterpriseSpecial/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseSpecial/listFile/${this.dataForm.id}`),
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
                    url: this.$http.adornUrl(`/enterprise/enterpriseSpecial/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (this.dataForm.id) {
                      this.$http({
                        url: this.$http.adornUrl(`/enterprise/enterpriseSpecial/lookInfo/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                      }).then(({data}) => {
                        if (data && data.code === 0) {
                          this.dataForm.id = data.dataMap.dataList[0].id
                          this.dataForm.equName = data.dataMap.dataList[0].equName
                          this.dataForm.model = data.dataMap.dataList[0].model
                          this.dataForm.quantity = data.dataMap.dataList[0].quantity
                          this.dataForm.upkeepEndDate = data.dataMap.dataList[0].upkeepEndDate
                          this.dataForm.checkupEndDate = data.dataMap.dataList[0].checkupEndDate
                          this.dataForm.description = data.dataMap.dataList[0].description
                          this.dataForm.principal = data.dataMap.dataList[0].principal
                          this.dataForm.mobile = data.dataMap.dataList[0].mobile
                          this.dataForm.installationSite = data.dataMap.dataList[0].installationSite
                          this.dataForm.status = data.dataMap.dataList[0].status
                          this.dataForm.enterpriseName = data.dataMap.dataList[0].enterpriseName
                        }
                      })
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
