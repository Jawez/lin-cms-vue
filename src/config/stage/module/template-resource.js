const TemplateResourceRouter = {
  title: 'template-name管理',
  icon: 'iconfont icon-erjituandui',
  order: null,
  // permission: ['template-name权限'],

  route: null,
  name: null,
  type: 'folder',
  filePath: 'view/template-dir/',
  inNav: true,

  children: [
    {
      title: 'template-name列表',
      name: 'TemplateResourceList',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '添加template-name',
      name: 'TemplateResourceEdit',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

// export default TemplateResourceRouter
