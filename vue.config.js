module.exports = {
  devServer: {
    host: "172.26.0.1",
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  publicPath: '/pomodoro',
  outputDir: './docs',
  pwa: {
    name: 'Pomodoro',
    themeColor: "#E3EFFE",
    msTileColor: "#000000",
    background_color: "#E3EFFE",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/favicon-32.png',
      favicon16: 'img/icons/favicon-16.png',
      appleTouchIcon: 'img/icons/icon-180.png',
      maskIcon: 'img/icons/icon-180.png',
      msTileImage: 'img/icons/icon-180.png'
    },
    manifestOptions: {
      icons: [
        {
          src: "img/icons/icon-180.png",
          type: "image/png",
          sizes: "180x180"
        },
        {
          src: "img/icons/icon-192.png",
          type: "image/png",
          sizes: "192x192"
        },
        {
          src: "img/icons/icon-512.png",
          type: "image/png",
          sizes: "512x512"
        },
        {
          src: "img/icons/android-chrome-192x192.png",
          type: "image/png",
          sizes: "192x192"
        },
        {
          src: "img/icons/android-chrome-maskable-192x192.png",
          type: "image/png",
          sizes: "192x192",
          purpose: "maskable"
        },
        {
          src: "img/icons/android-chrome-512x512.png",
          type: "image/png",
          sizes: "512x512"
        },
        {
          src: "img/icons/android-chrome-maskable-512x512.png",
          type: "image/png",
          sizes: "512x512",
          purpose: "maskable"
        },
      ],
    }
  }
}
