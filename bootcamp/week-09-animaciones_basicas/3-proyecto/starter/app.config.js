const { expo: staticConfig } = require('./app.json');

module.exports = {
  expo: {
    name: 'Pizza Ruta',
    slug: 'pizza-ruta-w9',
    version: '1.9.0',
    orientation: 'portrait',
    scheme: 'pizzaruta',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'dev.ergrato.bootcamp.week09',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0f172a',
      },
      package: 'dev.ergrato.bootcamp.week09',
    },
    plugins: ['expo-secure-store'],
    // EAS agrega projectId en app.json; lo conservamos sin recuperar plugins antiguos.
    extra: staticConfig.extra,
    owner: staticConfig.owner,
  },
};
