
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b14efa39af20418aabee22580847b2df',
  appName: 'Çiftlik Cepte',
  webDir: 'dist',
  server: {
    url: 'https://b14efa39-af20-418a-abee-22580847b2df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#999999"
    }
  }
};

export default config;
