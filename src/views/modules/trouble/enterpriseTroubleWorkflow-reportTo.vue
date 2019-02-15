<template>
  <el-dialog
    :title="!dataForm.id ? '隐患整改指令转发' : '隐患整改指令转发'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">

      <el-form-item label="转发情况说明" prop="reportDescription">
        <el-input type="textarea" v-model="dataForm.reportDescription"></el-input>
      </el-form-item>
      <el-form-item label="接受单位" prop="actionDepartment">
        <el-select v-model="dataForm.actionDepartmentName" clearable filterable placeholder="请选择接受单位" @change=departmentChange>
          <el-option
            v-for="item in actionDepartmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="actionMan">
        <el-select v-model="dataForm.actionManName" clearable filterable placeholder="请选择责任人" @change=manChange>
          <el-option
            v-for="item in actionManList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
          troubleRdId: '',
          id: '',
          reportDescription: '',
          actionDepartment: '',
          actionDepartmentName: '',
          actionMan: '',
          actionManName: ''

        },
        actionDepartmentList: [],
        actionManList: [],
        dataRule: {
          
          actionDepartment: [
            {required: true, message: '上报单位不能为空', trigger: 'blur'}
          ],
          actionMan: [
            {required: true, message: '责任人不能为空', trigger: 'blur'}
          ]
        }
      }
    },

    activated () {

    },

    methods: {
      init (id, Rid) {
        this.dataForm.troubleRdId = Rid;
        this.dataForm.id = id;
        this.visible = true;

        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.initDepartmentList();
        })
      },

      initDepartmentList () {
        this.actionDepartmentList = []
        this.$http({
          url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/listDepartments'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0 && data.list) {
            this.actionDepartmentList = data.list;
          }
        })
      },
      departmentChange (eventId) {
        this.dataForm.actionDepartment = eventId;
        this.initManList();
      },
      initManList () {
        this.actionManList = [];
        if (this.dataForm.actionDepartment && this.dataForm.actionDepartment != '') {
          var orgId = this.dataForm.actionDepartment;
          this.$http({
            url: this.$http.adornUrl('/trouble/enterpriseTroublerecord/listUsersByDepartment/' + orgId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0 && data.list) {
              this.actionManList = data.list;
            }
          })
        }
      },

      manChange (eventId) {
        this.dataForm.actionMan = eventId;
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/trouble/enterpriseTroubleWorkflow/reportToLeader`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'troubleRdId': this.dataForm.troubleRdId,
                'reportDescription': this.dataForm.reportDescription,
                'actionDepartment': this.dataForm.actionDepartment,
                'actionMan': this.dataForm.actionMan
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

</style>
