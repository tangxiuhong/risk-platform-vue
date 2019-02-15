<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="dataForm.name" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="dataForm.loginName" placeholder="登录名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">不正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否过期" size="mini" prop="expired">
        <el-radio-group v-model="dataForm.expired">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否领导" size="mini" prop="isLeader">
        <el-radio-group v-model="dataForm.isLeader">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户类别" prop="userType">
        <el-radio-group v-model="dataForm.userType" @change="changeUserTypeHandler">
          <el-radio v-for="(userType, index) in dataForm.typeList" :label="index" :key="index">{{ userType }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.userType === 1" label="所属企业" prop="singleEnterpriseName">
        <el-popover
          ref="singleEnterpriseListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="singleEnterpriseList"
            :props="singleEnterpriseListTreeProps"
            node-key="id"
            ref="singleEnterpriseListTree"
            @current-change="singleEnterpriseListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.singleEnterpriseName" v-popover:singleEnterpriseListPopover :readonly="true"
                  placeholder="点击选择所属企业" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.userType === 1" label="所属部门" prop="organizationName">
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
        <el-input v-model="dataForm.organizationName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属部门"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.userType === 1" label="所属职务" prop="jobName">
        <el-popover
          ref="jobListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="jobList"
            :props="jobListTreeProps"
            node-key="id"
            ref="jobListTree"
            @current-change="jobListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.jobName" v-popover:jobListPopover :readonly="true" placeholder="点击选择所属职务"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item size="mini" v-if="dataForm.userType === 2" label="企业授权">
        <el-tree
          :data="unitList"
          :props="unitListTreeProps"
          node-key="id"
          ref="unitListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: '',
          name: '',
          loginName: '',
          password: '',
          comfirmPassword: '',
          sex: 0,
          age: '',
          email: '',
          phone: '',
          roleIdList: [],
          status: 0,
          userType: 1,
          typeList: ['超级用户', '企业用户', '监管用户'],
          expired: 0,
          isLeader: 0,
          organizationId: '',
          organizationName: '',
          singleEnterpriseName: '',
          userJob: '',
          jobName: ''
        },
        dataRule: {
          name: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          loginName: [
            {required: true, message: '登录名不能为空', trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          comfirmPassword: [
            {validator: validateComfirmPassword, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ]
        },
        // 监管用户企业授权
        unitList: [],
        unitListTreeProps: {
          label: 'name',
          children: 'children'
        },
        // 企业用户绑定企业
        singleEnterpriseList: [],
        singleEnterpriseListTreeProps: {
          label: 'name',
          children: 'children'
        },
        // 企业用户绑定企业部门
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        // 企业用户绑定企业职务
        jobList: [],
        jobListTreeProps: {
          label: 'name',
          children: 'children'
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id, userType) {
        this.dataForm.id = id || 0
        this.dataForm.userType = userType || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            // 监管用户企业授权
            if (this.dataForm.userType === 2) {
              this.visible = true
              this.$http({
                url: this.$http.adornUrl('/enterprise/sysEnterprise/select'),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                this.unitList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
              }).then(() => {
                this.visible = true
                this.$nextTick(() => {
                  this.$refs.unitListTree.setCheckedKeys([])
                })
              })
            }
          }).then(() => {
            this.visible = true
            // 企业用户绑定企业
            this.$http({
              url: this.$http.adornUrl('/enterprise/sysEnterprise/select'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.singleEnterpriseList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
            })
          }).then(() => {
            // 企业用户绑定部门
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/0`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
            })
          }).then(() => {
            // 企业用户绑定职务
            this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseJob/select/0`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.jobList = treeDataTranslate(data.jobList, 'id', 'pId')
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.name = data.user.name
                  this.dataForm.loginName = data.user.loginName
                  this.dataForm.sex = data.user.sex
                  this.dataForm.age = data.user.age
                  this.dataForm.email = data.user.email
                  this.dataForm.phone = data.user.phone
                  this.dataForm.status = data.user.status
                  this.dataForm.userType = data.user.userType
                  this.dataForm.expired = data.user.expired
                  this.dataForm.roleIdList = data.user.roleIdList
                  this.dataForm.organizationId = data.user.organizationId
                  this.dataForm.organizationName = data.user.organizationName
                  this.dataForm.enterpriseId = data.user.enterpriseId
                  this.dataForm.isLeader = data.user.isLeader
                  this.dataForm.userJob = data.user.userJob
                  if (this.dataForm.userType === 2) {
                    var idx = data.user.enterpriseIdList.indexOf(this.tempKey)
                    if (idx !== -1) {
                      data.user.enterpriseIdList.splice(idx, data.user.enterpriseIdList.length - idx)
                    }
                    this.$refs.unitListTree.setCheckedKeys(data.user.enterpriseIdList)
                  }
                  if (this.dataForm.userType === 1) {
                    this.singleEnterpriseListTreeSetCurrentNode()
                    this.deptListTreeSetCurrentNode()
                    this.jobListTreeSetCurrentNode()
                  }
                }
              })
            }
          })
        })
      },
      // 企业用户企业树选中
      singleEnterpriseListTreeCurrentChangeHandle (data, node) {
        this.dataForm.enterpriseId = data.id
        this.dataForm.singleEnterpriseName = data.name
        // 联动企业部门
        this.chageDeptList(this.dataForm.enterpriseId)
        // 联动企业职务
        this.chageJobList(this.dataForm.enterpriseId)
      },
      // 企业用户企业树设置当前选中节点
      singleEnterpriseListTreeSetCurrentNode () {
        this.$refs.singleEnterpriseListTree.setCurrentKey(this.dataForm.enterpriseId)
        this.dataForm.singleEnterpriseName = (this.$refs.singleEnterpriseListTree.getCurrentNode() || {})['name']
      },
      // 企业用户企业部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.organizationId = data.id
        this.dataForm.organizationName = data.name

       this.$http({
              url: this.$http.adornUrl(`/enterprise/enterpriseJob/selectExt/`+data.id),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.jobList = treeDataTranslate(data.jobList, 'id', 'pId')
            })

      },
      // 企业用户企业部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.organizationId)
        this.dataForm.organizationName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 企业用户企业职务树选中
      jobListTreeCurrentChangeHandle(data, node) {
        this.dataForm.userJob = data.id
        this.dataForm.jobName = data.name
      },
      // 企业用户企业职务树设置当前选中节点
      jobListTreeSetCurrentNode() {
        this.$refs.jobListTree.setCurrentKey(this.dataForm.userJob)
        this.dataForm.jobName = (this.$refs.jobListTree.getCurrentNode() || {})['name']
      },
      // 用户类型改变事件
      changeUserTypeHandler (value) {
        if (value === 2) {
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.unitList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'loginName': this.dataForm.loginName,
                'sex': this.dataForm.sex,
                'age': this.dataForm.age,
                'password': this.dataForm.password,
                'email': this.dataForm.email,
                'phone': this.dataForm.phone,
                'status': this.dataForm.status,
                'userType': this.dataForm.userType,
                'expired': this.dataForm.expired,
                'roleIdList': this.dataForm.roleIdList,
                'organizationId': this.dataForm.organizationId,
                'enterpriseId': this.dataForm.enterpriseId,
                'isLeader': this.dataForm.isLeader,
                'userJob': this.dataForm.userJob,
                'enterpriseIdList': this.dataForm.userType === 2 ? [].concat(this.$refs.unitListTree.getCheckedKeys()) : []
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
      chageDeptList (enterpriseId) {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseDepartment/select/${enterpriseId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'id', 'pId')
        })
      },
      chageJobList(enterpriseId) {
        this.$http({
          url: this.$http.adornUrl(`/enterprise/enterpriseJob/select/${enterpriseId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.jobList = treeDataTranslate(data.jobList, 'id', 'pId')
        })
      }
    }
  }
</script>
