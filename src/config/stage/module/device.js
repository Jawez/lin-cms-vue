const deviceRouter = {
  title: '设备管理',
  icon: 'iconfont icon-demo',
  order: null,

  route: null,
  name: null,
  type: 'folder',
  filePath: 'view/device/',
  inNav: true,

  children: [
    // {
    //   route: null,
    //   name: null,
    //   title: '设备类型',
    //   type: 'folder',
    //   icon: 'iconfont icon-erjituandui',
    //   isElementIcon: false,
    //   filePath: 'view/device/',
    //   inNav: true,
    //   children: [
    //     {
    //       title: '设备类型列表',
    //       name: 'ResourceTypeList',
    //       filePath: 'view/device/resource-type-list.vue',
    //       inNav: true,
    //       icon: 'iconfont icon-table1',
    //       permission: ['更新资源', '删除资源'],
    //     },
    //     {
    //       title: '添加设备类型',
    //       name: 'ResourceTypeEdit',
    //       filePath: 'view/device/resource-type-edit.vue',
    //       inNav: true,
    //       icon: 'iconfont icon-add',
    //       permission: ['添加资源'],
    //     },
    //   ],
    // },
    {
      route: null,
      name: null,
      title: '设备状态',
      type: 'folder',
      icon: 'iconfont icon-erjituandui',
      isElementIcon: false,
      filePath: 'view/device/',
      inNav: true,
      children: [
        {
          title: '状态列表',
          name: 'StateList',
          filePath: 'view/device/state-list.vue',
          inNav: true,
          icon: 'iconfont icon-table1',
          permission: ['更新资源', '删除资源'],
        },
        {
          title: '添加状态',
          name: 'StateEdit',
          filePath: 'view/device/state-edit.vue',
          inNav: true,
          icon: 'iconfont icon-add',
          permission: ['添加资源'],
        },
      ],
    },
    {
      title: '抓包工具列表',
      name: 'AnalyzerList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '测试手机列表',
      name: 'PhoneList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '领用记录',
      name: 'BorrowList',
      inNav: true,
      icon: 'iconfont icon-icon-test',
    },
  ],
}

export default deviceRouter
