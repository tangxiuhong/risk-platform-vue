<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="130px">
      <div>
        <!-- 标题部分 -->
        <div class="title"><span>事故隐患整改指令书</span></div>
        <!-- 第一行 -->
        <div class="record_daily_content clear">
          <ul class="clear">
            <!-- 第一行 -->
            <li class="li_2">
              <el-form-item label="隐患编号" prop="troubleNum">
                <el-input v-model="dataForm.troubleNum" placeholder="隐患编号" :disabled="true"></el-input>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="安全检查类型" prop="checkType">
                <span style="color:#047CBB">日常管理</span>
              </el-form-item>
            </li>
            <!-- 第二行 -->
            <li class="li_3">
              <el-form-item label="责任单位" prop="departmentName">
                <el-popover
                  ref="deptListPopover"
                  placement="bottom-start"
                  trigger="click">
                  <el-tree
                    :data="deptList"
                    :props="deptListTreeProps"
                    node-key="id"
                    ref="deptListTree"
                    @current-change="deptListTreeCurrentChangeHandle"
                    :default-expand-all="false"
                    :highlight-current="true"
                    :expand-on-click-node="false">
                  </el-tree>
                </el-popover>
                <el-input v-model="dataForm.departmentName" v-popover:deptListPopover :readonly="true"
                          :disabled="this.dataForm.status==1"
                          placeholder="选择责任单位" class="menu-list__input"></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="责任人" prop="person">
                <el-select v-model="dataForm.person"  filterable :disabled="this.dataForm.status==1">
                  <el-option
                    v-for="item in personList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="" prop="bookNo">
                <div style="float:left;">第</div>
                <div style="float:left;margin:0 10px;width:50%;">
                  <el-input v-model="dataForm.bookNo" placeholder="" :disabled="this.dataForm.status==1"></el-input>
                </div>
                <div sytle="float:left;">号</div>
              </el-form-item>
            </li>
            <!-- 第三行 -->
            <li class="li_1">
              <el-form-item label="" prop="checkTime">
                <span> 在分公司(分公司、工区)</span>
                <el-date-picker
                  v-model="dataForm.checkTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="" :disabled="this.dataForm.status==1">
                </el-date-picker>
                <span>定期(日常)</span>
                <span style="color:#047CBB">日常管理</span>
                <span>中,发现您单位存在以下隐患(问题)：</span>
              </el-form-item>
            </li>
            <!-- 第四行 -->
            <li class="li_1">
              <el-form-item label="" prop="troubleDescription">
                <el-input type="textarea" v-model="dataForm.troubleDescription" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </li>
            <!-- 第五行 -->
            <li class="li_2">
              <el-form-item label="临时控制措施" prop="measure">
                <el-input type="textarea" v-model="dataForm.measure" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="整改要求" prop="memo">
                <el-input type="textarea" v-model="dataForm.memo" style="border-radius:5px;"
                          :disabled="this.dataForm.status==1"></el-input>
              </el-form-item>
            </li>
            <!-- 第六行 -->
            <li class="li_2">
              <el-form-item label="整改期限" prop="timeAffirm">
                <el-date-picker
                  v-model="dataForm.timeAffirm"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="" :disabled="this.dataForm.status==1">
                </el-date-picker>
                <span>之前</span>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="隐患级别" prop="troubleType">
                <el-select v-model="dataForm.troubleType" :disabled="this.dataForm.status==1">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </li>
            <!-- 第七行 -->
            <li class="li_1">
              <el-form-item label="隐患图片" prop="">
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
                  <el-button slot="trigger" size="small" type="primary" :disabled="this.dataForm.status==1">点击上传
                  </el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"
                             :disabled="this.dataForm.status==1">上传到服务器
                  </el-button>
                  <div slot="tip" class="el-upload__tip">只能上传不超过10M大小的文件</div>
                </el-upload>

                <el-carousel :interval="4000" type="card" height="330px" v-if="imgList.length>0"
                             style="border:1px solid #fff">
                  <el-carousel-item v-for="item in imgList" :key="item.name">
                    <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.name }}</h3>
                    <img :src="item.url" alt="picture" style="width:100%;height:80%;">
                  </el-carousel-item>
                </el-carousel>
              </el-form-item>
            </li>
            <!-- 第八行 -->
            <li class="li_3">
              <el-form-item label="检查单位" prop="checkDepartmentName">
                <el-input v-model="dataForm.checkDepartmentName" :disabled="true"></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="检查人" prop="checkManName">
                <el-input v-model="dataForm.checkManName" :disabled="true"></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="填写人" prop="createUserName">
                <el-input v-model="dataForm.createUserName" :disabled="true"></el-input>
              </el-form-item>
            </li>
          </ul>
        </div>

      </div>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit(0)">确定</el-button>
      <el-button type="primary" @click="dataFormSubmit(1)">发起整改</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate, getLocalAddr} from '@/utils'

  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      S: this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
      format = format.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  };
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
          checkType: '',
          troubleNum: '',
          department: '',
          departmentName: '',
          person: '',
          bookNo: '',
          checkTime: '',
          troubleDescription: '',
          measure: '',
          memo: '',
          status: '',
          timeAffirm: '',
          troubleType: '',
          checkDepartment: '',
          checkDepartmentName: '',
          checkMan: '',
          checkManName: '',
          createUser: '',
          createUserName: ''
        },
        dataRule: {
          planNo: [
            {required: true, message: '安全检查任务编号不能为空', trigger: 'blur'}
          ],
          departmentName: [
            {required: true, message: '责任单位不能为空', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '责任人不能为空', trigger: 'blur'}
          ],
          timeAffirm: [
            {required: true, message: '整改期限不能为空', trigger: 'blur'}
          ],
          troubleType: [
            {required: true, message: '隐患级别不能为空', trigger: 'blur'}
          ]
        },
        planNoList: [],
        options1: [{
          value: 1,
          label: '一般隐患'
        }, {
          value: 2,
          label: '重大隐患'
        }],
        personList: [],
        checkManList: [],
        //  企业单位
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    mounted () {
    },
    methods: {
      // 获取隐患流水号
      getTroubleNum (prex) {
        this.$http({
          url: this.$http.adornUrl(
            `/riskAssess/enterpriseRiskAssessResult/listEnterprisePrefix`
          ),
          method: "post",
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            var dt = new Date();
            var no = this.rnd(10, 99);
            this.dataForm.troubleNum = prex + dt.format('yyyyMMddhhmmss');
          }
        });
      },
      rnd (n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        if (!this.dataForm.id) {
          this.getTroubleNum('z')
          // 获取部门及用户
          this.getUserAndDepartment()
        }
        //  部门
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/0`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
        }).then(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.enterpriseTroublerecord.id
                this.dataForm.checkType = data.enterpriseTroublerecord.checkType
                this.dataForm.troubleNum = data.enterpriseTroublerecord.troubleNum
                this.dataForm.department = data.enterpriseTroublerecord.department
                this.dataForm.person = data.enterpriseTroublerecord.person
                this.dataForm.bookNo = data.enterpriseTroublerecord.bookNo
                this.dataForm.checkTime = data.enterpriseTroublerecord.checkTime
                this.dataForm.troubleDescription = data.enterpriseTroublerecord.troubleDescription
                this.dataForm.measure = data.enterpriseTroublerecord.measure
                this.dataForm.memo = data.enterpriseTroublerecord.memo
                this.dataForm.status = data.enterpriseTroublerecord.status
                this.dataForm.timeAffirm = data.enterpriseTroublerecord.timeAffirm
                this.dataForm.troubleType = data.enterpriseTroublerecord.troubleType
                this.dataForm.checkDepartment = data.enterpriseTroublerecord.checkDepartment
                this.dataForm.checkDepartmentName = data.enterpriseTroublerecord.checkDepartmentName
                this.dataForm.checkMan = data.enterpriseTroublerecord.checkMan
                this.dataForm.checkManName = data.enterpriseTroublerecord.checkManName
                this.dataForm.createUser = data.enterpriseTroublerecord.createUser
                this.dataForm.createUserName = data.enterpriseTroublerecord.createUserName
                this.deptListTreeSetCurrentNode()
                this.getPerson(1, this.dataForm.department)
              }
            })
          } else {
            this.dataForm.status = ''
          }
          // 隐患图片上传内容开始
          this.uploadUrl = this.$http.adornUrl(`/trouble/enterpriseTroublerecord/uploadTroubleFile?token=` + this.$cookie.get('token'))
          this.fileList = []
          this.imgList = []
          this.carouselVisible = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/checkLookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                //  放隐患图片列表
                var list1 = data.dataList[0].list1
                var x
                for (x in list1) {
                  var localAddr = getLocalAddr(list1[x].attachmentPath)
                  var f = {name: list1[x].attachmentName, url: localAddr, id: list1[x].id}
                  this.fileList.push(f)
                  var fi = {name: list1[x].attachmentName, url: localAddr}
                  if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(list1[x].attachmentName)) {
                    this.imgList.push(fi)
                  }
                  if (this.imgList.length > 0) {
                    this.carouselVisible = true
                  }
                }
              }
            })
          }
          // 隐患图片上传内容结束
        })
      },
      // 责任单位树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.person = ''
        this.dataForm.department = data.id
        this.dataForm.departmentName = data.name
        this.getPerson(1, this.dataForm.department)
      },
      //  责任单位设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.department)
        this.dataForm.departmentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 获取用户信息
      getUserAndDepartment () {
        this.$http({
          url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/getUserAndDepartment`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.checkMan = data.dataMap.userId
            this.dataForm.checkManName = data.dataMap.userName
            this.dataForm.checkDepartmentName = data.dataMap.departmentName
            this.dataForm.checkDepartment = data.dataMap.department
            this.dataForm.createUser = data.dataMap.userId
            this.dataForm.createUserName = data.dataMap.userName
          }
        })
      },
      //  通过部门id获取用户(type=1 表示责任人 type=2 表示检查人)
      getPerson (type, organizationId) {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/getUserByOrganization/` + organizationId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (type === 1) {
              this.personList = data.dataList
            } else if (type === 2) {
              this.checkManList = data.dataList
            }
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
          url = '/trouble/enterpriseTroublerecord/deleteFileById?id=' + id
        } else {
          url = '/trouble/enterpriseTroublerecord/deleteFileByName/' + fileName
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
        if (this.imgList.length > 0) {
          this.carouselVisible = true
        } else {
          this.carouselVisible = false
        }
      },
      // 表单提交
      dataFormSubmit (status) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'planNo': this.dataForm.planNo,
                'checkType': 5,
                'troubleNum': this.dataForm.troubleNum,
                'department': this.dataForm.department,
                'person': this.dataForm.person,
                'bookNo': this.dataForm.bookNo,
                'checkTime': this.dataForm.checkTime,
                'troubleDescription': this.dataForm.troubleDescription,
                'measure': this.dataForm.measure,
                'memo': this.dataForm.memo,
                'timeAffirm': this.dataForm.timeAffirm,
                'troubleType': this.dataForm.troubleType,
                'checkDepartment': this.dataForm.checkDepartment,
                'checkMan': this.dataForm.checkMan,
                'createUser': this.dataForm.createUser,
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

  .record_daily_content {
    margin-top: 30px;
    width: 100%;
  }

  .record_daily_content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .record_daily_content ul li {
    float: left;
  }

  .record_daily_content .li_1 {
    width: 97%;
  }

  .record_daily_content .li_2 {
    width: 47%;
    margin-right: 3%;
  }

  .record_daily_content .li_3 {
    width: 30.33%;
    margin-right: 3%;
  }

  .record_daily_content .li_4 {
    width: 22%;
    margin-right: 3%;
  }

  .record_daily_content .img_size {
    width: 100%;
    height: 100%;
  }
</style>
