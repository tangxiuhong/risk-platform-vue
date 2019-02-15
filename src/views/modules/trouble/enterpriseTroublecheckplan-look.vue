<template>
  <el-dialog
    :title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
             <div class="title"><span>检查任务信息</span></div>
             <hr align=center width="95%" color=#987cb9 SIZE=1>
      <el-row>
        <el-col :span="10">
          <el-form-item label="安全检查编号" prop="planNo">
            <el-input v-model="dataForm.planNo" placeholder="安全检查编号" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">  
          <el-form-item label="安全检查时间" prop="planTime">
          <el-date-picker v-model="dataForm.planTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="安全检查时间" :readonly="true"></el-date-picker>
        </el-form-item>
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="20">  
        <el-form-item label="安全检查类型" prop="checkType">
          <span :readonly="true">{{dataForm.checkType==1 ? '安全综合检查': dataForm.checkType==2 ? '专业安全检查': dataForm.checkType==3 ? '专项安全检查': dataForm.checkType==4 ? '日常检查': '' }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">  
        <el-form-item label="安全检查方案列表" prop="implementList">
          <ul class="file_ul">
            <li v-for="(item,index) of dataForm.implementList" :key="index" :content="item" :index="index" @click="openFile(item)">{{item.attachmentName}}</li>
          </ul>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">     
        <el-form-item label="安全检查表列表" prop="inspectList">
          <ul class="file_ul">
            <li v-for="(item,index) of dataForm.inspectList" :key="index" :content="item" :index="index" @click="openFile(item)">{{item.attachmentName}}</li>
          </ul>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10"> 
        <el-form-item label="发布人" prop="createUser">
          <el-input v-model="dataForm.createUser" placeholder="发布人" :readonly="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10"> 
        <el-form-item label="创建日期" prop="createTime">
          <el-date-picker v-model="dataForm.planTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="创建日期" :readonly="true"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查人员">
          <el-input type="textarea" v-model="dataForm.checkUsers" :readonly="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <hr align=center width="95%" color=#987cb9 SIZE=1>
    <div class="title"><span>安全检查结果</span></div>
    <el-row>
      <el-col :span="20">
        <el-form-item label="安全检查结果" prop="checkResult">
          <el-input v-model="dataForm.checkResult" placeholder="安全检查结果" :readonly="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">     
        <el-form-item label="安全检查结果" prop="resultList">
          <ul class="file_ul">
            <li v-for="(item,index) of dataForm.resultList" :key="index" :content="item" :index="index" @click="openFile(item)">{{item.attachmentName}}</li>
          </ul>
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
  export default {
    data () {
      return {
        detailVisible: false,
        visible: false,
        dataForm: {
          id: '',
          planId: '',
          planTime: '',
          checkType: '',
          createUser: '',
          implementList: [],
          inspectList: [],
          checkUsers: '',
          checkResult:'',
          resultList:[]
        }
      }
    },
    components: {},
    methods: {
      init (id) {
        this.visible = true
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublecheckplan/info/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.id = data.enterpriseTroublecheckplan.id
            this.dataForm.planNo = data.enterpriseTroublecheckplan.planNo
            this.dataForm.planTime = data.enterpriseTroublecheckplan.planTime
            this.dataForm.checkType = data.enterpriseTroublecheckplan.checkType
            this.dataForm.createUser = data.enterpriseTroublecheckplan.createUser
            this.dataForm.implementList = data.enterpriseTroublecheckplan.implementList
            this.dataForm.inspectList = data.enterpriseTroublecheckplan.inspectList
            this.dataForm.checkUsers = data.enterpriseTroublecheckplan.checkUsers
            this.dataForm.checkResult = data.enterpriseTroublecheckplan.checkResult
            this.dataForm.resultList = data.enterpriseTroublecheckplan.resultList
          }
        })
      },
      openFile (item) {
        window.open(item.attachmentPath)
      }
    }
  }
</script>
<style>
  .file_ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .file_ul li {
    cursor: pointer;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
