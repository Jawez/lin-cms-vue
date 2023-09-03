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
  ],
}

export default deviceRouter
