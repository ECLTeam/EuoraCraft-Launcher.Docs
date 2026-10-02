import type { ThemeSidebarMulti } from 'vuepress-theme-plume'

const sidebar: ThemeSidebarMulti = {
  '/guide/': [
    //{ text: '使用', link: '/guide/introduction/', icon: 'material-symbols:menu-book-outline' },
    {
      text: '快速开始',
      icon: 'material-symbols:rocket-launch-outline',
      collapsed: false,
      items: [
        { text: '介绍', link: '/guide/introduction/', icon: 'material-symbols:info-outline' },
      ],
    },
    {
      text: '政策与协议',
      icon: 'material-symbols:gavel-outline',
      collapsed: false,
      items: [
        { text: '用户协议', link: '/guide/user-agreement/', icon: 'material-symbols:description-outline' },
      ],
    },
  ],
  '/development/': [
    { text: '开发', link: '/development/', icon: 'material-symbols:code' },
    {
      text: '开始开发',
      icon: 'material-symbols:terminal',
      collapsed: false,
      items: [
        { text: '搭建开发环境', link: '/development/setup/environment/', icon: 'material-symbols:settings-outline' },
        { text: '从源码构建', link: '/development/setup/build-from-source/', icon: 'material-symbols:build-outline' },
      ],
    },
  ],
  '/tutorials/': [
    { text: '技术教程', link: '/tutorials/', icon: 'material-symbols:school-outline' },
    {
      text: 'Minecraft 启动器原理',
      icon: 'material-symbols:videogame-asset-outline',
      collapsed: false,
      items: [
        { text: '介绍', link: '/tutorials/minecraft-launcher/', icon: 'material-symbols:info-outline' },
        { text: '版本清单文件', link: '/tutorials/minecraft-launcher/fundamentals/version-manifest/', icon: 'material-symbols:account-tree-outline' },
        { text: '构建启动指令', link: '/tutorials/minecraft-launcher/fundamentals/launch-command/', icon: 'material-symbols:terminal' },
      ],
    },
    {
      text: 'EasyTier-PyO3 教程',
      icon: 'material-symbols:hub-outline',
      collapsed: false,
      items: [
        { text: '介绍', link: '/tutorials/easytier-pyo3/', icon: 'material-symbols:info-outline' },
        { text: '节点配置详解', link: '/tutorials/easytier-pyo3/fundamentals/configuration/', icon: 'material-symbols:tune' },
        { text: '生命周期与运行期管理', link: '/tutorials/easytier-pyo3/fundamentals/node-runtime/', icon: 'material-symbols:play-circle-outline' },
        { text: '组网进阶与部署实践', link: '/tutorials/easytier-pyo3/advanced/deployment/', icon: 'material-symbols:rocket-launch-outline' },
      ],
    },
  ],
}

export default sidebar
