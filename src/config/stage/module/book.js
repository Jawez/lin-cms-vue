const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  isElementIcon: false,
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '图书列表',
      // not need in .vue
      // type: 'view',
      name: 'BookList',
      // route: '/book/list',
      // filePath: 'view/book/book-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
      isElementIcon: false,
    },
    {
      title: '添加图书',
      // type: 'view',
      name: 'BookEdit',
      // route: '/book/add',
      // filePath: 'view/book/book.vue',
      inNav: true,
      icon: 'iconfont icon-add',
      isElementIcon: false,
    },
  ],
}

export default bookRouter
