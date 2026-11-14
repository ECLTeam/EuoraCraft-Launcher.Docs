import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: 'Главная', link: '/ru/', icon: 'material-symbols:home-outline' },
  { text: 'Использование', link: '/ru/guide/introduction/', activeMatch: '^/ru/guide/', icon: 'material-symbols:rocket-launch-outline' },
  { text: 'Разработка', link: '/ru/development/', activeMatch: '^/ru/development/', icon: 'material-symbols:code' },
  {
    text: 'Ещё',
    icon: 'material-symbols:library-books-outline',
    items: [
      { text: 'Руководства', link: '/ru/tutorials/', icon: 'material-symbols:school-outline' },
    ],
  },
])
