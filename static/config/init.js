/**
 * 动态加载初始资源
 */
;(function() {
  var resList = {
    icon: window.SITE_CONFIG.cdnUrl + '/static/img/favicon.ico',
    css: [
      window.SITE_CONFIG.cdnUrl + '/static/css/app.css',
    ],
    js: [
      // 插件, 放置业务之前加载, 以免业务需求依赖插件时, 还未加载出错
      // 插件 - echarts
      window.SITE_CONFIG.cdnUrl + '/static/plugins/echarts-3.8.5/echarts.min.js',
      // 插件 - ueditor
      window.SITE_CONFIG.cdnUrl + '/static/plugins/ueditor-1.4.3.3/ueditor.config.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/ueditor-1.4.3.3/ueditor.all.min.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/ueditor-1.4.3.3/lang/zh-cn/zh-cn.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/tiandimap/tianditu.js?key=61e67337cdcae05aca0f2cb0623c1982',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/video/webVideoCtrl.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/video/jquery.3.3.1.min.js',
      // 业务
      window.SITE_CONFIG.cdnUrl + '/static/js/manifest.js',
      window.SITE_CONFIG.cdnUrl + '/static/js/vendor.js',
      window.SITE_CONFIG.cdnUrl + '/static/js/app.js',
      window.SITE_CONFIG.domain + '/config/index.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/mock-1.0.0-beta3/mock-min.js'
    ]
  };

  // 图标
  (function () {
    var _icon = document.createElement('link');
    _icon.setAttribute('rel', 'shortcut icon');
    _icon.setAttribute('type', 'image/x-icon');
    _icon.setAttribute('href', resList.icon);
    document.getElementsByTagName('head')[0].appendChild(_icon);
  })();

  // 样式
  (function () {
    document.getElementsByTagName('html')[0].style.opacity = 0;
    var i = 0;
    var _style = null;
    var createStyles = function () {
      if (i >= resList.css.length) {
        document.getElementsByTagName('html')[0].style.opacity = 1;
        return;
      }
      _style = document.createElement('link');
      _style.href = resList.css[i];
      _style.setAttribute('rel', 'stylesheet');
      _style.onload = function () {
        i++;
        createStyles();
      }
      document.getElementsByTagName('head')[0].appendChild(_style);
    }
    createStyles();
  })();

  // 脚本
  document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
      var i = 0;
      var _script = null;
      var createScripts = function () {
        if (i >= resList.js.length) {
          return;
        }
        _script = document.createElement('script');
        _script.src = resList.js[i];
        _script.onload = function () {
          i++;
          createScripts();
        }
        document.getElementsByTagName('body')[0].appendChild(_script);
      }
      createScripts();
    }
  };
})();
