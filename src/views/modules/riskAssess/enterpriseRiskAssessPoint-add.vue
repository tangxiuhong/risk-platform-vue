<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="50%">
      <el-row>
       <!-- <el-col :span="10">
         <el-form-item label="风险评估编号" prop="unitId">
            <el-select v-model="dataForm.unitId" placeholder="评估编号" @change=assessNoChg>
              <el-option
                v-for="item in assessNoList"
                :key="item.id"
                :label="item.assessNo"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="10">
          <el-form-item label="编号" prop="doId">
            <el-input-number v-model="dataForm.doId" controls-position="right" :min="0"
                             label="编号"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险单元" prop="unitId">
            <el-select v-model="dataForm.unitId"  placeholder="风险单元">
              <el-option
                v-for="item in riskUnitList"
                :key="item.id"
                :label="item.riskUnit"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="风险点" prop="riskPoint">
            <el-input v-model="dataForm.riskPoint" placeholder="风险点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="风险点评估结果值" prop="assessValue">
            <el-input-number v-model="dataForm.assessValue" controls-position="right" :min="0"
                             label="风险点评估结果值"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="评估等级" prop="staticLevel">
            <el-select v-model="dataForm.staticLevel" placeholder="评估等级">
              <el-option
                v-for="item in assessLeveloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="受控状态" prop="status">
            <el-select v-model="dataForm.status" placeholder="受控状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.valueStatus"
                :label="item.labelStatus"
                :value="item.valueStatus">
              </el-option>
            </el-select>
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
  export default {
    data() {
      return {
        visible: false,
        assessNoList: [],
        riskUnitList: [],
        dataForm: {
          id: 0,
          unitId: '',
          doId: '',
          riskPoint: '',
          assessValue: '',
          assessLevel: '',
          dynamicLevel:'',
          staticLevel:'',
          listPerson: '',
          listDate: '',
          assessPerson: '',
          assessDate: '',
          status: 1,
          updateStatusTime: '',
          createTime: '',
          updateTime: '',
          createUser: '',
          updateUser: ''
        },
        assessLeveloptions: [{
          value: 1,
          label: '一级'
        }, {
          value: 2,
          label: '二级'
        }, {
          value: 3,
          label: '三级'
        }, {
          value: 4,
          label: '四级'
        }],
        statusOptions: [{
          valueStatus: 1,
          labelStatus: '受控'
        }, {
          valueStatus: 2,
          labelStatus: '未受控'
        }],
        dataRule: {
          unitId: [
            {required: true, message: '风险单元不能为空', trigger: 'blur'}
          ],
          staticLevel:[
            {required: true, message: '风险等级不能为空', trigger: 'blur'}
          ],
          riskPoint: [
            {required: true, message: '风险点不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                for (var x in data.list) {
                  this.dataForm.unitId = data.list[x].unitId
                  this.dataForm.doId = data.list[x].doId
                  this.dataForm.riskPoint = data.list[x].riskPoint
                  this.dataForm.assessValue = data.list[x].assessValue
                  this.dataForm.assessLevel = data.list[x].assessLevel
                  this.dataForm.staticLevel = data.list[x].staticLevel
                  this.dataForm.listPerson = data.list[x].listPerson
                  this.dataForm.listDate = data.list[x].listDate
                  this.dataForm.assessPerson = data.list[x].assessPerson
                  this.dataForm.assessDate = data.list[x].assessDate
                  this.dataForm.status = data.list[x].status
                  this.dataForm.updateStatusTime = data.list[x].updateStatusTime
                  this.initRiskUnitList()
                }
              }
            })
          } else {
            this.initRiskUnitList()
          }
        })
      },
      initRiskUnitList() {
        this.$http({
          url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/listRiskUnit`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.riskUnitList = data.list
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/riskAssess/enterpriseRiskAssessPoint/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'unitId': this.dataForm.unitId,
                'doId': this.dataForm.doId,
                'riskPoint': this.dataForm.riskPoint,
                'assessValue': this.dataForm.assessValue,
                'assessLevel': this.dataForm.assessLevel,
                'staticLevel':this.dataForm.staticLevel,
                'dynamicLevel':this.dataForm.dynamicLevel,
                'listPerson': this.dataForm.listPerson,
                'listDate': this.dataForm.listDate,
                'assessPerson': this.dataForm.assessPerson,
                'assessDate': this.dataForm.assessDate,
                'status': this.dataForm.status,
                'updateStatusTime': this.dataForm.updateStatusTime,
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
