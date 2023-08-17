import stageConfig from '@/config/stage' // 引入舞台配置
import Utils from '@/lin/util/util'

const homeRouter = []

/**
 * 构造舞台view路由
 */
Utils.deepTravel(stageConfig, viewConfig => {
  const viewRouter = {}
  viewRouter.path = viewConfig.route
  viewRouter.name = viewConfig.name
  viewRouter.component = () => import(`@/${viewConfig.filePath}`)
  viewRouter.meta = {
    title: viewConfig.title,
    icon: viewConfig.icon,
    permission: viewConfig.permission,
    type: viewConfig.type,
    blueBaseColor: viewConfig.blueBaseColor ? 'viewConfig.blueBaseColor' : '',
  }
  homeRouter.push(viewRouter)
})

export default homeRouter
