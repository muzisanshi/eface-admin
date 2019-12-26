# 后台管理前端框架使用说明

## 项目下载和运行

- 拉取项目代码
```bash
git clone git@gitlab.com:ld-github/cloud-platform-shop-v2.front.git
cd cloud-platform-shop-v2.front
git pull
git checkout dev
```

- 进入admin模块目录
```bash
cd admin
```

- 安装依赖
```
npm install
```

- 本地开发模式运行
```
npm run serve
```

- 编译测试环境项目
```
mpm run build:preview
```

- 编译生产环境项目
```
mpm run build
```

## 各环境接口地址的配置文件

/.env 生产环境

/.env.development 本地开发环境

/.env.preview 测试环境

### 配置文件说明

```
// 当前环境
NODE_ENV=development

// 接口baseUrl
ADMIN_SERVICE_BASE_URL=http://192.168.101.119:25000/adminService
```

建议只修改ADMIN_SERVICE_BASE_URL的值。

## API接口的使用

### API接口的定义

API接口定义在统一的配置文件：/src/api/index.js

在此定义的URL，以/mock/开头时，将启用本地模拟数据。

### API接口的调用

1、 首先，需要引入调用的接口方法

```
import { getCountryPage, deleteCountry } from '@/api'
```

2、 然后调用，在调用失败或异常时，会自动进行提示

```
deleteCountry({ ids: ['1','2'] })
  .then(res => {
    console.log(res)
  })
```

也可以自己增加catch和finally块

```
deleteCountry({ ids: ['1','2'] })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
  })
```

### 本地模拟数据

启用本地模拟数据，可以在后端接口未准备好时提前进行数据模拟，待后端接口准备好后再进行接口对接，对接时去掉URL前面的/mock。

在文件/src/mock/index.js中配置了当运行环境为mock时启用模拟数据，并配置了加载的服务文件。

在加载的服务文件中，定义监听的请求接口地址，请求方式和返回的数据即可，请参考/src/mock/services/manage.js的配置。

在/src/mock/util.js中提供了responseSuccess和responseFail两个方法，以返回与API接口一致的结果，可在服务配置文件中调用，调用时注意引入：

```
import { responseSuccess, getBody } from '../util'
```

### 路由配置

路由配置在文件/src/config/router.config.js中，目前是写死的，注意name属性必须唯一，后面会改为从后端获取菜单权限后显示菜单（使用name属性进行匹配）。

### 页面参考

页面文件放在/src/views下，参考/src/views/setting/country，列表、新增、修改为单独的文件。

## 更多

基于Ant Design Pro Vue

github： https://github.com/sendya/ant-design-pro-vue

文档：https://vue.ant.design/docs/vue/introduce-cn/
