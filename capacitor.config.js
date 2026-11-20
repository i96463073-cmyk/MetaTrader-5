module.exports = {
  // It reads these from the build script, or falls back to default
  appId: process.env.CAPACITOR_APP_ID || 'com.valetax.app1',
  appName: process.env.CAPACITOR_APP_NAME || 'Valetax',
  webDir: 'build-temp', // We will build into a temp folder
  server: {
    androidScheme: 'https'
  }
};
