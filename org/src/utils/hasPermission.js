import { USER_AUTH, SYS_BUTTON_AUTH } from '@/store/mutation-types'

const hasPermission = {
  install (Vue) {
    Vue.directive('has', {
      inserted: (el, binding, vnode) => {
        // 节点权限处理，如果命中则不进行全局权限处理
        if (!filterNodePermission(el, binding, vnode)) {
          filterGlobalPermission(el, binding, vnode)
        }
      }
    })
  }
}

/**
 * 全局权限控制
 */
export function filterNodePermission (el, binding, vnode) {
  var permissionList = []
  try {
    var obj = vnode.context.$props.formData
    if (obj) {
      let bpmList = obj.permissionList
      for (var bpm of bpmList) {
        permissionList.push(bpm)
      }
    }
  } catch (e) {
  }
  if (permissionList === null || permissionList === '' || permissionList === undefined || permissionList.length <= 0) {
    return false
  }
  let permissions = []
  for (var item of permissionList) {
    permissions.push(item.action)
  }
  if (!permissions.includes(binding.value)) {
    return false
  } else {
    for (var item2 of permissionList) {
      if (binding.value === item2.action) {
        return true
      }
    }
  }
  return false
}

/**
 * 全局权限控制
 */
export function filterGlobalPermission (el, binding, vnode) {

  var permissionList = [];
  var allPermissionList = [];

  // let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || '[]')
  for (var auth of authList) {
    permissionList.push(auth)
  }

  // console.log("页面权限--Global--",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || '[]')
  for (var gauth of allAuthList) {
    allPermissionList.push(gauth)
  }
  // 设置全局配置是否有命中
  var invalidFlag = false //无效命中
  if (allPermissionList != null && allPermissionList != '' && allPermissionList != undefined && allPermissionList.length > 0) {
    for (var itemG of allPermissionList) {
      if (binding.value === itemG.action) {
        if (itemG.status == '0') {
          invalidFlag = true
          break
        }
      }
    }
  }
  if (invalidFlag) {
    return
  }
  if (permissionList === null || permissionList === '' || permissionList === undefined || permissionList.length <= 0) {
    el.parentNode.removeChild(el)
    return
  }
  let permissions = []
  for (var item of permissionList) {
    permissions.push(item.action)
  }
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el)
  }
}

export default hasPermission
