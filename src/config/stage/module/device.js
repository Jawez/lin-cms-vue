const deviceRouter = {
  title: '设备管理',
  icon: 'iconfont icon-erjituandui',
  order: null,
  // permission: ['超级管理员独有权限'],

  route: null,
  name: null,
  type: 'folder',
  filePath: 'view/device/',
  inNav: true,

  children: [
    {
      title: '设备类型列表',
      name: 'ResourceTypeList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '添加设备类型',
      name: 'ResourceTypeEdit',
      inNav: true,
      icon: 'iconfont icon-add',
    },
    {
      title: '状态列表',
      name: 'StateList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '添加状态',
      name: 'StateEdit',
      inNav: true,
      icon: 'iconfont icon-add',
    },
    {
      title: '抓包工具列表',
      name: 'AnalyzerList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '添加抓包工具',
      name: 'AnalyzerEdit',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default deviceRouter
