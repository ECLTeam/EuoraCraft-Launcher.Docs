/**
 * 每个内容域独立作为一个 doc collection。页面的 permalink 必须保持在
 * 对应的 linkPrefix 下，否则主题不会加载相应的侧边栏。
 *
 * 六个语种（简体中文、English、繁體中文、日本語、Русский、Deutsch）各自拥有
 * 使用 / 开发 / 技术教程 三个内容域，新增语种时三处需同时补齐。
 */
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const guide = defineCollection({
  type: 'doc',
  dir: '/guide/',
  linkPrefix: '/guide',
  title: '使用',
})

const development = defineCollection({
  type: 'doc',
  dir: '/development/',
  linkPrefix: '/development',
  title: '开发',
})

const tutorials = defineCollection({
  type: 'doc',
  dir: '/tutorials/',
  linkPrefix: '/tutorials',
  title: '技术教程',
})

const englishGuide = defineCollection({
  type: 'doc',
  dir: '/en/guide/',
  linkPrefix: '/en/guide',
  title: 'Use ECL',
})

const englishDevelopment = defineCollection({
  type: 'doc',
  dir: '/en/development/',
  linkPrefix: '/en/development',
  title: 'Develop ECL',
})

const englishTutorials = defineCollection({
  type: 'doc',
  dir: '/en/tutorials/',
  linkPrefix: '/en/tutorials',
  title: 'Technical Tutorials',
})

const zhTwGuide = defineCollection({
  type: 'doc',
  dir: '/zh-tw/guide/',
  linkPrefix: '/zh-tw/guide',
  title: '使用',
})

const zhTwDevelopment = defineCollection({
  type: 'doc',
  dir: '/zh-tw/development/',
  linkPrefix: '/zh-tw/development',
  title: '開發',
})

const zhTwTutorials = defineCollection({
  type: 'doc',
  dir: '/zh-tw/tutorials/',
  linkPrefix: '/zh-tw/tutorials',
  title: '技術教學',
})

const japaneseGuide = defineCollection({
  type: 'doc',
  dir: '/ja/guide/',
  linkPrefix: '/ja/guide',
  title: '利用',
})

const japaneseDevelopment = defineCollection({
  type: 'doc',
  dir: '/ja/development/',
  linkPrefix: '/ja/development',
  title: '開発',
})

const japaneseTutorials = defineCollection({
  type: 'doc',
  dir: '/ja/tutorials/',
  linkPrefix: '/ja/tutorials',
  title: 'チュートリアル',
})

const russianGuide = defineCollection({
  type: 'doc',
  dir: '/ru/guide/',
  linkPrefix: '/ru/guide',
  title: 'Использование',
})

const russianDevelopment = defineCollection({
  type: 'doc',
  dir: '/ru/development/',
  linkPrefix: '/ru/development',
  title: 'Разработка',
})

const russianTutorials = defineCollection({
  type: 'doc',
  dir: '/ru/tutorials/',
  linkPrefix: '/ru/tutorials',
  title: 'Руководства',
})

const germanGuide = defineCollection({
  type: 'doc',
  dir: '/de/guide/',
  linkPrefix: '/de/guide',
  title: 'Nutzung',
})

const germanDevelopment = defineCollection({
  type: 'doc',
  dir: '/de/development/',
  linkPrefix: '/de/development',
  title: 'Entwicklung',
})

const germanTutorials = defineCollection({
  type: 'doc',
  dir: '/de/tutorials/',
  linkPrefix: '/de/tutorials',
  title: 'Tutorials',
})

export const chineseCollections = defineCollections([guide, development, tutorials])

export const englishCollections = defineCollections([
  englishGuide,
  englishDevelopment,
  englishTutorials,
])

export const zhTwCollections = defineCollections([
  zhTwGuide,
  zhTwDevelopment,
  zhTwTutorials,
])

export const japaneseCollections = defineCollections([
  japaneseGuide,
  japaneseDevelopment,
  japaneseTutorials,
])

export const russianCollections = defineCollections([
  russianGuide,
  russianDevelopment,
  russianTutorials,
])

export const germanCollections = defineCollections([
  germanGuide,
  germanDevelopment,
  germanTutorials,
])

export default chineseCollections
