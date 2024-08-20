import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 路由标题
     *
     * 可用于设置文档标题
     */
    title: string
    /**
     * 路由的国际化键
     *
     * 用于国际化。如果设置了此属性，标题将被忽略
     */
    i18nKey?: App.I18n.I18nKey | null
    /**
     * 路由的角色权限
     *
     * 如果当前用户具有至少一个角色，则可以访问此路由
     *
     * 仅在路由模式为 "static" 时有效，如果路由模式为 "dynamic"，将被忽略
     */
    roles?: string[]
    /** 是否缓存路由 */
    keepAlive?: boolean | null
    /**
     * 是否为常量路由
     *
     * 当设置为 true 时，将不会进行登录验证和权限验证
     */
    constant?: boolean | null
    /**
     * Iconify 图标
     *
     * 可用于菜单或面包屑导航
     */
    icon?: string
    /**
     * 本地图标
     *
     * 在 "src/assets/svg-icon" 中，如果设置了此属性，icon 将被忽略
     */
    localIcon?: string
    /** 图标大小。宽度和高度相同 */
    iconFontSize?: number
    /** 路由排序 */
    order?: number | null
    /** 路由的外部链接 */
    href?: string | null
    /** 是否在菜单中隐藏此路由 */
    hideInMenu?: boolean | null
    /**
     * 激活菜单键
     *
     * 当进入路由时，菜单将激活此键
     *
     * 路由不在菜单中
     *
     * @example
     *   如果路由为 "user_detail"，设置为 "user_list"，则菜单 "user_list" 将被激活
     */
    activeMenu?: import("@elegant-router/types").RouteKey | null
    /** 默认情况下，相同的路由路径使用一个标签，即使查询不同。如果设置为 true，则不同的查询将使用不同的标签 */
    multiTab?: boolean | null
    /** 如果设置了值，路由将在标签页中固定，并且值为固定标签的顺序 */
    fixedIndexInTab?: number | null
    /** 如果设置了查询参数，进入路由时将自动携带这些参数 */
    query?: { key: string; value: string }[] | null
    /** 此路由是否为首页路由 */
    homepage?: boolean
  }
}
