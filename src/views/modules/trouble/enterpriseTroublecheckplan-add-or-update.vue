<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
             <div class="title"><span>发布检查任务</span></div>
             <hr align=center width="95%" color=#987cb9 SIZE=1>
    <el-row>
      <el-col :span="10">
        <el-form-item label="安全检查编号" prop="planNo">
          <el-input v-model="dataForm.planNo" placeholder="安全检查编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="安全检查时间" prop="planTime">
        <el-date-picker v-model="dataForm.planTime" type="date" value-format="yyyy-MM-dd" placeholder="安全检查时间"></el-date-picker>
      </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查类型" prop="checkType" fill="#ff0000">
          <el-radio-group v-model="dataForm.checkType" >
            <el-radio :label="1">安全综合检查</el-radio>
            <el-radio :label="2">专业安全检查</el-radio>
            <el-radio :label="3">专项安全检查</el-radio>
            <el-radio :label="4">日常检查</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查方案列表" prop="implementList">
          <el-upload
            ref="upload"
            class="upload-implementDetail"
            :action="uploadUrl"
            name="file"
            :auto-upload="false"
            multiple
            :file-list="implementList"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :on-change="handleChange">
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
          </el-upload>

          <el-carousel :interval="4000" type="card" height="330px" v-if="imgList.length>0" style="border:1px solid #fff">
            <el-carousel-item v-for="item in imgList" :key="item.name">
              <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.name }}</h3>
              <img :src="item.url" alt="picture" style="width:100%;height:80%;">
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查表列表" prop="inspectList">
          <el-upload
          ref="upload1"
          class="upload-inspectListDetail"
          :action="uploadUrl1"
          name="file"
          :auto-upload="false"
          multiple
          :file-list="inspectList"
          :on-remove="handleRemove1"
          :on-preview="handlePreview"
          :on-change="handleChange1">
          <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload1">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
          </el-upload>

          <el-carousel :interval="4000" type="card" height="330px" v-if="imgList1.length>0" style="border:1px solid #fff">
          <el-carousel-item v-for="item in imgList1" :key="item.name">
            <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.name }}</h3>
            <img :src="item.url" alt="picture" style="width:100%;height:80%;">
          </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="20">
        <el-form-item size="mini" label="安全检查部门">
        <el-tree
          :data="accountList"
          :props="accountListTreeProps"
          node-key="id"
          ref="accountListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
        </el-form-item>
      </el-col>
    </el-row>

    <hr align=center width="95%" color=#987cb9 SIZE=1>
    <div class="title"><span>安全检查结果</span></div>

    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查结果" prop="checkResult">
          <el-input v-model="dataForm.checkResult" placeholder="安全检查结果"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查结果列表" prop="resultList">
          <el-upload
          ref="upload2"
          class="upload-resultListDetail"
          :action="uploadUrl2"
          name="file"
          :auto-upload="false"
          multiple
          :file-list="resultList"
          :on-remove="handleRemove2"
          :on-preview="handlePreview"
          :on-change="handleChange2">
          <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
          </el-upload>

          <el-carousel :interval="4000" type="card" height="330px" v-if="imgList2.length>0" style="border:1px solid #fff">
          <el-carousel-item v-for="item in imgList2" :key="item.name">
            <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.name }}</h3>
            <img :src="item.url" alt="picture" style="width:100%;height:80%;">
          </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-col>
    </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate, getLocalAddr} from '@/utils'

  export default {
    data () {
      var validatePlanNo = (rule, value, callback) => {
        if (this.dataForm.id) {
          callback()
        } else {
          this.$http({
            url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/checkPlanNo`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (!this.dataForm.id) {
              if (data && data.code === 0) {
                for (var x in data.dataList) {
                  if (this.dataForm.planNo == data.dataList[x].planNo) {
                    callback(new Error('安全检查编号已存在'))
                  }
                }
              }
              callback()
            }
          })
        }
      }
      return {
        visible: false,
        uploadUrl: '',
        implementList: [],
        imgList: [],

        uploadUrl1: '',
        inspectList: [],
        imgList1: [],

        uploadUrl2: '',
        resultList: [],
        imgList2: [],        
        
        dataForm: {
          id: '',
          eid: '',
          planNo: '',
          planTime: '',
          checkType: 1,
          implementList: [],
          inspectList: [],
          checkResult:'',
          resultList:[]
        },
        dataRule: {
          planNo: [
            {required: true, message: '安全检查编号不能为空', trigger: 'blur'},
            {validator: validatePlanNo, message: '安全检查编号已存在', trigger: 'blur'}
          ],
          planTime: [
            {required: true, message: '安全检查时间不能为空', trigger: 'blur'}
          ]
        },
        // 用户列表
        accountList: [],
        accountListTreeProps: {
          label: 'name',
          children: 'children'
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    mounted () {
    },
    methods: {
      // 清空元素
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.accountList = []
        this.resetForm('dataForm')
        // 企业树
        this.getEnterpriseTree()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.eid = data.enterpriseTroublecheckplan.eid
              this.dataForm.id = data.enterpriseTroublecheckplan.id
              this.dataForm.planNo = data.enterpriseTroublecheckplan.planNo
              this.dataForm.planTime = data.enterpriseTroublecheckplan.planTime
              this.dataForm.checkType = data.enterpriseTroublecheckplan.checkType
              this.dataForm.checkResult = data.enterpriseTroublecheckplan.checkResult
              this.dataForm.implementList = data.enterpriseTroublecheckplan.implementList
              this.dataForm.inspectList = data.enterpriseTroublecheckplan.inspectList
              this.dataForm.resultList = data.enterpriseTroublecheckplan.resultList
              var idx = data.enterpriseTroublecheckplan.accountList.indexOf(this.tempKey)
              if (idx !== -1) {
                data.enterpriseTroublecheckplan.accountList.splice(idx, data.enterpriseTroublecheckplan.accountList.length - idx)
              }
              this.$refs.accountListTree.setCheckedKeys(data.enterpriseTroublecheckplan.accountList)
            }
          })
        }

        this.getPlanNo()
        // 安全检查方案列表上传内容
        this.uploadUrl = this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/uploadImplementFile?token=` + this.$cookie.get('token'))
        this.implementList = []
        this.imgList = []
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/checkLookInfo/1/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              // 放安全检查方案列表
              var list1 = data.dataList[0].list1
              var x
              for (x in list1) {
                var localAddr = getLocalAddr(list1[x].attachmentPath)
                var f = {name: list1[x].attachmentName, url: localAddr, id: list1[x].id}
                this.implementList.push(f)
                var fi = {name: list1[x].attachmentName, url: localAddr}
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(list1[x].attachmentName)) {
                  this.imgList.push(fi)
                }
              }
            }
          })
        }
        // 安全检查方案列表内容结束
        //  安全检查表列表上传内容
        this.uploadUrl1 = this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/uploadInspectFile?token=` + this.$cookie.get('token'))
        this.inspectList = []
        this.imgList1 = []
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/checkLookInfo/2/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              // 放安全检查表列表
              var list2 = data.dataList[0].list2
              var y
              for (y in list2) {
                var localAddr = getLocalAddr(list2[y].attachmentPath)
                var f1 = {name: list2[y].attachmentName, url: localAddr, id: list2[y].id}
                this.inspectList.push(f1)
                var fi1 = {name: list2[y].attachmentName, url: localAddr}
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(list2[y].attachmentName)) {
                  this.imgList1.push(fi1)
                }
              }
            }
          })
        }
        
        // 安全检查表列表内容结束
        this.uploadUrl2 = this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/uploadResultFile?token=` + this.$cookie.get('token'))
        this.resultList = []
        this.imgList2 = []
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/checkLookInfo/3/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              // 放安全检查表列表
              var list3 = data.dataList[0].list3
              var y
              for (y in list3) {
                var localAddr = getLocalAddr(list3[y].attachmentPath)
                var f1 = {name: list3[y].attachmentName, url: localAddr, id: list3[y].id}
                this.resultList.push(f1)
                var fi1 = {name: list3[y].attachmentName, url: localAddr}
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(list3[y].attachmentName)) {
                  this.imgList2.push(fi1)
                }
              }
            }
          })
        }
      },

      getPlanNo()
      {
        this.dataForm.bookNo = ''
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/getPlanNo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.planNo = data.planNo
          }
        })
      },

      // 获取部门树
      getDepartmentTree () {
        this.$http({
          url: this.$http.adornUrl('/enterprise/enterpriseDepartment/selectUserExt'),
          method: 'get',
          params: this.$http.adornParams({
            'enterpriseId': this.dataForm.eid
          })
        }).then(({data}) => {
          this.accountList = treeDataTranslate(data.userList, 'id', 'pId')
        })
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      submitUpload1 () {
        this.$refs.upload1.submit()
      },
      submitUpload2 () {
        this.$refs.upload2.submit()
      },
      handleRemove (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileByName/1/' + fileName
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
      handleRemove1 (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileByName/2/' + fileName
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
        this.handleChange1(file, fileList)
      },
      handleRemove2 (file, fileList) {
        var id = file.id
        var fileName = file.name
        var url = ''
        if (file.id) {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseTroublecheckplan/deleteFileByName/3/' + fileName
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
        this.handleChange2(file, fileList)
      },
      handlePreview (file, fileList) {
        console.log(file, fileList)
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
      },
      handleChange1 (file, fileList) {
        this.imgList1 = []
        var x
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url}
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.imgList1.push(fi)
          }
        }
      },
      handleChange2 (file, fileList) {
        this.imgList2 = []
        var x
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url}
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.imgList2.push(fi)
          }
        }
      },
      // 获取企业树
      getEnterpriseTree () {
        var _this = this
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectSysEnterpriseTree/0/0'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              _this.options = data.list
              // 如果为新增，则默认为第一个
              _this.dataForm.eid = data.list[0].value
              // 部门树
              this.getDepartmentTree()
            } else {
              _this.options = []
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublecheckplan/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'planNo': this.dataForm.planNo,
                'planTime': this.dataForm.planTime,
                'checkType': this.dataForm.checkType,
                'implementList': this.dataForm.implementList,
                'inspectList': this.dataForm.inspectList,
                'checkResult': this.dataForm.checkResult,
                'accountList': [].concat(this.$refs.accountListTree.getCheckedKeys())
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
<style>
.title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
