export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

// 生成首页路由

export function generateIndexRouter (data) {
  let indexRouter = [{
    path: '/',
    name: 'index',
    component: resolve => require(['@/layouts/BasicLayout'], resolve),
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      ...generateChildRouters(data)
    ]
  }]
  return indexRouter
}

// 生成嵌套路由（子路由）

function generateChildRouters (data) {
  const routers = []
  for (var item of data) {
    let componentItem = ''
    if (item.component.indexOf('layouts') >= 0) {
      componentItem = item.component
    } else {
      componentItem = 'views/' + item.component
    }

    let menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: resolve => require(['@/' + componentItem + '.vue'], resolve),
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList,
        keepAlive: item.meta.keepAlive,
        internalOrExternal: item.meta.internalOrExternal
      }
    }
    if (item.alwaysShow) {
      menu.alwaysShow = true
      menu.redirect = menu.path
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }
    // --update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    // 判断是否生成路由
    if (item.route && item.route === '0') {
      // console.log(' 不生成路由 item.route：  '+item.route);
      // console.log(' 不生成路由 item.path：  '+item.path);
    } else {
      routers.push(menu)
    }
    // --update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
  }
  return routers
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
