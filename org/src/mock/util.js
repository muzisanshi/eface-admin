export const responseSuccess = (data = {}, headers = {}) => {
  const responseData = {
    respCode: '00',
    respDesc: '成功',
    errCode: null,
    errDesc: null,
    data: null
  }
  responseData.data = data
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseData._headers = headers
  }
  return responseData
}

export const responseFail = (errCode, errDesc = {}) => {
  return {
    respCode: '-1',
    respDesc: '失败',
    errCode: errCode,
    errDesc: errDesc
  }
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options ? (options.body && JSON.parse(options.body)) : {}
}
