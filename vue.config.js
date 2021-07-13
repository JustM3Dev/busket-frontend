module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'lang',
      enableInSFC: false,
    },
    pwa: {
      name: 'Busket',
      short_name: 'Busket',
      description: 'A small custom shopping list.',
      display: 'fullscreen',
      theme_color: '#1976d2',
      background_color: '#1976d2',
      backgroundColor: '#1976d2',
      themeColor: '#1976d2',
      msTileColor: '#000000',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      workboxOptions: {
        cleanupOutdatedCaches: true,
        mode: 'production',
        themeColor: '#1976d2',
        msTileColor: '#000000',
      },
      manifestOptions: {
        start_url: '/',
      },
    },
  },
};
