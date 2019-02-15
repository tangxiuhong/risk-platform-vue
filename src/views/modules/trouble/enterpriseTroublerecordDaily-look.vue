<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="110px">
      <div>
        <!-- 标题部分 -->
        <div class="title"><span>事故隐患整改指令书</span></div>
        <!-- 第一行 -->
        <div class="record_daily_look_content clear">
          <ul class="clear">
            <!-- 第一行 -->
            <li class="li_2">
              <el-form-item label="隐患编号：" prop="troubleNum">
                <el-input v-model="dataForm.troubleNum" placeholder=""></el-input>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="安全检查类型：" prop="checkType">
                <span>自主管理</span>
              </el-form-item>
            </li>
            <!-- 第二行 -->
            <li class="li_3">
              <el-form-item label="责任单位：" prop="department">
                <el-input v-model="dataForm.department" placeholder=""></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="责任人：" prop="person">
                <el-input v-model="dataForm.person" placeholder=""></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="" prop="bookNo">
                <div style="float:left;">第</div>
                <div style="float:left;margin:0 10px;width:50%;">
                  <el-input v-model="dataForm.bookNo" placeholder=""></el-input>
                </div>
                <div sytle="float:left;">号</div>
              </el-form-item>
            </li>
            <!-- 第三行 -->
            <li class="li_1">
              <el-form-item label="" prop="checkTime">
                <span> 在分公司(分公司、工区)</span>
                <span v-text="dataForm.checkTime"></span>
                <span>定期(日常)</span>
                <span style="color:#047CBB">日常管理</span>
                <span>中,发现您单位存在以下隐患(问题)：</span>
              </el-form-item>
            </li>
            <!-- 第四行 -->
            <li class="li_1">
              <el-form-item label="" prop="troubleDescription">
                <el-input type="textarea" v-model="dataForm.troubleDescription"></el-input>
              </el-form-item>
            </li>
            <!-- 第五行 -->
            <li class="li_2">
              <el-form-item label="临时控制措施：" prop="measure">
                <el-input type="textarea" v-model="dataForm.measure"></el-input>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="整改要求：" prop="memo">
                <el-input type="textarea" v-model="dataForm.memo"></el-input>
              </el-form-item>
            </li>
            <!-- 第六行 -->
            <li class="li_2">
              <el-form-item label="期限：" prop="timeAffirm">
                <span v-text="dataForm.timeAffirm"></span>
                <span>之前</span>
              </el-form-item>
            </li>
            <li class="li_2">
              <el-form-item label="隐患级别：" prop="troubleType">
                <span :disabled="true">{{dataForm.troubleType==1 ? '一般隐患': '重大隐患'}}</span>
              </el-form-item>
            </li>
            <!-- 第七行 -->
            <li class="li_1">
              <el-form-item label="图片列表：" prop="imgList">
                <el-carousel :interval="3000" type="card" height="330px" v-if="imgList.length>0">
                  <el-carousel-item v-for="(item,key) in imgList" :key="item.id">
                    <!-- 图片 -->
                    <h3 style="background-color: #CCCCCC;margin:0px;">{{ item.attachmentName }}</h3>
                    <img :src="item.attachmentPath" alt="picture" style="width:100%;height:80%;">
                  </el-carousel-item>

                </el-carousel>
              </el-form-item>
            </li>
            <!-- 第八行 -->
            <li class="li_3">
              <el-form-item label="检查单位：" prop="checkDepartment">
                <el-input v-model="dataForm.checkDepartment"></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="检查人：" prop="checkMan">
                <el-input v-model="dataForm.checkMan"></el-input>
              </el-form-item>
            </li>
            <li class="li_3">
              <el-form-item label="填写人：" prop="createUser">
                <el-input v-model="dataForm.createUser"></el-input>
              </el-form-item>
            </li>
          </ul>
        </div>

      </div>
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
          timeAffirm: '',
          troubleType: '',
          checkDepartment: '',
          checkDepartmentName: '',
          checkMan: '',
          createUser: ''
        },
        imgList: [],
        dataRule: {
          troublePosition: [
            {required: true, message: '隐患位置、隐患点不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroublerecord/lookInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.dataMap.dataList[0].id
                this.dataForm.checkType = data.dataMap.dataList[0].checkType
                this.dataForm.troubleNum = data.dataMap.dataList[0].troubleNum
                this.dataForm.department = data.dataMap.dataList[0].department
                this.dataForm.person = data.dataMap.dataList[0].person
                this.dataForm.bookNo = data.dataMap.dataList[0].bookNo
                this.dataForm.checkTime = data.dataMap.dataList[0].checkTime
                this.dataForm.troubleDescription = data.dataMap.dataList[0].troubleDescription
                this.dataForm.measure = data.dataMap.dataList[0].measure
                this.dataForm.memo = data.dataMap.dataList[0].memo
                this.dataForm.timeAffirm = data.dataMap.dataList[0].timeAffirm
                this.dataForm.troubleType = data.dataMap.dataList[0].troubleType
                this.dataForm.checkDepartment = data.dataMap.dataList[0].checkDepartment
                this.dataForm.checkMan = data.dataMap.dataList[0].checkMan
                this.dataForm.createUser = data.dataMap.dataList[0].createUser
                // this.imgList = data.dataMap.imgList
                this.imgList = []
                for (var x in data.dataMap.imgList) {
                  var a = {}
                  a.attachmentName = data.dataMap.imgList[x].attachmentName
                  a.attachmentPath = getLocalAddr(data.dataMap.imgList[x].attachmentPath)
                  this.imgList.push(a)
                }
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

  .record_daily_look_content {
    margin-top: 30px;
    width: 100%;
  }

  .record_daily_look_content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .record_daily_look_content ul li {
    float: left;
  }

  .record_daily_look_content .el-input__inner {
    border: 0px solid #ffffff;
  }

  .record_daily_look_content .li_1 {
    width: 97%;
  }

  .record_daily_look_content .li_2 {
    width: 47%;
    margin-right: 3%;
  }

  .record_daily_look_content .li_3 {
    width: 30.33%;
    margin-right: 3%;
  }

  .record_daily_look_content .li_4 {
    width: 22%;
    margin-right: 3%;
  }

  .record_daily_look_content .img_size {
    width: 100%;
    height: 100%;
  }
</style>
