import Utils from '@/lin/util/util'
import pluginsConfig from './plugin'
import { underscore, dasherize } from 'inflection'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '关于',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'view/about/about.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    isElementIcon: false,
    order: -1,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'view/log/log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    isElementIcon: false,
    order: -2,
    permission: ['查询所有日志'],
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
    isElementIcon: false,
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
    isElementIcon: false,
  },
]

const res = require.context('@/config/stage/module/', false, /\/.*\.js$/, 'sync')    // require.context must use literal
console.log(res.keys())
res.keys().reduce((router, path) => {
  // console.log(modules, res.resolve(path), path)
  const value = res(path).default
  router.push(value)
  return router
}, homeRouter)

Utils.deepTravel(homeRouter, (viewConfig, parentConfig) => {
  const name = viewConfig.name.description || viewConfig.name
  const match = /(\w+)(List|Edit)/.exec(name)
  // console.log(name, match)
  if (match) {
    if (!viewConfig.filePath) {
      let directory = underscore(match[1])
      if (parentConfig.type === 'folder') {
        const path = /view\/(.*)\//.exec(parentConfig.filePath)
        if (path && path[1]) {
          directory = path[1]
        }
        // console.log(path)
      }
      // console.log(directory)
      viewConfig.filePath = `view/${directory}/${dasherize(underscore(match[0]))}.vue`
    }
    if (!viewConfig.route) {
      viewConfig.route = `/${underscore(match[1])}/${underscore(match[2])}`
    }
    if (!viewConfig.type) {
      viewConfig.type = "view"
    }
    // console.log(viewConfig)
  }
})

// 接入插件
const plugins = [...pluginsConfig]
filterPlugin(homeRouter)
homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)
deepReduceName(homeRouter)

export default homeRouter

/**
 * 筛除已经被添加的插件
 */
function filterPlugin(data) {
  if (plugins.length === 0) {
    return
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1)
    }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

/**
 * 使用 Symbol 处理 name 字段, 保证唯一性
 */
function deepReduceName(target) {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      target.name = target.name || Utils.getRandomStr()
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}
