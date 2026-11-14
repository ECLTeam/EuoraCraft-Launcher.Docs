import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: 'Start', link: '/de/', icon: 'material-symbols:home-outline' },
  { text: 'Nutzung', link: '/de/guide/introduction/', activeMatch: '^/de/guide/', icon: 'material-symbols:rocket-launch-outline' },
  { text: 'Entwicklung', link: '/de/development/', activeMatch: '^/de/development/', icon: 'material-symbols:code' },
  {
    text: 'Mehr',
    icon: 'material-symbols:library-books-outline',
    items: [
      { text: 'Tutorials', link: '/de/tutorials/', icon: 'material-symbols:school-outline' },
    ],
  },
])
