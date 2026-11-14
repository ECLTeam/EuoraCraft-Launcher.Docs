import type { ThemeSidebarMulti } from 'vuepress-theme-plume'

const sidebar: ThemeSidebarMulti = {
  '/guide/': [
    {
      text: 'クイックスタート',
      icon: 'material-symbols:rocket-launch-outline',
      collapsed: false,
      items: [
        { text: '紹介', link: '/ja/guide/introduction/', icon: 'material-symbols:info-outline' },
      ],
    },
    {
      text: 'ポリシーと規約',
      icon: 'material-symbols:gavel-outline',
      collapsed: false,
      items: [
        { text: '利用規約', link: '/ja/guide/user-agreement/', icon: 'material-symbols:description-outline' },
      ],
    },
  ],
  '/development/': [
    { text: 'ECL の開発', link: '/ja/development/', icon: 'material-symbols:code' },
    {
      text: '開発を始める',
      icon: 'material-symbols:terminal',
      collapsed: false,
      items: [
        { text: '環境構築', link: '/ja/development/setup/environment/', icon: 'material-symbols:settings-outline' },
        { text: 'ソースコードからのビルド', link: '/ja/development/setup/build-from-source/', icon: 'material-symbols:build-outline' },
      ],
    },
  ],
  '/tutorials/': [
    { text: 'チュートリアル', link: '/ja/tutorials/', icon: 'material-symbols:school-outline' },
    {
      text: 'Minecraft ランチャーの仕組み',
      icon: 'material-symbols:videogame-asset-outline',
      collapsed: false,
      items: [
        { text: '紹介', link: '/ja/tutorials/minecraft-launcher/', icon: 'material-symbols:info-outline' },
        { text: 'バージョンマニフェスト', link: '/ja/tutorials/minecraft-launcher/fundamentals/version-manifest/', icon: 'material-symbols:account-tree-outline' },
        { text: '起動コマンドの組み立て', link: '/ja/tutorials/minecraft-launcher/fundamentals/launch-command/', icon: 'material-symbols:terminal' },
      ],
    },
  ],
}

export default sidebar
