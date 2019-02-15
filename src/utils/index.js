// import Vue from 'vue'
// import router from '@/router'
// import store from '@/store'
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
/**
 * 如果是内外访问，附件（图片）的访问地址改为：192.168.49.100 限正式环境
 */
export function getLocalAddr(url)
{
  console.log(process.env.NODE_ENV);
  if(process.env.NODE_ENV==='production' && window.location.host.indexOf("219.138.224.53")<0)
  {
    return url.replace("219.138.224.53","192.168.49.100");
  }else{
    return url;
  }

}
/**
 * 清除登录信息
 */
// export function clearLoginInfo () {
//     Vue.cookie.delete('token')
//     store.commit('resetStore')
//     router.options.isAddDynamicMenuRoutes = false
// }
