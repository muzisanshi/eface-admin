import Mock from 'mockjs2'

if (process.env.NODE_ENV === 'development') {
  // 使用同步加载依赖
  // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
  require('./services/auth')
  require('./services/user')
  require('./services/manage')

  Mock.setup({
    timeout: 800 // setter delay time
  })
}
