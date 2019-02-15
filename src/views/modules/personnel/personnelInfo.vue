<template>
  <div class="mod-config">
    <el-tabs style="height:60px;" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="井下人员每小时报表文件数据" name="first"></el-tab-pane>
      <el-tab-pane label="超时报警文件数据" name="second"></el-tab-pane>
      <el-tab-pane label="系统工作异常文件数据" name="third"></el-tab-pane>
      <el-tab-pane label="超员进入限制区域报警文件数据" name="four"></el-tab-pane>
      <el-tab-pane label="特定人员工作异常文件数据" name="five"></el-tab-pane>
      <el-tab-pane label="初始化参数" name="six"></el-tab-pane>
    </el-tabs>

    <first ref="first" v-show="showfirst"></first>
    <second ref="second" v-show="showsecond"></second>
    <third ref="third" v-show="showthird"></third>
    <four ref="four" v-show="showfour"></four>
    <five ref="five" v-show="showfive"></five>
    <six ref="six" v-show="showsix"></six>

  </div>
</template>

<script>
  import first from './personnelRysb'
  import second from './personnelRysc'
  import third from './personnelRyyc'
  import four from './personnelRycy'
  import five from './personnelRytz'
  import six from './personnelRycs'

  export default {
    data () {
      return {
        activeName: 'first',
        enterpriseId: '',
        enterpriseName: '',
        first: 'first',
        second: 'second',
        third: 'third',
        four: 'four',
        five: 'five',
        six: 'six',
        showfirst: true,
        showsecond: false,
        showthird: false,
        showfour: false,
        showfive: false,
        showsix: false
      }
    },
    mounted () {
      this.init()
    },
    components: {
      first,
      second,
      third,
      four,
      five,
      six
    },
    methods: {
      init () {
        this.showfirst = true
        this.showsecond = false
        this.showthird = false
        this.showfour = false
        this.showfive = false
        this.showsix = false
      },
      handleClick (tab, event) {
        if (tab.name === 'first') {
          this.showfirst = true
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.$nextTick(() => {
            this.$refs.first.getDataList()
          })
        } else if (tab.name === 'second') {
          this.showfirst = false
          this.showsecond = true
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.$nextTick(() => {
            this.$refs.second.getDataList()
          })
        } else if (tab.name === 'third') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = true
          this.showfour = false
          this.showfive = false
          this.showsix = false
          this.$nextTick(() => {
            this.$refs.third.getDataList()
          })
        } else if (tab.name === 'four') {

          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = true
          this.showfive = false
          this.showsix = false
          this.$nextTick(() => {
            this.$refs.four.getDataList()
          })

        } else if (tab.name === 'five') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = true
          this.showsix = false
          this.$nextTick(() => {
            this.$refs.five.getDataList()
          })
        } else if (tab.name === 'six') {
          this.showfirst = false
          this.showsecond = false
          this.showthird = false
          this.showfour = false
          this.showfive = false
          this.showsix = true
          this.$nextTick(() => {
            this.$refs.six.getDataList()
          })
        }
      }
    }
  }
</script>
