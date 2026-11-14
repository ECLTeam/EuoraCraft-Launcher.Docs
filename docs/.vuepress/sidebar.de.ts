import type { ThemeSidebarMulti } from 'vuepress-theme-plume'

const sidebar: ThemeSidebarMulti = {
  '/guide/': [
    {
      text: 'Schnellstart',
      icon: 'material-symbols:rocket-launch-outline',
      collapsed: false,
      items: [
        { text: 'Einführung', link: '/de/guide/introduction/', icon: 'material-symbols:info-outline' },
      ],
    },
    {
      text: 'Richtlinien und Bedingungen',
      icon: 'material-symbols:gavel-outline',
      collapsed: false,
      items: [
        { text: 'Nutzungsbedingungen', link: '/de/guide/user-agreement/', icon: 'material-symbols:description-outline' },
      ],
    },
  ],
  '/development/': [
    { text: 'ECL entwickeln', link: '/de/development/', icon: 'material-symbols:code' },
    {
      text: 'Erste Schritte',
      icon: 'material-symbols:terminal',
      collapsed: false,
      items: [
        { text: 'Umgebung einrichten', link: '/de/development/setup/environment/', icon: 'material-symbols:settings-outline' },
        { text: 'Aus dem Quellcode bauen', link: '/de/development/setup/build-from-source/', icon: 'material-symbols:build-outline' },
      ],
    },
  ],
  '/tutorials/': [
    { text: 'Tutorials', link: '/de/tutorials/', icon: 'material-symbols:school-outline' },
    {
      text: 'Grundlagen des Minecraft-Launchers',
      icon: 'material-symbols:videogame-asset-outline',
      collapsed: false,
      items: [
        { text: 'Einführung', link: '/de/tutorials/minecraft-launcher/', icon: 'material-symbols:info-outline' },
        { text: 'Versionsmanifest', link: '/de/tutorials/minecraft-launcher/fundamentals/version-manifest/', icon: 'material-symbols:account-tree-outline' },
        { text: 'Startbefehl bauen', link: '/de/tutorials/minecraft-launcher/fundamentals/launch-command/', icon: 'material-symbols:terminal' },
      ],
    },
  ],
}

export default sidebar
