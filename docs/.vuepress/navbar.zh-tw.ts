import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首頁', link: '/zh-tw/', icon: 'material-symbols:home-outline' },
  { text: '使用', link: '/zh-tw/guide/introduction/', activeMatch: '^/zh-tw/guide/', icon: 'material-symbols:rocket-launch-outline' },
  { text: '開發', link: '/zh-tw/development/', activeMatch: '^/zh-tw/development/', icon: 'material-symbols:code' },
  {
    text: '其他',
    icon: 'material-symbols:library-books-outline',
    items: [
      { text: '技術教學', link: '/zh-tw/tutorials/', icon: 'material-symbols:school-outline' },
    ],
  },
])
