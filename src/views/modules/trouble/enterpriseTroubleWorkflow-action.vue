<template>
  <div>
    <el-dialog
      :title="!dataForm.id ? '新增' : '整改'"
      :close-on-click-modal="false"
      :visible.sync="visible" width="80%">
      <el-form :model="dataForm" ref="dataForm" label-width="140px">
        <div>
          <!-- 标题部分 -->
          <div class="title"><span>事故隐患整改指令书</span></div>
          <!-- 第一行 -->
          <div>
            <el-row type="flex" justify="center">
              <!-- 第一行 -->
              <el-col :span="4" class="textLeft textBlod">
                <span>安全检查任务编号：</span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span>{{dataForm.planNo}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>安全检查类型：</span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span v-if="dataForm.checkType=== 1">安全综合检查</span>
                <span v-else-if="dataForm.checkType === 2">专业安全检查</span>
                <span v-else-if="dataForm.checkType === 3">专项安全检查</span>
                <span v-else-if="dataForm.checkType === 4">日常检查</span>
                <span v-else-if="dataForm.checkType === 5">自主管理</span>
                <span v-else-if="dataForm.checkType === 6">风险日常检查</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>隐患编号：</span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span>{{dataForm.troubleNum}}</span>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row type="flex" justify="center">
              <el-col :span="4" class="textLeft textBlod">
                <span>责任单位：</span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span>{{dataForm.departmentName}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>责任人：</span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span>{{dataForm.personName}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span></span>
              </el-col>
              <el-col :span="2" class="textLeft">
                <span><span style="font-weight:bold;">第[</span>{{dataForm.bookNo}}<span
                  style="font-weight:bold;">]号</span></span>
              </el-col>
            </el-row>
            <!-- 第三行 -->
            <el-row type="flex" justify="center">
              <el-col :span="4" class="textLeft textBlod">
                <span> 在分公司(分公司、工区)</span>
              </el-col>
              <el-col :span="16" class="textLeft textBlod">
                <span>{{dataForm.checkTime}}</span>
                <span>定期(日常)安全综合检查中,发现您单位存在以下隐患(问题)：</span>
              </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row type="flex" justify="center">
              <el-col :span="20" class="textLeft content">
                <span>{{dataForm.troubleDescription}}</span>
              </el-col>
            </el-row>

            <!-- 第五行 -->
            <el-row type="flex" justify="center">
              <el-col :span="4" class="textLeft textBlod">
                <span>临时控制措施：</span>
              </el-col>
              <el-col :span="6"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>整改要求：</span>
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>

            <el-row type="flex" justify="center">
              <el-col :span="9" class="textLeft content">
                <span>{{dataForm.measure}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="10" class="textLeft content">
                <span>{{dataForm.memo}}</span>
              </el-col>

            </el-row>

            <!-- 第六行 -->
            <el-row type="flex" justify="center">
              <el-col :span="4" class="textLeft textBlod">
                <span>整改期限：</span>
              </el-col>
              <el-col :span="6" class="textLeft">
                <span>{{dataForm.timeAffirm}}</span>
              </el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>隐患级别：</span>
              </el-col>
              <el-col :span="6" class="textLeft">
                <span v-if="dataForm.troubleType=== 1">一般隐患</span>
                <span v-else-if="dataForm.troubleType === 2">重大隐患</span>
              </el-col>
            </el-row>

            <!-- 第七行 -->
            <el-row type="flex" justify="center">
              <el-col :span="2" class="textLeft textBlod">
                <span>图片列表：</span>
              </el-col>
              <el-col :span="18" class="textLeft">
                <!-- 第一个走马灯 -->
                <el-carousel :interval="4000" type="card" height="200px" v-if="dataFormCarouselVisible">
                  <el-carousel-item v-for="item in dataForm.imgList" :key="item.attachmentName">

                    <div class="bottom_picture_area">
                      <img :src="item.attachmentPath" alt="picture" class="img_size">
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>

            <!-- 第八行 -->
            <el-row type="flex" justify="center">
              <el-col :span="4" class="textLeft textBlod">
                <span>检查单位：</span>
              </el-col>
              <el-col :span="2">
                <span>{{dataForm.checkDepartmentName}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>检查人：</span>
              </el-col>
              <el-col :span="2">
                <span>{{dataForm.checkManName}}</span>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="4" class="textLeft textBlod">
                <span>填写人：</span>
              </el-col>
              <el-col :span="2">
                <span>{{dataForm.createUserName}}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>

      <hr align=center width="85%" color=#987cb9 SIZE=1>

      <!--  事故隐患整改反馈单部分 -->
      <el-form :model="flowDataForm" :rules="dataRule" ref="flowDataForm" label-width="140px">
        <div>

          <div class="title"><span>事故隐患整改反馈单</span></div>
          <div>
            <!-- 第一行 -->
            <el-row type="flex" justify="center">
              <el-col :span="20" class="textLeft textBlod">
                <el-form-item label="主管部门：" prop="checkDepartmentName">
                  <span>{{dataForm.checkDepartmentName}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row type="flex" justify="center">
              <el-col :span="20" class="textLeft textBlod">
                <el-form-item label="" prop="actionTime">
                  <span> 公司(分公司、工区)第</span>
                  <span style="font-weight: bold">{{dataForm.bookNo}}</span>
                  <span>号已接到,所有通知的隐患(问题)已于</span>
                  <el-date-picker
                    v-model="flowDataForm.actionTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                  <span>日整改处理完毕,整改处理结果如下：</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第三行 -->

            <el-row type="flex" justify="center">
              <el-col :span="20">
                <el-form-item label="" prop="actionDescription">
                  <el-input type="textarea" v-model="flowDataForm.actionDescription"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row type="flex" justify="center">
              <el-col :span="20" class="textLeft textBlod">
                <el-form-item label="隐患图片" prop="">
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
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
                  </el-upload>

                  <el-carousel :interval="4000" type="card" height="200px" v-if="flowDataFormCarouselVisible">
                    <el-carousel-item v-for="item in flowDataForm.actionImgList" :key="item.name">
                      <h3>{{ item.name }}</h3>
                      <img :src="item.url" alt="picture" width="100%" height="80%">
                    </el-carousel-item>
                  </el-carousel>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第六行 -->
            <el-row type="flex" justify="center">
              <el-col :span="6" class="textLeft textBlod">
                <el-form-item label="整改单位：" prop="actionDepartmentName">
                  <el-input v-model="flowDataForm.actionDepartmentName" readonly="true"></el-input>

                </el-form-item>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="6" class="textLeft textBlod">
                <el-form-item label="整改实施人：" prop="actionManName">
                  <el-input v-model="flowDataForm.actionManName" readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="6" class="textLeft textBlod">
                <el-form-item label="安全主管复查人：" prop="acceptManName">
                  <el-input v-model="flowDataForm.acceptManName" readonly="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>

      <span slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="2">
          <el-button @click="visible = false">取消</el-button>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="2">
          <el-button type="primary" @click=dataFormSubmit(0)>保存</el-button>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="2">
          <el-button type="primary" @click=dataFormSubmit(1)>整改完成</el-button>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="2">
          <el-button type="primary" @click=reportToLeader()>继续上报</el-button>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="2">
          <el-button type="primary" @click=reportTo()>继续转发</el-button>
        </el-col>
      </el-row>
    </span>
    </el-dialog>
    <report v-if="reportToLeaderVisible" ref="report" @refreshDataList="getDataList"></report>
    <reportTo v-if="reportToVisible" ref="reportTo" @refreshDataList="getDataList"></reportTo>
  </div>
</template>

<script>
  import report from './enterpriseTroubleWorkflow-report'
  import reportTo from './enterpriseTroubleWorkflow-reportTo'
  import {getLocalAddr} from '@/utils'
  export default {
    data () {
      return {
        reportToLeaderVisible: false,
        reportToVisible:false,
        visible: false,
        dataForm: {
          id: 0,
          planNo: '',
          checkType: 0,
          troubleNum: '',
          departmentName: '',
          personName: '',
          bookNo: '',
          troubleDescription: '',
          measure: '',
          memo: '',
          timeAffirm: '',
          troubleType: '',
          imgList: [],
          checkDepartmentName: '',
          checkManName: '',
          createUser: '',
          createUserName: ''
        },

        flowDataForm: {
          id: 0,
          troubleRdId: '',
          actionDepartment: 0,
          actionDepartmentName: '',
          actionMan: '',
          actionManName: '',

          actionTime: '',
          actionDescription: '',
          actionImgList: [],
          acceptDepartment: '',
          acceptDepartmentName: '',
          acceptMan: '',
          acceptManName: '',
          createUser: '',
          status: 1
        },
        dataFormCarouselVisible: false,
        flowDataFormCarouselVisible: false,
        uploadUrl: '',
        fileList: [],
        dataRule: {
          actionTime: [
            {required: true, message: '整改完成时间不能为空', trigger: 'blur'}
          ],
          actionDescription: [
            {required: true, message: '整改完成内容不能为空', trigger: 'blur'}
          ],
          actionDepartmentName: [
            {required: true, message: '整改部门不能为空', trigger: 'blur'}
          ],
          actionManName: [
            {required: true, message: '整改人不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      report,reportTo
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.actionImgList = [];
        this.flowDataForm.actionImgList = [];
        this.uploadUrl = this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/uploadFile?token=` + this.$cookie.get('token'));
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.$refs['flowDataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/enterpriseTroublInfo`),
              method: 'get',
              params: this.$http.adornParams({id: this.dataForm.id})
            }).then(({data}) => {
              if (data && data.code === 0 && data.list) {
                this.dataForm.id = data.list.id;
                this.dataForm.planNo = data.list.planNo;
                this.dataForm.checkType = data.list.checkType;
                this.dataForm.troubleNum = data.list.troubleNum;
                this.dataForm.departmentName = data.list.departmentName;
                this.dataForm.personName = data.list.personName;
                this.dataForm.bookNo = data.list.bookNo;
                this.dataForm.troubleDescription = data.list.troubleDescription;
                this.dataForm.measure = data.list.measure;
                this.dataForm.memo = data.list.memo;
                this.dataForm.timeAffirm = data.list.timeAffirm;
                this.dataForm.troubleType = data.list.troubleType;
               // this.dataForm.imgList = data.list.imgList;
                this.dataForm.imgList = []
                for (var x in data.list.imgList) {
                  var a = { }
                  a.attachmentName = data.list.imgList[x].attachmentName
                  a.attachmentPath = getLocalAddr(data.list.imgList[x].attachmentPath)
                  this.dataForm.imgList.push(a)
                }
                this.dataForm.checkDepartmentName = data.list.checkDepartmentName;
                this.dataForm.checkManName = data.list.checkManName;
                this.dataForm.createUser = data.list.createUser;
                this.dataForm.createUserName = data.list.createUserName;

                if (data.list.imgList.length > 0) {
                  this.dataFormCarouselVisible = true;
                }
              }
            }).then(() => {

              this.$http({
                url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/workflowInfo/`),
                method: 'get',
                params: this.$http.adornParams({troubleRdId: this.dataForm.id, status: '0'})
              }).then(({data}) => {
                if (data && data.code === 0 && data.list) {

                  this.flowDataForm.id = data.list.id;
                  this.flowDataForm.troubleRdId = data.list.troubleRdId;
                  this.flowDataForm.actionDepartment = data.list.actionDepartment;
                  this.flowDataForm.actionDepartmentName = data.list.actionDepartmentName;
                  this.flowDataForm.actionMan = data.list.actionMan;
                  this.flowDataForm.actionManName = data.list.actionManName;
                  this.flowDataForm.actionTime = data.list.actionTime;
                  this.flowDataForm.actionDescription = data.list.actionDescription;

                  this.flowDataForm.createUser = data.list.createUser;
                  this.flowDataForm.status = data.list.status;

                  this.flowDataForm.acceptDepartment = data.list.acceptDepartment;
                  this.flowDataForm.acceptDepartmentName = data.list.acceptDepartmentName;
                  this.flowDataForm.acceptMan = data.list.acceptMan;
                  this.flowDataForm.acceptManName = data.list.acceptManName;

                  var sysFiles = data.list.actionImgList;

                  this.flowDataForm.actionImgList = [];
                  this.fileList = [];
                  for (var x in sysFiles) {
                    var localAddr = getLocalAddr(sysFiles[x].attachmentPath)
                    var f = {name: sysFiles[x].attachmentName, url: localAddr, id: sysFiles[x].id};
                    this.fileList.push(f);
                    var fi = {name: sysFiles[x].attachmentName, url: localAddr};
                    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(sysFiles[x].attachmentName)) {
                      this.flowDataForm.actionImgList.push(fi);
                    }
                  }
                  if (this.flowDataForm.actionImgList.length > 0) {
                    this.flowDataFormCarouselVisible = true;
                  }

                }
              })

            })
          }
        })
      },

      getDataList () {
        this.visible = false;
        this.$emit('refreshDataList');
      },

      submitUpload () {
        this.$refs.upload.submit();
      },

      handleRemove (file, fileList) {

        var id = file.id;
        var fileName = file.name;
        var url = '';
        if (file.id) {
          url = '/trouble/enterpriseTroubleWorkflow/deleteFileById?id=' + id;
        } else {
          url = '/trouble/enterpriseTroubleWorkflow/deleteFileByName?fileName=' + fileName;
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
        window.open(file.url);
      },

      handleChange (file, fileList) {
        this.flowDataForm.actionImgList = [];
        var x;
        for (x in fileList) {
          var fi = {name: fileList[x].name, url: fileList[x].url};
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
            this.flowDataForm.actionImgList.push(fi);
          }
        }

        if (this.flowDataForm.actionImgList.length > 0) {
          this.flowDataFormCarouselVisible = true;
        } else {
          this.flowDataFormCarouselVisible = false;
        }
      },
      // 表单提交
      dataFormSubmit (status) {
        this.$refs['flowDataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/${!this.flowDataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.flowDataForm.id || undefined,
                'troubleRdId': this.flowDataForm.troubleRdId,
                'actionDepartment': this.flowDataForm.actionDepartment,
                'actionMan': this.flowDataForm.actionMan,
                'actionTime': this.flowDataForm.actionTime,
                'actionDescription': this.flowDataForm.actionDescription,
                'acceptDepartment': this.flowDataForm.acceptDepartment,
                'acceptMan': this.flowDataForm.acceptMan,
                'createUser': this.flowDataForm.createUser,
                'status': status
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
      },

      reportToLeader () {
        this.reportToLeaderVisible = true;
        var id = this.flowDataForm.id;
        var Rid = this.dataForm.id;
        this.$nextTick(() => {
          this.$refs.report.init(id, Rid);
        })
      },
      reportTo()
      {
        this.reportToVisible = true;
        var id = this.flowDataForm.id;
        var Rid = this.dataForm.id;
        this.$nextTick(() => {
          this.$refs.reportTo.init(id, Rid);
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

  .el-row {
    margin-bottom: 6px;
  }

  .el-row:last-child {
    margin-bottom: 2px;
  }

  .textLeft {
    text-align: left;
  }

  .textBlod {
    font-weight: bold;
    font-size: 1em;
  }

  .textLeft .el-form-item {
    margin-bottom: 10px;
  }

  .content {
    background-color: #f0f1f2;
    height: 80px;
  }

  .img {
    background-color: #f0f1f2;
    height: 200px;
  }

  .img_size {
    width: 100%;
    height: 200px;
  }

</style>
