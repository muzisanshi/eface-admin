/**
 * @name fileters/index.js
 * @author lw
 * @date 2019.11.4
 * @desc 过滤器（时间，数据截取等过滤器）
 */
const statusMap = {
  'true': {
    status: 'success',
    text: '是'
  },
  'false': {
    status: 'default',
    text: '否'
  }
}

const statusFilter = function (type) {
  return statusMap[type].text
}

const statusTypeFilter = function (type) {
  return statusMap[type].status
}

const resourceFullAddressFilter = function (record) {
  return record.resourceFullAddress
}

const tImageResourceAddressFilter = function (record) {
  return record.tImageResourceAddress
}

const faceFullAddressFilter = function (record) {
  return record.faceFullAddress
}

const frameAttResourceAddressFilter = function (record) {
  return record.frameAttResourceAddress
}

const rootAttResourceAddressFilter = function (record) {
  return record.rootAttResourceAddress
}

export {
  statusFilter,
  statusTypeFilter,
  resourceFullAddressFilter,
  faceFullAddressFilter,
  frameAttResourceAddressFilter,
  rootAttResourceAddressFilter,
  tImageResourceAddressFilter
}