import type { ThemeSidebarMulti } from 'vuepress-theme-plume'

const sidebar: ThemeSidebarMulti = {
  '/guide/': [
    {
      text: 'Начало работы',
      icon: 'material-symbols:rocket-launch-outline',
      collapsed: false,
      items: [
        { text: 'Введение', link: '/ru/guide/introduction/', icon: 'material-symbols:info-outline' },
      ],
    },
    {
      text: 'Политики и соглашения',
      icon: 'material-symbols:gavel-outline',
      collapsed: false,
      items: [
        { text: 'Пользовательское соглашение', link: '/ru/guide/user-agreement/', icon: 'material-symbols:description-outline' },
      ],
    },
  ],
  '/development/': [
    { text: 'Разработка ECL', link: '/ru/development/', icon: 'material-symbols:code' },
    {
      text: 'Начало разработки',
      icon: 'material-symbols:terminal',
      collapsed: false,
      items: [
        { text: 'Настройка окружения', link: '/ru/development/setup/environment/', icon: 'material-symbols:settings-outline' },
        { text: 'Сборка из исходного кода', link: '/ru/development/setup/build-from-source/', icon: 'material-symbols:build-outline' },
      ],
    },
  ],
  '/tutorials/': [
    { text: 'Руководства', link: '/ru/tutorials/', icon: 'material-symbols:school-outline' },
    {
      text: 'Как устроен лаунчер Minecraft',
      icon: 'material-symbols:videogame-asset-outline',
      collapsed: false,
      items: [
        { text: 'Введение', link: '/ru/tutorials/minecraft-launcher/', icon: 'material-symbols:info-outline' },
        { text: 'Манифест версии', link: '/ru/tutorials/minecraft-launcher/fundamentals/version-manifest/', icon: 'material-symbols:account-tree-outline' },
        { text: 'Команда запуска', link: '/ru/tutorials/minecraft-launcher/fundamentals/launch-command/', icon: 'material-symbols:terminal' },
      ],
    },
  ],
}

export default sidebar
