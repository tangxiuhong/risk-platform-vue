<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">

      <el-form-item label="检查说明" prop="checkDo">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="dataForm.checkDo"
                  placeholder="检查说明"></el-input>
      </el-form-item>
      <el-form-item label="检查部门 " prop="department">
        <el-select v-model="dataForm.department"  filterable placeholder="检查部门" @change=departmentChg>
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查人" prop="person">
        <el-select v-model="dataForm.person"  filterable placeholder="检查人">
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      class="upload-riskPointCheckDetail"
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
  var RiskAssessPointId = '';
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
          pointId: '',
          checkDo: '',
          department: '',
          person: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: '',
          parameter1: '',
          parameter2: '',
          isSync: ''
        },
        departmentList: [],
        personList: [],
        dataRule: {

          checkDo: [
            {required: true, message: '检查说明不能为空', trigger: 'blur'}
          ],
          department: [
            {required: true, message: '检查部门不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '检查人不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, pId) {
        this.dataForm.pointId = pId;
        RiskAssessPointId = pId;
        this.dataForm.id = id || 0;

        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPointCheckDetail/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.pointId = data.enterpriseRiskAssessPointCheckDetail.pointId;
                this.dataForm.checkDo = data.enterpriseRiskAssessPointCheckDetail.checkDo;
                this.dataForm.department = data.enterpriseRiskAssessPointCheckDetail.department;
                this.dataForm.person = data.enterpriseRiskAssessPointCheckDetail.person;
                this.dataForm.createTime = data.enterpriseRiskAssessPointCheckDetail.createTime;
                this.dataForm.updateTime = data.enterpriseRiskAssessPointCheckDetail.updateTime;
                this.dataForm.createUser = data.enterpriseRiskAssessPointCheckDetail.createUser;
                this.dataForm.updateUser = data.enterpriseRiskAssessPointCheckDetail.updateUser;
                var eId = data.enterpriseRiskAssessPointCheckDetail.parameter1;

                this.initDepartmentList(eId);
                this.initPersonList(eId);
              }
            })
          } else {
            this.initDepartmentList("");
          }

          this.uploadUrl = this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPointCheckDetail/uploadFile?token=` + this.$cookie.get('token'));

          this.fileList = [];
          this.imgList = [];
          this.carouselVisible = false;
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPointCheckDetail/listFile/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var sysFiles = data.sysFiles;
                var x;
                for (x in sysFiles) {
                  var f = {name: sysFiles[x].attachmentName, url: sysFiles[x].attachmentPath, id: sysFiles[x].id};
                  this.fileList.push(f);
                  var fi = {name: sysFiles[x].attachmentName, url: sysFiles[x].attachmentPath};
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                    this.imgList.push(fi);
                  }

                  if (this.imgList.length > 0) {
                    this.carouselVisible = true;
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
          url = '/riskAssess/enterpriseRiskAssessPointCheckDetail/deleteFileById?id=' + id;
        } else {
          url = '/riskAssess/enterpriseRiskAssessPointCheckDetail/deleteFileByName?fileName=' + fileName;
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

      initDepartmentList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listDepartments`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.departmentList = data.list;
          }
        })
      },

      departmentChg (e) {
        this.dataForm.person = '';
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({orgId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list;
          }
        })
      },

      initPersonList (e) {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessResult/listUsersByDepartment`),
          method: 'get',
          params: this.$http.adornParams({eId: e})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.personList = data.list;
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPointCheckDetail/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'pointId': RiskAssessPointId,
                'checkDo': this.dataForm.checkDo,
                'department': this.dataForm.department,
                'person': this.dataForm.person,
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
