<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="新闻标题"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="isuseDate">
        <el-date-picker type="datetime" v-model="dataForm.isuseDate" placeholder="发布日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">保存</el-radio>
          <el-radio :label="1">发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失效时间" prop="endDate">
        <el-date-picker type="datetime" v-model="dataForm.endDate" placeholder="失效时间"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss">

        </el-date-picker>
      </el-form-item>
      <el-form-item label="附件上传" prop="">
        <el-upload
          ref="upload"
          class="upload-recordDetail"
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

        <el-carousel :interval="4000" type="card" height="200px" v-if="carouselVisible" style="border:1px solid #fff">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <h3>{{ item.name }}</h3>
            <img :src="item.url" alt="picture" width="100%" height="80%">
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
      <ueditor-into ref="ueditorInto"></ueditor-into>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ueditorInto from '../../ueditor/ueditor'
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        uploadUrl: '',
        fileList: [],
        imgList: [],
        carouselVisible: false,
        dataForm: {
          id: 0,
          content: '',
          isuseDate: '',
          status: '',
          endDate: '',
          createUser: '',
          createDate: '',
          updateUser: '',
          updateDate: '',
          title: '',
          image: ''
        },
        dataRule: {
          title: [
            {required: true, message: '新闻标题不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '新闻内容不能为空', trigger: 'blur'}
          ],
          isuseDate: [
            {required: true, message: '发布日期不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          endDate: [
            {required: true, message: '失效时间不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      ueditorInto
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.uploadUrl = this.$http.adornUrl(`/notice/sysNews/uploadFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/notice/sysNews/listFile/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles
                var x
                for (x in sysFiles) {
                  var localAddr =getLocalAddr(sysFiles[x].attachmentPath);
                  var f = {name: sysFiles[x].attachmentName, url: localAddr, id: sysFiles[x].id};
                  this.fileList.push(f)
                  var fi = {name: sysFiles[x].attachmentName, url: localAddr};
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
                    url: this.$http.adornUrl(`/notice/sysNews/info/${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.dataForm.content = data.sysNews.content
                      this.dataForm.isuseDate = data.sysNews.isuseDate
                      this.dataForm.status = data.sysNews.status
                      this.dataForm.endDate = data.sysNews.endDate
                      this.dataForm.title = data.sysNews.title
                      this.dataForm.image = data.sysNews.image
                      this.$refs.ueditorInto.init(this.dataForm.content)
                    }
                  })
                }
              })
            })
          }
        })
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/notice/sysNews/deleteFileById?id=' + id
        } else {
          url = '/notice/sysNews/deleteFileByName?fileName=' + fileName
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
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.ueditorInto.getContent()
        this.dataForm.content = this.$refs.ueditorInto.ueContent
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/notice/sysNews/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'content': this.dataForm.content,
                'isuseDate': this.dataForm.isuseDate,
                'status': this.dataForm.status,
                'endDate': this.dataForm.endDate,
                'title': this.dataForm.title,
                'image': this.dataForm.image
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.fileList = []
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
