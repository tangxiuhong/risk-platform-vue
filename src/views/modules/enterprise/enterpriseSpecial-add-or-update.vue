<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="所属企业" prop="eid">
        <el-select v-model="dataForm.eid" filterable placeholder="所属企业" clearable>
          <el-option
            v-for="item in eIdCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备/设施名称" prop="equName">
        <el-input v-model="dataForm.equName" placeholder="设备/设施名称"></el-input>
      </el-form-item>
      <el-form-item label="规格/型号/参数" prop="model">
        <el-input v-model="dataForm.model" placeholder="规格/型号/参数"></el-input>
      </el-form-item>
      <!-- <el-form-item label="规格" prop="standard">
         <el-input v-model="dataForm.standard" placeholder="规格"></el-input>
       </el-form-item>
       <el-form-item label="参数" prop="paramter">
         <el-input v-model="dataForm.paramter" placeholder="参数"></el-input>
       </el-form-item>-->
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="dataForm.quantity" controls-position="right" :min="0" label="数量"></el-input-number>
      </el-form-item>
      <el-form-item label="维保截止日期" prop="upkeepEndDate">
        <el-date-picker v-model="dataForm.upkeepEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="维保截止日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="检校截止日期" prop="checkupEndDate">
        <el-date-picker v-model="dataForm.checkupEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="检校截止日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="主要负责人" prop="principal">
        <el-input v-model="dataForm.principal" placeholder="主要负责人"></el-input>
      </el-form-item>
      <el-form-item label="移动电话" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="主要负责人移动电话"></el-input>
      </el-form-item>
      <el-form-item label="设备/设施地点" prop="installationSite">
        <el-input v-model="dataForm.installationSite" placeholder="设备/设施地点"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="特种设备附件" prop="">
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

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        imgList: [],
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
          isSync: ''
        },
        options: [{
          value: 1,
          label: '正常'
        }, {
          value: 2,
          label: '停用'
        }, {
          value: 3,
          label: '维修保养'
        }],
        // 选择企业eid
        eIdCodeOptions: [],
        dataRule: {
          eid: [
            {required: true, message: '企业不能为空', trigger: 'blur'}
          ],
          equName: [
            {required: true, message: '设备/设施名称不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          model: [
            {required: true, message: '型号不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          standard: [
            {required: true, message: '规格不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          paramter: [
            {required: true, message: '参数不能为空', trigger: 'blur'},
            {max: 60, message: '长度不超过60个字符', trigger: 'blur'}
          ],
          quantity: [
            {required: true, message: '数量不能为空', trigger: 'blur'}
          ],
          productionDate: [
            {required: true, message: '生产日期不能为空', trigger: 'blur'}
          ],
          installationDate: [
            {required: true, message: '安装日期不能为空', trigger: 'blur'}
          ],
          upkeepEndDate: [
            {required: true, message: '维保截止日期不能为空', trigger: 'blur'}
          ],
          checkupEndDate: [
            {required: true, message: '检校截止日期不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '描述不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          principal: [
            {required: true, message: '主要负责人不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '主要负责人移动电话不能为空', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          installationSite: [
            {required: true, message: '设备/设施地点不能为空', trigger: 'blur'},
            {max: 255, message: '长度不超过255个字符', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '记录创建时间不能为空', trigger: 'blur'}
          ],
          updateTime: [
            {required: true, message: '记录最后修改时间不能为空', trigger: 'blur'}
          ],
          createUser: [
            {required: true, message: '记录创建者(用户)不能为空', trigger: 'blur'}
          ],
          updateUser: [
            {required: true, message: '记录最后修改者(用户)不能为空', trigger: 'blur'}
          ],
          isSync: [
            {required: true, message: '数据是否同步不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 获取企业主表id树
      getEIDTree () {
        var _this = this
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),    // -------------------------改成企业eid路径
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.list.length === 1) {
                _this.eIdCodeOptions = data.list
                _this.dataForm.eid = data.list[0].value
              } else {
                _this.eIdCodeOptions = data.list
              }
            } else {
              _this.eIdCodeOptions = []
            }
          })
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getEIDTree()
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
                    if (data && data.code === 0) {
                      this.dataForm.eid = data.enterpriseSpecial.eid
                      this.dataForm.equName = data.enterpriseSpecial.equName
                      this.dataForm.model = data.enterpriseSpecial.model
                      this.dataForm.standard = data.enterpriseSpecial.standard
                      this.dataForm.paramter = data.enterpriseSpecial.paramter
                      this.dataForm.quantity = data.enterpriseSpecial.quantity
                      this.dataForm.productionDate = data.enterpriseSpecial.productionDate
                      this.dataForm.installationDate = data.enterpriseSpecial.installationDate
                      this.dataForm.upkeepEndDate = data.enterpriseSpecial.upkeepEndDate
                      this.dataForm.checkupEndDate = data.enterpriseSpecial.checkupEndDate
                      this.dataForm.description = data.enterpriseSpecial.description
                      this.dataForm.principal = data.enterpriseSpecial.principal
                      this.dataForm.mobile = data.enterpriseSpecial.mobile
                      this.dataForm.installationSite = data.enterpriseSpecial.installationSite
                      this.dataForm.status = data.enterpriseSpecial.status
                      this.dataForm.createTime = data.enterpriseSpecial.createTime
                      this.dataForm.updateTime = data.enterpriseSpecial.updateTime
                      this.dataForm.createUser = data.enterpriseSpecial.createUser
                      this.dataForm.updateUser = data.enterpriseSpecial.updateUser
                      this.dataForm.isSync = data.enterpriseSpecial.isSync
                      this.getEIDTree()
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
          url = '/enterprise/enterpriseSpecial/deleteFileById?id=' + id
        } else {
          url = '/enterprise/enterpriseSpecial/deleteFileByName?fileName=' + fileName
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
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseSpecial/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'eid': this.dataForm.eid,
                'equName': this.dataForm.equName,
                'model': this.dataForm.model,
                'standard': this.dataForm.standard,
                'paramter': this.dataForm.paramter,
                'quantity': this.dataForm.quantity,
                'productionDate': this.dataForm.productionDate,
                'installationDate': this.dataForm.installationDate,
                'upkeepEndDate': this.dataForm.upkeepEndDate,
                'checkupEndDate': this.dataForm.checkupEndDate,
                'description': this.dataForm.description,
                'principal': this.dataForm.principal,
                'mobile': this.dataForm.mobile,
                'installationSite': this.dataForm.installationSite,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'isSync': this.dataForm.isSync
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
