/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/  配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/  主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig } from "vuepress-theme-plume";
import navbar from "./navbar";
import navbarEn from "./navbar.en";
import collections, { englishCollections } from "./collections";
import sidebar from "./sidebar";
import sidebarEn from "./sidebar.en";

// 获取当前年份
const currentYear = new Date().getFullYear();
const yearRange = currentYear === 2025 ? "2025" : `2025-${currentYear}`;

/**
 * @see https://theme-plume.vuejs.press/config/theme/ 
 */
export default defineThemeConfig({
  logo: "/logo.png", // 站点 Logo
  sidebar,
  /*sidebar: {
    "/USEDOC/": [
      {
        text: "介绍",
        link: "/USEDOC/introduction",
        icon: "material-symbols:brightness-alert-outline",
      },
    ],
  },*/
  appearance: true, // 配置 深色模式

  social: [{ icon: "github", link: "https://github.com/ECLTeam" }],
  navbarSocialInclude: ["github"], // 允许显示在导航栏的 social 社交链接
  aside: true, // 页内侧边栏， 默认显示在右侧
  outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/ 
   */
  // copyright: true,

  prevPage: true, // 是否启用上一页链接
  nextPage: true, // 是否启用下一页链接
  createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  footer: {
    message:
      `<a href="https://icp.gov.moe/?keyword=20269999" target="_blank">萌ICP备20269999号</a>`,
    copyright: 
      `版权归属 ${yearRange} © ECLTeam 本站基于 <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a> 构建`,
  },

  /**
   * @see https://theme-plume.vuejs.press/config/theme/#profile 
   */
  profile: {
    avatar: "/logo.png",
    name: "ECL 文档",
    description: "EuoraCraft Launcher 使用文档、开发文档与技术教程",
    circle: true,
    location: '中国',
    organization: "ECLTeam",
  },

  navbar,
  collections,
  locales: {
    '/en/': {
      navbar: navbarEn,
      sidebar: sidebarEn,
      collections: englishCollections,
      footer: {
        message:
          `<a href="https://icp.gov.moe/?keyword=20269999" target="_blank">萌ICP备20269999号</a>`,
        copyright:
          `Copyright ${yearRange} © ECLTeam. Built with <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> and <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>.`,
      },
      profile: {
        name: 'ECL Docs',
        description: 'EuoraCraft Launcher documentation and technical tutorials',
        location: 'China',
      },
    },
  },

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/ 
   
   bulletin: {
     layout: 'top-right',
     contentType: 'markdown',
     title: '公告板标题',
     content: '公告板内容',
   },*/

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/theme/#transition  */
  transition: {
    page: true, // 启用 页面间跳转过渡动画
    //   postList: true,    // 启用 博客文章列表过渡动画
    appearance: "circle-clip", // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },
});
