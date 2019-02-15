<template>
  <el-dialog
    :title="''"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body width="50%">
    <h1 style="text-align: center;color:red">警告</h1>
    <div v-html="notice">    
    </div>  
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        notice:''
      }
    },
    
    methods: {
      init (e) {
        this.visible = true;
        this.notice = e;
      }
    }
  }
</script>
<style>

</style>
