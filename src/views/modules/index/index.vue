<template>
  <div>
    <div class="indexImg"><img src="../../../../static/img/index.jpg" alt=""></div>
    <div class="indexBox">
      <h2>程潮矿业有限公司：</h2>
      <p>
        程潮矿业公司位于三国吴王古都——鄂州，是鄂东地区查明保有铁矿资源量最大的矿山，矿石储量1.4亿吨，具有乐观的资源、区位优势和竞争潜力。
      </p>
      <p>
        程潮铁矿1958年兴建，1969年投产，2015年在鄂州市注册成立程潮矿业公司，隶属中国宝武武钢资源集团公司。历经60年发展，程潮矿业公司具备采、掘、选、球、运一条龙式的设计、生产和加工的综合配套能力，并有较为完善的供电、供水、交通、通信以及生活、文化教育、医疗卫生等基础设施。
      </p>
      <p>
        程潮矿业公司下设采矿、选矿、球团、检修、物流、生产服务、后勤服务等7个分公司和9个管理职能部门，现有在岗职工1717人（另含内部退养及居家休息等914人），平均年龄45岁，高、中、初级职称的各类专业技术人员300余人，在岗注册安全工程师14人，全国、省市、公司劳模39人。
      </p>
      <p>
        程潮矿业公司高度重视安全生产，深入宣贯落实宝武安全管理体系，严格执行宝武安全管理规范，践行宝武安全价值观，按照“一条主线，四项要点”的要求，抓好各项工作的落实。公司被评为国家安全标准化一级企业、全国安全文化建设示范企业、全国“十佳厂矿”、湖北省“首届十佳安全生产示范企业”、湖北省安全生产“红旗单位”。
      </p>
      <h2>双重预防信息管理平台：</h2>
      <p>
        是以数字信息技术为依托，通过引入数据模型、物联网应用和大数据分析等技术，实现风险分级管控、隐患排查治理、风险源监测预警和应急管理等功能。它运用物联网技术,采集风险管理、隐患排查和监测监控的数据；它基于规则引擎，对各类信息和数据进行运算处理，及时预警预报，把风险分级管控挺在隐患前面，把隐患排查治理挺在事故前面，构建双重预防机制，遏制企业重特大事故的发生。
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    created () {
      this.$store.commit('common/updateIndexRouter', true)
    },
    destroyed () {
      this.$store.commit('common/updateIndexRouter', false)
    },
    methods: {

    }
  }
</script>

<style scoped>

  .indexImg img {
    width: 100%;
    height: auto;
  }

  .indexBox {
    margin-top: 5px;
    overflow: hidden;
  }

  .indexBox h2 {
    margin-top: 15px;
  }

  .indexBox p {
    text-indent: 2em;
    font-size: 16px;
    line-height: 1.8em;
    -webkit-margin-before: 0.5em;
    -webkit-margin-after: 0.5em;
  }

  @media screen and (min-width: 1367px) {
    .indexBox p {
      font-size: 18px;
    }
  }
</style>
