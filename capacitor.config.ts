import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.breedly.app',
  appName: 'BreedLy',
  webDir: 'public',
  server: {
    url: process.env.CAP_SERVER_URL || 'https://breedlyy.vercel.app/',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchFadeOutDuration: 0,
      backgroundColor: "#FFFDD0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      useDialog: false
    },
    StatusBar: {
      style: "DEFAULT",
      overlaysWebView: true
    }
  }
};

export default config;
