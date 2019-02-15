/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://172.16.5.83:8285/RiskPlatform'
  // window.SITE_CONFIG['baseUrl'] = 'http://58.19.205.222:8283/RiskPlatform'

  // ws 接口请求地址
  window.SITE_CONFIG['wsUrl'] = 'ws://172.16.5.83:8285/RiskPlatform'
  // window.SITE_CONFIG['baseUrl'] = 'ws://58.19.205.222:8283/RiskPlatform'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version

  // 各系统地址
  // 风险计算系统
  window.SITE_CONFIG['riskCalculation'] = 'http://58.19.205.222:8281/RiskCalculation'
  // 数据汇集系统
  window.SITE_CONFIG['riskCollect'] = 'http://58.19.205.222:8282/RiskCollect'
  // xbrl系统
  window.SITE_CONFIG['xbrl'] = 'http://172.16.5.84:8080/ins'
})()
