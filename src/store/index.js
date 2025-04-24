import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // 用户信息
    userInfo: null,
    // 商品数据
    products: [],
    // 分类数据
    categories: [],
    // 订单数据
    orders: [],
    // 系统配置
    systemConfig: {
      theme: 'light',
      language: 'zh-CN'
    },
    // 加载状态
    loading: false
  }),
  getters: {
    // 获取orders
    getOrder: (state) => state.orders,
    // 获取当前主题
    currentTheme: (state) => state.systemConfig.theme,
    // 获取当前语言
    currentLanguage: (state) => state.systemConfig.language
  },
  actions: {
    // 更新用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    // 更新商品数据
    setProducts(products) {
      this.products = products
    },
    // 添加单个商品
    addProduct(product) {
      this.products.push(product)
    },
    // 更新商品
    updateProduct(product) {
      const index = this.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.products[index] = product
      }
    },
    // 删除商品
    removeProduct(id) {
      this.products = this.products.filter(p => p.id !== id)
    },
    // 设置分类数据
    setCategories(categories) {
      this.categories = categories
    },
    // 添加分类
    addCategory(category) {
      this.categories.push(category)
    },
    // 更新分类
    updateCategory(category) {
      const index = this.categories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.categories[index] = category
      }
    },
    // 删除分类
    removeCategory(id) {
      this.categories = this.categories.filter(c => c.id !== id)
    },
    // 切换主题
    toggleTheme() {
      this.systemConfig.theme = this.systemConfig.theme === 'light' ? 'dark' : 'light'
    },
    // 设置加载状态
    setLoading(loading) {
      this.loading = loading
    },
    // 订单数据操作
    setOrders(orders) {
      this.orders = orders
    },
    addOrder(order) {
      this.orders.push(order)
    },
  },
  // 开启持久化
  persist: true
})
