const { configure } = require("quasar/wrappers");
const dotenv = require("dotenv");
dotenv.config();
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      plugins: ["Dialog", "Notify"],
      components: ["QTabs", "QTab", "QTabPanel", "QTabPanels"],
    },
    boot: ["axios"],
    css: ["app.scss"],
    extras: ["roboto-font", "material-icons"],
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },
      env: {
        API_BASE_URL: process.env.API_BASE_URL,
      },
      vueRouterMode: "hash",
      vitePlugins: [
        [
          "vite-plugin-checker",
          {
            eslint: {
              lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"',
            },
          },
          { server: false },
        ],
      ],
    },
    devServer: {
      open: true,
    },
    animations: [],
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "quasar-login",
      },
    },
    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
