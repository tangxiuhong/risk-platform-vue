/**
 * 测试环境
 */
;(function () {
  window.SITE_CONFIG = {}

  if (window.location.host.indexOf("219.138.224.53") < 0) {
    window.SITE_CONFIG['baseUrl'] = 'http://172.16.5.84:8285/RiskPlatform'
    window.SITE_CONFIG['wsUrl'] = 'ws://172.16.5.84:8285/RiskPlatform'
    // 各系统地址
    // 风险计算系统
    window.SITE_CONFIG['riskCalculation'] = 'http://172.16.5.84:8281/RiskCalculation'
    // 数据汇集系统
    window.SITE_CONFIG['riskCollect'] = 'http:/172.16.5.84:8283/RiskCollect'
    // XBRL上报系统
    window.SITE_CONFIG['xbrl'] = 'http://172.16.5.84:8080/ins'
  } else {
    window.SITE_CONFIG['baseUrl'] = 'http://172.16.5.84:8285/RiskPlatform'
    window.SITE_CONFIG['wsUrl'] = 'ws://172.16.5.84:8285/RiskPlatform'
    // 各系统地址
    // 风险计算系统
    window.SITE_CONFIG['riskCalculation'] = 'http://172.16.5.84:8281/RiskCalculation'
    // 数据汇集系统
    window.SITE_CONFIG['riskCollect'] = 'http://172.16.5.84:8283/RiskCollect'
    // XBRL上报系统
    window.SITE_CONFIG['xbrl'] = 'http://172.16.5.84:8080/ins'
  }

  console.log(window.SITE_CONFIG['baseUrl'])
  console.log(window.SITE_CONFIG['wsUrl'])
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './'// 域名
  window.SITE_CONFIG['version'] = ''  // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
