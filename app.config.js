import 'dotenv/config';

export default {
  name: "Scuba SEAsons",
  slug: "divegomobile",
  scheme: ["divegomobile", process.env.EXPO_PUBLIC_FACEBOOK_SCHEME],
  version: "1.5.9",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  plugins: [
    "expo-font",
    "expo-image-picker",
    [
      "expo-screen-orientation",
      {
        initialOrientation: "PORTRAIT",
      },
    ],
    "@react-native-google-signin/google-signin",
    [
      "react-native-fbsdk-next",
      {
        appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
        clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
        displayName: "Scuba SEAsons",
        scheme: process.env.EXPO_PUBLIC_FACEBOOK_SCHEME,
        buildscript: {
          ext: {
            facebookSdkVersion: "13.1.0",
          },
        },
      },
    ],
  ],
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ADD8E6",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "81",
    supportsTablet: true,
    requireFullScreen: true,
    orientation: "portrait",
    bundleIdentifier: "com.freem11.divegomobile",
    infoPlist: {
      UIBackgroundModes: ["fetch"],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            "com.googleusercontent.apps.498754860675-jgnfsgnuelqn1o55or5585mdgicihfl2",
          ],
        },
      ],
      NSLocationUsageDescription:
        "We would like to use your location for 2 features: 1) To set the map to your current location when it loads rather than the default location, 2) For the 'I am at the dive site' button to use your location as the location of the dive site you want to submit. These features will allow for a smoother user experience and access to all of Scuba SEAsons' functionality",
      NSLocationWhenInUseUsageDescription:
        "We would like to use your location for 2 features: 1) To set the map to your current location when it loads rather than the default location. 2) For the 'I am at the dive site' button to use your location as the location of the dive site you want to submit. These features will allow for a smoother user experience and access to all of Scuba SEAsons' functionality",
      NSPhotoLibraryUsageDescription:
        "We would like access to your photos so that you can upload your photo as proof of the animal sighting you are submitting, we will use this to validate that it is correct before it is added to the app for others to view. Also in a planned future feature we would like to use submitted photos for machine learning so that future photos submissions can be identified by the system and dive users the extra effort of manually typing in the animal's name",
      UISupportedInterfaceOrientations: ["UIInterfaceOrientationPortrait"],
      "UISupportedInterfaceOrientations~ipad": ["UIDeviceOrientationPortrait"],
      SKAdNetworkItems: [
        {
          SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork",
        },
        {
          SKAdNetworkIdentifier: "n38lu8286q.skadnetwork",
        },
      ],
    },
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    versionCode: 81,
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#00FFFFFF",
    },
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_JSON_ANDROID,
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.RECORD_AUDIO",
      "android.permission.INTERNET",
    ],
    package: "com.freem11.divegomobile",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    url: "https://u.expo.dev/df1b7ca8-d86d-4667-859b-0330dad67126",
  },
};
