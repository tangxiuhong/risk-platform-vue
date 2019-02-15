<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属企业" prop="enterpriseName">
        <el-popover
          ref="enterpriseListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="enterpriseList"
            :props="enterpriseListTreeProps"
            node-key="id"
            ref="enterpriseListTree"
            @current-change="enterpriseListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.enterpriseName" v-popover:enterpriseListPopover :readonly="true"
                  placeholder="点击选择所属企业" class="menu-list__input"></el-input>
      </el-form-item>
    <el-form-item label="摄像头名称" prop="cameraName">
      <el-input v-model="dataForm.cameraName" placeholder="摄像头名称"></el-input>
    </el-form-item>
    <el-form-item label="rtsp流地址" prop="rtspPath">
      <el-input v-model="dataForm.rtspPath" placeholder="rtsp流地址"></el-input>
    </el-form-item>
    <el-form-item label="rtmp流地址" prop="rtmpPath">
      <el-input v-model="dataForm.rtmpPath" placeholder="rtmp流地址"></el-input>
    </el-form-item>
      <el-form-item label="http地址" prop="httpPath">
        <el-input v-model="dataForm.httpPath" placeholder="http流地址"></el-input>
      </el-form-item>
    <el-form-item label="异常图片路径" prop="dispFileUrl">
      <el-input v-model="dataForm.dispFileUrl" placeholder="异常图片路径"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="dataForm.status">
        <el-radio :label="0">正常</el-radio>
        <el-radio :label="1">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          enterpriseId: '',
          cameraName: '',
          rtspPath: '',
          rtmpPath: '',
          httpPath: '',
          dispFileUrl: '',
          status: 0,
          enterpriseIdList: [],
          enterpriseName: ''
        },
        enterpriseList: [],
        enterpriseListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataRule: {
          enterpriseId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          cameraName: [
            { required: true, message: '摄像头名称不能为空', trigger: 'blur' }
          ],
          rtspPath: [
            { required: true, message: 'rtsp流地址不能为空', trigger: 'blur' }
          ],
          rtmpPath: [
            { required: true, message: 'rtmp流地址不能为空', trigger: 'blur' }
          ],
          httpPath: [
            { required: true, message: 'http地址不能为空', trigger: 'blur' }
          ],
          dispFileUrl: [
            { required: false, message: '异常图片路径不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
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
          this.$http({
            url: this.$http.adornUrl('/enterprise/sysEnterprise/selectByEnterpriseIds'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.enterpriseList = treeDataTranslate(data.enterpriseList, 'id', 'pId')
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/ai/aiConfig/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.enterpriseId = data.aiConfig.enterpriseId
                  this.dataForm.cameraName = data.aiConfig.cameraName
                  this.dataForm.rtspPath = data.aiConfig.rtspPath
                  this.dataForm.rtmpPath = data.aiConfig.rtmpPath
                  this.dataForm.httpPath = data.aiConfig.httpPath
                  this.dataForm.dispFileUrl = data.aiConfig.dispFileUrl
                  this.dataForm.status = data.aiConfig.status
                  this.enterpriseListTreeSetCurrentNode()
                }
              })
            }
          })
        })
      },
      // 企业树选中
      enterpriseListTreeCurrentChangeHandle (data, node) {
        this.dataForm.enterpriseId = data.id
        this.dataForm.enterpriseName = data.name
      },
      // 企业树设置当前选中节点
      enterpriseListTreeSetCurrentNode () {
        this.$refs.enterpriseListTree.setCurrentKey(this.dataForm.enterpriseId)
        this.dataForm.enterpriseName = (this.$refs.enterpriseListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ai/aiConfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'enterpriseId': this.dataForm.enterpriseId,
                'cameraName': this.dataForm.cameraName,
                'rtspPath': this.dataForm.rtspPath,
                'rtmpPath': this.dataForm.rtmpPath,
                'dispFileUrl': this.dataForm.dispFileUrl,
                'status': this.dataForm.status
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
