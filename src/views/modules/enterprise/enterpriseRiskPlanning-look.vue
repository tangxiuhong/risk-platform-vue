<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="dataForm.enterpriseName" placeholder="企业名称" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item label="文件类型" prop="fileGroup">
          <el-radio-group v-model="dataForm.fileGroup" :disabled="true">
            <el-radio :label="1">管控措施</el-radio>
            <el-radio :label="2">分级管控制度</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item label="管控措施名称" prop="planName">
          <el-input v-model="dataForm.planName" placeholder="管控措施名称" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item label="简介" prop="description">
          <el-input type="textarea" v-model="dataForm.description" style="border-radius:5px;"
                    placeholder="请输入简介" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lx="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" v-model="dataForm.memo" style="border-radius:5px;" placeholder="请输入备注"
                    :disabled="true"></el-input>
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
          fileGroup: 1,
          planName: '',
          description: '',
          memo: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
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
          this.uploadUrl = this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/listFile/${this.dataForm.id}`),
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
                    url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (this.dataForm.id) {
                      this.$http({
                        url: this.$http.adornUrl(`/enterprise/enterpriseRiskPlanning/lookInfo/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                      }).then(({data}) => {
                        if (data && data.code === 0) {
                          this.dataForm.id = data.dataMap.dataList[0].id
                          this.dataForm.enterpriseName = data.dataMap.dataList[0].enterpriseName
                          this.dataForm.fileGroup = data.dataMap.dataList[0].fileGroup
                          this.dataForm.planName = data.dataMap.dataList[0].planName
                          this.dataForm.description = data.dataMap.dataList[0].description
                          this.dataForm.memo = data.dataMap.dataList[0].memo
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

  .record_look_content {
    margin-top: 30px;
    width: 100%;
    margin-bottom: 50px;
  }

  .record_look_content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .record_look_content ul li {
    float: left;
  }

  .record_look_content .el-input__inner {
    border: 0px solid #ffffff;
  }

  .record_look_content .li_1 {
    width: 97%;
  }

  .record_look_content .li_2 {
    width: 47%;
    margin-right: 3%;
  }

  .record_look_content .li_3 {
    width: 30.33%;
    margin-right: 3%;
  }

  .record_look_content .li_4 {
    width: 22%;
    margin-right: 3%;
  }

  .record_look_content .img_size {
    width: 100%;
    height: 100%;
  }
</style>
