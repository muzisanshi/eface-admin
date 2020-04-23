import { USER_AUTH, SYS_BUTTON_AUTH } from '@/store/mutation-types'

export function disabledAuthFilter(code, formData) {
  if (nodeDisabledAuth(code, formData)) {
    return true
  } else {
    return globalDisabledAuth(code)
  }
}

function nodeDisabledAuth(code, formData) {
  var permissionList = []
  try {
    var obj = formData
    if (obj) {
      const bpmList = obj.permissionList
      for (var bpm of bpmList) {
        permissionList.push(bpm)
      }
    }
  } catch (e) {
  }
  if (permissionList === null || permissionList === '' || permissionList === undefined || permissionList.length <= 0) {
    return false
  }
  const permissions = []
  for (var item of permissionList) {
    permissions.push(item.action)
  }
  if (!permissions.includes(code)) {
    return false
  } else {
    for (var item2 of permissionList) {
      if (code === item2.action) {
        return true
      }
    }
  }
  return false
}

function globalDisabledAuth(code) {
  var permissionList = []
  var allPermissionList = []

  const authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || '[]')

  for (var auth of authList) {
    permissionList.push(auth)
  }

  const allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || '[]')
  for (var gauth of allAuthList) {
    allPermissionList.push(gauth)
  }
  // 设置全局配置是否有命中
  var gFlag = false// 禁用命中
  var invalidFlag = false// 无效命中
  if (allPermissionList != null && allPermissionList != '' && allPermissionList != undefined && allPermissionList.length > 0) {
    for (var itemG of allPermissionList) {
      if (code === itemG.action) {
        if (itemG.status == '0') {
          invalidFlag = true
          break
        } else {
          gFlag = true
          break
        }
      }
    }
  }
  if (invalidFlag) {
    return false
  }
  if (permissionList === null || permissionList === '' || permissionList === undefined || permissionList.length <= 0) {
    return gFlag
  }
  const permissions = []
  for (var item of permissionList) {
    permissions.push(item.action)
  }
  if (!permissions.includes(code)) {
    return gFlag
  } else {
    for (var item2 of permissionList) {
      if (code === item2.action) {
        gFlag = false
      }
    }
    return gFlag
  }
}
