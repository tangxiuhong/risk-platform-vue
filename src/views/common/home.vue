<template>
  <index-into></index-into>
</template>

<script>
  import indexInto from '../modules/index/index'

  export default {
    data () {
      return {}
    },
    components: {
      indexInto
    },
    methods: {}
  }
</script>

<style scoped>

  .mesStyle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 300px;
  }

  .mesinto {
    background: #eee;
    padding: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .mesinto .mesTitle {
    font-weight: bold;
    margin: 5px 0 10px !important;
    color: #000;
  }

  .mesinto1 {
    animation: mymes 1s;
    -moz-animation: mymes 1s; /* Firefox */
    -webkit-animation: mymes 1s; /* Safari and Chrome */
    -o-animation: mymes 1s; /* Opera */
  }

  @keyframes mymes {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-moz-keyframes mymes /* Firefox */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-webkit-keyframes mymes /* Safari and Chrome */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  @-o-keyframes mymes /* Opera */
  {
    0% {
      right: -500px;
      bottom: 20px;
    }
    100% {
      right: 20px;
      bottom: 20px;
    }
  }

  .mesinto2 {
    animation: mymes2 1s forwards;
    -moz-animation: mymes2 1s forwards; /* Firefox */
    -webkit-animation: mymes2 1s forwards; /* Safari and Chrome */
    -o-animation: mymes2 1s forwards; /* Opera */
  }

  @keyframes mymes2 {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-moz-keyframes mymes2 /* Firefox */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-webkit-keyframes mymes2 /* Safari and Chrome */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  @-o-keyframes mymes2 /* Opera */
  {
    0% {
      right: 20px;
      bottom: 20px;
    }
    100% {
      right: -500px;
      bottom: 20px;
    }
  }

  #mesPosit p.el-alert__description {
    line-height: 2em !important;
  }
</style>
