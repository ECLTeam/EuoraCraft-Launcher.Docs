import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: 'ホーム', link: '/ja/', icon: 'material-symbols:home-outline' },
  { text: '利用', link: '/ja/guide/introduction/', activeMatch: '^/ja/guide/', icon: 'material-symbols:rocket-launch-outline' },
  { text: '開発', link: '/ja/development/', activeMatch: '^/ja/development/', icon: 'material-symbols:code' },
  {
    text: 'その他',
    icon: 'material-symbols:library-books-outline',
    items: [
      { text: 'チュートリアル', link: '/ja/tutorials/', icon: 'material-symbols:school-outline' },
    ],
  },
])
