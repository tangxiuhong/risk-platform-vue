<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="20%">
      <el-form-item label="评估编号" prop="assessNo">
        <el-input v-model="dataForm.assessNo" :disabled="true" placeholder="评估编号"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="memo">
        <el-input v-model="dataForm.memo" placeholder="说明"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>


  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          eId: "",
          assessNo: "",
          assessValue: "",
          assessLevel: "",
          assessPerson: "",
          memo: "",
          createTime: "",
          updateTime: "",
          createUser: "",
          updateUser: ""
        },
        dataRule: {
          assessNo: [
            {required: true, message: "评估编号不能为空", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(
                `/riskAssess/enterpriseRiskAssessResult/info/${this.dataForm.id}`
              ),
              method: "get",
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eId = data.enterpriseRiskAssessResult.eId;
                this.dataForm.assessNo = data.enterpriseRiskAssessResult.assessNo;
                this.dataForm.assessValue = data.enterpriseRiskAssessResult.assessValue;
                this.dataForm.assessLevel = data.enterpriseRiskAssessResult.assessLevel;
                this.dataForm.assessPerson = data.enterpriseRiskAssessResult.assessPerson;
                this.dataForm.memo = data.enterpriseRiskAssessResult.memo;
                this.dataForm.createTime = data.enterpriseRiskAssessResult.createTime;
                this.dataForm.updateTime = data.enterpriseRiskAssessResult.updateTime;
                this.dataForm.createUser = data.enterpriseRiskAssessResult.createUser;
                this.dataForm.updateUser = data.enterpriseRiskAssessResult.updateUser;
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `/riskAssess/enterpriseRiskAssessResult/${
                  !this.dataForm.id ? "save" : "update"
                  }`
              ),
              method: "post",
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                eId: this.dataForm.eId,
                assessNo: this.dataForm.assessNo,
                assessValue: this.dataForm.assessValue,
                assessLevel: this.dataForm.assessLevel,
                assessPerson: this.dataForm.assessPerson,
                memo: this.dataForm.memo,
                createTime: this.dataForm.createTime,
                updateTime: this.dataForm.updateTime,
                createUser: this.dataForm.createUser,
                updateUser: this.dataForm.updateUser
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
    }
  };
</script>
