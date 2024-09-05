export default {
  expo: {
    name: "YourAppName",
    slug: "your-app-slug",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png", // Ajuste o caminho para o ícone correto
    splash: {
      image: "./assets/splash.png", // Ajuste o caminho para a imagem de splash correta
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "We need your permission to access the camera.",
        NSPhotoLibraryUsageDescription: "We need your permission to access the photo library."
      }
    },
    android: {
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
};
