<template>
  <el-dialog
    :title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible" width="70%">
    <div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select v-model="dataForm.fileTime" placeholder="文件时间" filterable clearable>
            <el-option
              v-for="item in fileTimeOptions"
              :key="item.createTime"
              :label="item.createTime"
              :value="item.createTime">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="attachmentPath"
          header-align="center"
          align="center"
          width="150"
          label="异常图片">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <img :src="scope.row.attachmentPath" width="100%" alt=""/>
              <div slot="reference" >
                <img :src="scope.row.attachmentPath" style="width:50px;height:50px;"/>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="attachmentName"
          header-align="center"
          align="center"
          label="异常时间">
          <template slot-scope="scope">
            <span v-text="scope.row.attachmentName.substring(0,8)"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        fileTimeOptions: [],
        dataForm: {
          id: '',
          fileTime: '',
          recordId: ''
        }
      }
    },
    components: {
    },
    methods: {
      // 查询所有文件时间
      getFileTime () {
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/rtspView/getFileTime'),
          method: 'get',
          params: this.$http.adornParams({
            'recordId': this.dataForm.recordId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.fileTimeList.length > 0) {
              this.dataForm.fileTime = data.fileTimeList[0].createTime
              this.fileTimeOptions = data.fileTimeList
            }
            this.getDataList()
          }
        })
      },
      init (recordId) {
        this.dataForm.recordId = recordId
        this.visible = true
        this.getFileTime()
      },
      // 数据
      getDataList () {
        this.dataListLoading = true
        // 查询数据
        this.$http({
          url: this.$http.adornUrl('/infoDisplay/rtspView/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'fileTime': this.dataForm.fileTime,
            'recordId': this.dataForm.recordId,
            'state': '2'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
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
