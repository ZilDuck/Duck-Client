
export function getApiUrl () {
  const network = process.env.current_network
  switch (network) {
    case 'testnet': {
      return 'https://dev-api.zilliqa.com'
    }
    case 'mainnet': {
      return 'https://api.zilliqa.com'
    }
    default: throw new Error('Invalid network')
  }
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',
  ssr: true,
  env: {
    current_network: process.env.current_network,
    token_contract: process.env.token_contract,
    proxy_contract: process.env.proxy_contract,
    zrc1_contract: process.env.zrc1_contract,
    zrc6_contract: process.env.zrc6_contract,
    migrator_contract: process.env.migrator_contract,
    rewards_contract: process.env.rewards_contract,
    voucher_contract: process.env.voucher_contract,
    ownership_contract: process.env.ownership_contract
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Duck - Non Fungible Ducks',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Home of the Non Fungible Ducks as well as all projects by the Duck team.'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/meta-preview.png'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/breakpoint.client.js',
    '~/plugins/changeToast.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: ['~/components', '~/components/sections', '~/components/base']
  },
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxt/content'
  ],

  axios: {
    baseURL: getApiUrl()
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config) {
      config.node = {
        fs: 'empty'
      }
    }
  },
  server: {
    host: '0.0.0.0'
  }
}
