<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px" disabled>
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="dataForm.enterpriseName" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业前缀" prop="prefix">
        <el-input v-model="dataForm.prefix" placeholder="请输入4位数字或字母组合"></el-input>
      </el-form-item>
      <el-form-item label="所属行业" prop="industryName">
        <el-select v-model="dataForm.industryCode" placeholder="请选择" @change=industryChange>
          <el-option
            v-for="item in industryList"
            :key="item.id"
            :label="item.varName"
            :value="item.id">
            <span style="float: left">{{ item.varName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属区域" prop="areaName">
        <el-select v-model="dataForm.areaCode" placeholder="请选择">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.varName"
            :value="item.id">
            <span style="float: left">{{ item.varName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="风险模型" prop="riskModel">
        <el-select v-model="dataForm.riskModel" multiple placeholder="请选择">
          <el-option
            v-for="item in riskModelList"
            :key="item.id"
            :label="item.varName"
            :value="item.id">
            <span style="float: left">{{ item.varName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="负责人姓名" prop="mainPerson">
        <el-input v-model="dataForm.mainPerson" placeholder="企业负责人姓名"></el-input>
      </el-form-item>
      <el-form-item label="移动电话" prop="mainPersonMobile">
        <el-input v-model="dataForm.mainPersonMobile" placeholder="企业负责人移动电话号码"></el-input>
      </el-form-item>
      <el-form-item label="固定电话" prop="mainPersonTelephone">
        <el-input v-model="dataForm.mainPersonTelephone" placeholder="企业负责人固定电话号码"></el-input>
      </el-form-item>
      <el-form-item label="安全负责人姓名" prop="safePerson">
        <el-input v-model="dataForm.safePerson" placeholder="企业安全负责人姓名"></el-input>
      </el-form-item>
      <el-form-item label="移动电话" prop="safePersonMobile">
        <el-input v-model="dataForm.safePersonMobile" placeholder="企业安全负责人移动电话号码"></el-input>
      </el-form-item>
      <el-form-item label="固定电话" prop="safePersonTelephone">
        <el-input v-model="dataForm.safePersonTelephone" placeholder="企业安全负责人固定电话号码"></el-input>
      </el-form-item>
      <el-form-item label="企业编号" prop="code">
        <el-input v-model="dataForm.code" placeholder="企业编号(采集系统企业ID)"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="是否传输" size="mini" prop="isTrans">
        <el-radio-group v-model="dataForm.isTrans">
          <el-radio :label="0">传输</el-radio>
          <el-radio :label="1">不传输</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否同步" size="mini" prop="isSync">
        <el-radio-group v-model="dataForm.isSync">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据来源" size="mini" prop="source">
        <el-radio-group v-model="dataForm.source">
          <el-radio :label="0">两化</el-radio>
          <el-radio :label="1">平台</el-radio>
        </el-radio-group>
      </el-form-item>
      -->
    </el-form>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import {isPhone, isMobile} from '@/utils/validate'

  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('固定电话格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          prefix: '',
          enterpriseId: '',
          enterpriseName: '',

          industryCode: '',
          industryName: '',

          areaCode: '',
          areaName: '',

          mainPerson: '',
          mainPersonMobile: '',
          mainPersonTelephone: '',
          safePerson: '',
          safePersonMobile: '',
          safePersonTelephone: '',

          riskModel: [],
          riskModelName: '',

          code: '',
          isTrans: '',
          isSync: 0,
          status: 0,
          source: 0,
          parameter1: '',
          parameter2: '',
          parameter3: '',
          parameter4: ''
        },

        dataRule: {
          prefix: [
            {required: true, message: '企业id前缀不能为空', trigger: 'blur'},
            {max: 4, message: '长度不超过4个字符', trigger: 'blur'}
          ],
          enterpriseId: [
            {required: true, message: '企业id不能为空', trigger: 'blur'}
          ],
          enterpriseName: [
            {required: true, message: '企业名称不能为空', trigger: 'blur'}
          ],
          industryCode: [
            {required: true, message: '所属行业不能为空', trigger: 'blur'}
          ],
          areaCode: [
            {required: true, message: '所属区域不能为空', trigger: 'blur'}
          ],
          mainPerson: [
            {required: true, message: '企业负责人姓名不能为空', trigger: 'blur'}
          ],
          mainPersonMobile: [
            {required: true, message: '企业负责人移动电话号码不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          mainPersonTelephone: [
            {required: true, message: '企业负责人固定电话号码不能为空', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ],
          safePerson: [
            {required: true, message: '企业安全负责人姓名不能为空', trigger: 'blur'}
          ],
          safePersonMobile: [
            {required: true, message: '企业安全负责人移动电话号码不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          safePersonTelephone: [
            {required: true, message: '企业安全负责人固定电话号码不能为空', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ]
        },
        industryList: [],
        areaList: [],
        riskModelList: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (!this.dataForm.id) {
            this.initIndustryList();
            this.initAreaList();
            this.initRiskModelList();
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysEnterprise/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.prefix = data.sysEnterprise.prefix
                this.dataForm.enterpriseId = data.sysEnterprise.enterpriseId
                this.dataForm.enterpriseName = data.sysEnterprise.enterpriseName
                this.dataForm.industryCode = data.sysEnterprise.industryCode
                this.dataForm.areaCode = data.sysEnterprise.areaCode
                this.dataForm.mainPerson = data.sysEnterprise.mainPerson
                this.dataForm.mainPersonMobile = data.sysEnterprise.mainPersonMobile
                this.dataForm.mainPersonTelephone = data.sysEnterprise.mainPersonTelephone
                this.dataForm.safePerson = data.sysEnterprise.safePerson
                this.dataForm.safePersonMobile = data.sysEnterprise.safePersonMobile
                this.dataForm.safePersonTelephone = data.sysEnterprise.safePersonTelephone
                if (data.sysEnterprise.riskModel) {
                  var r = data.sysEnterprise.riskModel.split(',');
                  this.dataForm.riskModel = r;
                } else {
                  this.dataForm.riskModel = [];
                }


                this.dataForm.code = data.sysEnterprise.code
                this.dataForm.isTrans = data.sysEnterprise.isTrans
                this.dataForm.isSync = data.sysEnterprise.isSync
                this.dataForm.status = data.sysEnterprise.status
                this.dataForm.source = data.sysEnterprise.source
                this.dataForm.parameter1 = data.sysEnterprise.parameter1
                this.dataForm.parameter2 = data.sysEnterprise.parameter2
                this.dataForm.parameter3 = data.sysEnterprise.parameter3
                this.dataForm.parameter4 = data.sysEnterprise.parameter4

                this.initIndustryList();
                this.initAreaList();
                this.initRiskModelList();
              }
            })
          }
        })
      },

      initIndustryList () {
        this.industryList = [];
        var id = null;
        var pId = 9;//所有行业

        this.$http({
          url: this.$http.adornUrl('/sys/dic/selectDicList'),
          method: 'get',
          params: this.$http.adornParams({'pId': pId, 'id': id})
        }).then(({data}) => {
          this.industryList = data.list;
        })
      },

      initAreaList () {
        this.areaList = [];
        var id = null;
        var pId = 16;//所有区域

        this.$http({
          url: this.$http.adornUrl('/sys/dic/selectDicList'),
          method: 'get',
          params: this.$http.adornParams({'pId': pId, 'id': id})
        }).then(({data}) => {
          this.areaList = data.list;
        })
      },

      initRiskModelList () {
        this.riskModelList = [];

        if (this.dataForm.industryCode) {
          var pId = this.dataForm.industryCode;
          this.$http({
            url: this.$http.adornUrl('/sys/dic/selectDicList'),
            method: 'get',
            params: this.$http.adornParams({'pId': pId})
          }).then(({data}) => {
            this.riskModelList = data.list;

          })
        }
      },

      industryChange (eventId) {
        this.dataForm.riskModel = [];
        this.initRiskModelList();
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/enterprise/sysEnterprise/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'prefix': this.dataForm.prefix,
                'enterpriseId': this.dataForm.enterpriseId,
                'enterpriseName': this.dataForm.enterpriseName,
                'industryCode': this.dataForm.industryCode,
                'areaCode': this.dataForm.areaCode,
                'mainPerson': this.dataForm.mainPerson,
                'mainPersonMobile': this.dataForm.mainPersonMobile,
                'mainPersonTelephone': this.dataForm.mainPersonTelephone,
                'safePerson': this.dataForm.safePerson,
                'safePersonMobile': this.dataForm.safePersonMobile,
                'safePersonTelephone': this.dataForm.safePersonTelephone,
                'riskModel': this.dataForm.riskModel.join(','),
                'code': this.dataForm.code,
                'isTrans': this.dataForm.isTrans,
                'isSync': this.dataForm.isSync,
                'parameter1': this.dataForm.parameter1,
                'parameter2': this.dataForm.parameter2,
                'parameter3': this.dataForm.parameter3,
                'parameter4': this.dataForm.parameter4
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
