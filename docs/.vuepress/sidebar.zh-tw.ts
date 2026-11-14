import type { ThemeSidebarMulti } from 'vuepress-theme-plume'

const sidebar: ThemeSidebarMulti = {
  '/guide/': [
    {
      text: '快速開始',
      icon: 'material-symbols:rocket-launch-outline',
      collapsed: false,
      items: [
        { text: '介紹', link: '/zh-tw/guide/introduction/', icon: 'material-symbols:info-outline' },
      ],
    },
    {
      text: '政策與協議',
      icon: 'material-symbols:gavel-outline',
      collapsed: false,
      items: [
        { text: '使用者條款', link: '/zh-tw/guide/user-agreement/', icon: 'material-symbols:description-outline' },
      ],
    },
  ],
  '/development/': [
    { text: 'ECL 開發', link: '/zh-tw/development/', icon: 'material-symbols:code' },
    {
      text: '開始開發',
      icon: 'material-symbols:terminal',
      collapsed: false,
      items: [
        { text: '環境建置', link: '/zh-tw/development/setup/environment/', icon: 'material-symbols:settings-outline' },
        { text: '從原始碼建置', link: '/zh-tw/development/setup/build-from-source/', icon: 'material-symbols:build-outline' },
      ],
    },
  ],
  '/tutorials/': [
    { text: '技術教學', link: '/zh-tw/tutorials/', icon: 'material-symbols:school-outline' },
    {
      text: 'Minecraft 啟動器原理',
      icon: 'material-symbols:videogame-asset-outline',
      collapsed: false,
      items: [
        { text: '介紹', link: '/zh-tw/tutorials/minecraft-launcher/', icon: 'material-symbols:info-outline' },
        { text: '版本清單檔案', link: '/zh-tw/tutorials/minecraft-launcher/fundamentals/version-manifest/', icon: 'material-symbols:account-tree-outline' },
        { text: '建構啟動指令', link: '/zh-tw/tutorials/minecraft-launcher/fundamentals/launch-command/', icon: 'material-symbols:terminal' },
      ],
    },
  ],
}

export default sidebar
