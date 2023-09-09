const enterpriseRouter = {
  route: null,
  name: null,
  title: '企业管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  isElementIcon: false,
  filePath: 'view/enterprise/',
  order: -4,
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [
    {
      route: null,
      name: null,
      title: '组织管理',
      type: 'folder', // 取 route 为默认加载页
      icon: 'iconfont icon-huiyuanguanli',
      isElementIcon: false,
      filePath: 'view/enterprise/',
      inNav: true,
      children: [
        {
          title: '组织列表',
          name: 'OrganizationList',
          inNav: true,
          icon: 'iconfont icon-huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          title: '添加组织',
          name: 'OrganizationEdit',
          inNav: true,
          icon: 'iconfont icon-add',
          permission: ['超级管理员独有权限'],
        },
      ],
    },
  ],
}

export default enterpriseRouter
