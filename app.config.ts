import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

const APP_NAME = process.env.APP_NAME ?? "SmartFeeder";
const IOS_BUNDLE_IDENTIFIER =
  process.env.IOS_BUNDLE_IDENTIFIER ?? "com.smartfeeder.app";
const ANDROID_PACKAGE_NAME =
  process.env.ANDROID_PACKAGE_NAME ?? "com.smartfeeder.app";
const EAS_PROJECT_ID =
  process.env.EAS_PROJECT_ID ?? "9b3d6232-dc16-4d80-acc6-cc04a8096e30";

const GOOGLE_SIGNIN_IOS_URL_SCHEME = process.env.GOOGLE_SIGNIN_IOS_URL_SCHEME;

const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
const EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: APP_NAME,
  slug: "SmartFeeder-AplicationV2",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/ico/icon.png",
  scheme: "smartfeederaplicationv2",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: ANDROID_PACKAGE_NAME,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: "static",
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-secure-store",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: GOOGLE_SIGNIN_IOS_URL_SCHEME,
      },
    ],
    [
      "react-native-ble-plx",
      {
        isBackgroundEnabled: true,
        modes: ["central"],
        bluetoothAlwaysPermission:
          "Allow $(PRODUCT_NAME) to connect to bluetooth devices",
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  extra: {
    router: {},
    eas: {
      projectId: EAS_PROJECT_ID,
    },
    EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  },
});

export default config;
