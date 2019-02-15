<template>
  <div class="mod-config">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="150px" class="tailForm"
             id="login-form-input">
      <h3>企业基本信息:</h3>
      <el-row>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="dataForm.enterpriseName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="成立时间" prop="foundingTime">
            <el-date-picker v-model="dataForm.foundingTime" :disabled="true" type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            id="login-form-input"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="法定代表" prop="legalPerson">
            <el-input v-model="dataForm.legalPerson" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="编码类型" prop="businessLicenseNumber">
            <el-input v-model="dataForm.businessLicenseNumber" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="dataForm.telephone" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="占地面积" prop="conversArea">
            <el-input v-model="dataForm.conversArea" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="注册资本" prop="registeredCapital">
            <el-input v-model="dataForm.registeredCapital" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="总安全费用" prop="totalSafetyCost">
            <el-input v-model="dataForm.totalSafetyCost" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="dataForm.zipCode" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业邮箱" prop="email">
            <el-input v-model="dataForm.email" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="固定资产总值" prop="fixedAssets">
            <el-input v-model="dataForm.fixedAssets" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="许可证号" prop="license">
            <el-input v-model="dataForm.license" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="地图x坐标" prop="mapX">
            <el-input v-model="dataForm.mapX" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="地图y坐标" prop="mapY">
            <el-input v-model="dataForm.mapY" :disabled="true">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="许可证有效 开始日期" prop="licenseStartTime">
            <el-date-picker v-model="dataForm.licenseStartTime" :disabled="true" type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="许可证有效 结束日期" prop="licenseEndTime">
            <el-date-picker v-model="dataForm.licenseEndTime" :disabled="true" type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="经营产品" prop="productScope">
            <el-input type="textarea" v-model="dataForm.productScope" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业地址" prop="address">
            <el-input type="textarea" v-model="dataForm.address" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input type="textarea" v-model="dataForm.businessScope" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="通讯地址" prop="contactAddress">
            <el-input type="textarea" v-model="dataForm.contactAddress" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="剧毒化学描述" prop="toxicDesc">
            <el-input type="textarea" v-model="dataForm.toxicDesc" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="危险工艺描述" prop="dangerousProcessDesc">
            <el-input type="textarea" v-model="dataForm.dangerousProcessDesc" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业规模" prop="firmSize">
            <el-select v-model="dataForm.firmSize">
              <el-option
                v-for="item in firmSizeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业类型" prop="enterpriseType">
            <el-select v-model="dataForm.enterpriseType">
              <el-option
                v-for="item in enterpriseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="是否为重点企业" prop="isPoint">
            <el-select v-model="dataForm.isPoint">
              <el-option
                v-for="item in isPointOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="是否试点企业" prop="isPilot">
            <el-select v-model="dataForm.isPilot">
              <el-option
                v-for="item in isPilotOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="是否使用剧毒化学品" prop="ifuseToxic">
            <el-select v-model="dataForm.ifuseToxic">
              <el-option
                v-for="item in ifuseToxicOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="是否重点危险工艺" prop="ifUseDangerousProcess">
            <el-select v-model="dataForm.ifUseDangerousProcess">
              <el-option
                v-for="item in ifUseDangerousProcessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业状态" prop="status">
            <el-select v-model="dataForm.status">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h3>安全生产基本信息:</h3>
      <el-row :gutter="10">
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="安全生产机构" prop="safetyOrganizationName">
            <el-input v-model="dataForm.safetyOrganizationName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="特种作业人数" prop="specialPersonNumber">
            <el-input-number v-model="dataForm.specialPersonNumber" :disabled="true" controls-position="right" :min="0"
                             label="特种作业人数"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="注册安全工程师" prop="registerPersonNumber">
            <el-input-number v-model="dataForm.registerPersonNumber" :disabled="true" controls-position="right" :min="0"
                             label="注册安全工程师人数"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="专职应急管理" prop="emergencyPersonNumber">
            <el-input-number v-model="dataForm.emergencyPersonNumber" :disabled="true" controls-position="right"
                             :min="0"
                             label="专职应急管理人数"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <h3>监管部门信息:</h3>
      <el-row :gutter="10">
        <el-col :lx="12" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="企业分级" prop="enterpriseLever">
            <el-input-number v-model="dataForm.enterpriseLever" :disabled="true" controls-position="right" :min="0"
                             label="企业分级"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lx="8" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="监管部门" prop="varName3">
            <el-input v-model="dataForm.varName3" :disabled="true" placeholder="监管部门类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lx="8" :lg="12" :md="24" :sm="24" :xs="24">
          <el-form-item label="主管部门" prop="regulatorName">
            <el-input v-model="dataForm.regulatorName" :disabled="true" placeholder="主管部门"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          enterpriseName: '',
          foundingTime: '',
          legalPerson: '',
          businessLicenseNumber: '',
          telephone: '',
          conversArea: '',
          registeredCapital: '',
          totalSafetyCost: '',
          zipCode: '',
          email: '',
          fixedAssets: '',
          license: '',
          mapX: '',
          mapY: '',
          licenseStartTime: '',
          licenseEndTime: '',
          productScope: '',
          address: '',
          businessScope: '',
          contactAddress: '',
          toxicDesc: '',
          dangerousProcessDesc: '',
          firmSize: '',
          enterpriseType: '',
          isPoint: '',
          isPilot: '',
          ifuseToxic: '',
          ifUseDangerousProcess: '',
          status: '',
          safetyOrganizationName: '',
          specialPersonNumber: '',
          registerPersonNumber: '',
          emergencyPersonNumber: '',
          enterpriseLever: '',
          regulatorType: '',
          regulatorName: '',
          varName3: ''
        },
        firmSizeOptions: [{
          value: 1,
          label: '100以下'
        }, {
          value: 2,
          label: '100-1000'
        }, {
          value: 3,
          label: '1000-2000'
        }, {
          value: 4,
          label: '2000-5000'
        }, {
          value: 5,
          label: '5000以上'
        }],
        enterpriseTypeOptions: [{
          value: 0,
          label: '国企'
        }, {
          value: 1,
          label: '民企'
        }, {
          value: 2,
          label: '私企'
        }, {
          value: 3,
          label: '外企'
        }],
        isPointOptions: [{
          value: 0,
          label: '非重点企业'
        }, {
          value: 1,
          label: '重点企业'
        }],
        isPilotOptions: [{
          value: 0,
          label: '非试点企业'
        }, {
          value: 1,
          label: '试点企业'
        }],
        ifuseToxicOptions: [{
          value: 0,
          label: '是'
        }, {
          value: 1,
          label: '否'
        }],
        ifUseDangerousProcessOptions: [{
          value: 0,
          label: '是'
        }, {
          value: 1,
          label: '否'
        }],
        statusOptions: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '关闭'
        }],
        dataRule: {}
      }
    },
    methods: {
      init (id) {
        this.$http({
          url: this.$http.adornUrl('/enterprise/sysEnterpriseDetails/getEnterpriseInfoList'),
          method: 'get',
          params: this.$http.adornParams({eId: id})
        }).then(({data}) => {
          if (data && data.code === 0) {
            for (var x in data.list) {
              this.dataForm.enterpriseName = data.list[x].enterpriseName
              this.dataForm.foundingTime = data.list[x].foundingTime
              this.dataForm.legalPerson = data.list[x].legalPerson
              this.dataForm.businessLicenseNumber = data.list[x].businessLicenseNumber
              this.dataForm.telephone = data.list[x].telephone
              this.dataForm.conversArea = data.list[x].conversArea
              this.dataForm.registeredCapital = data.list[x].registeredCapital
              this.dataForm.totalSafetyCost = data.list[x].totalSafetyCost
              this.dataForm.zipCode = data.list[x].zipCode
              this.dataForm.email = data.list[x].email
              this.dataForm.fixedAssets = data.list[x].fixedAssets
              this.dataForm.license = data.list[x].license
              this.dataForm.mapX = data.list[x].mapX
              this.dataForm.mapY = data.list[x].mapY
              this.dataForm.licenseStartTime = data.list[x].licenseStartTime
              this.dataForm.licenseEndTime = data.list[x].licenseEndTime
              this.dataForm.productScope = data.list[x].productScope
              this.dataForm.address = data.list[x].address
              this.dataForm.businessScope = data.list[x].businessScope
              this.dataForm.contactAddress = data.list[x].contactAddress
              this.dataForm.toxicDesc = data.list[x].toxicDesc
              this.dataForm.dangerousProcessDesc = data.list[x].dangerousProcessDesc
              this.dataForm.firmSize = data.list[x].firmSize
              this.dataForm.enterpriseType = data.list[x].enterpriseType
              this.dataForm.isPoint = data.list[x].isPoint
              this.dataForm.isPilot = data.list[x].isPilot
              this.dataForm.ifuseToxic = data.list[x].ifuseToxic
              this.dataForm.ifUseDangerousProcess = data.list[x].ifUseDangerousProcess
              this.dataForm.status = data.list[x].status
              this.dataForm.safetyOrganizationName = data.list[x].safetyOrganizationName
              this.dataForm.specialPersonNumber = data.list[x].specialPersonNumber
              this.dataForm.registerPersonNumber = data.list[x].registerPersonNumber
              this.dataForm.emergencyPersonNumber = data.list[x].emergencyPersonNumber
              this.dataForm.enterpriseLever = data.list[x].enterpriseLever
              this.dataForm.regulatorType = data.list[x].regulatorType
              this.dataForm.regulatorName = data.list[x].regulatorName
              this.dataForm.varName3 = data.list[x].varName3
            }
          }
        })
      }
    }
  }
</script>

<style>
  #login-form-input input, #login-form-input textarea {
    color: #181718 !important;
  }
</style>
