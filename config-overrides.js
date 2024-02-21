/* config-overrides.js */

// const { ModuleFederationPlugin } = require ('webpack').container
// const { dependencies } = require("•/package. json")

// module.exports = function override(config, env) {
//     //do stuff with the webpack config...
//     if (config.plugins === undefined) config.plugins = []

//     config.plugins.push(
//         new ModuleFederationPlugin({
//             name: "app",
//             library: { type: "var", name: "app" },
//             filename: "remoteEntry.js",
//             remotes: {
//             // 'app2': 'app2',
//             },
//             exposes: {
//             './Button': './src/Button',
//             },
//             shared: {
//             ...dependencies,
//             react: {
//                 singleton: true,
//                 eager: true,
//                 requiredVersion: dependencies.react,
//             },
//             "react-dom": {
//                 singleton: true,
//                 eager: true,
//                 requiredVersion: dependencies["react-dom"],
//             },
//             },
//         })
//         )

//     return config;
//   }

const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const {
  override,
  addWebpackPlugin,
  addWebpackModuleRule,
  // overrideDevServer,
  // watchAll,
  disableEsLint,
} = require("customize-cra");

// module.exports = override(
//     addWebpackModuleRule({ test: /\.po$/, use: ['json-loader', 'po-loader'] })
// addWebpackPlugin(
//     new ModuleFederationPlugin({
//         name: "micorfrontend_app",
//         filename: "remoteEntry.js",
//         remotes: {},
//         exposes: {
//           "./Header": "./src/Header.jsx",
//           "./Footer": "./src/Footer.jsx",
//         },
//         shared: {
//           ...deps,
//           react: {
//             singleton: true,
//             requiredVersion: deps.react,
//           },
//           "react-dom": {
//             singleton: true,
//             requiredVersion: deps["react-dom"],
//           },
//         },
//       }),
// )
// );

module.exports = {
  webpack: override(
    // usual webpack plugin
    disableEsLint(),
    addWebpackModuleRule({ test: /\.po$/, use: ["json-loader", "po-loader"] }),
    addWebpackPlugin(
      new ModuleFederationPlugin({
        name: "mf_consumer",
      filename: "remoteEntry.js",
      remotes: {
        micorfrontend_app:
          "micorfrontend_app@http://localhost:3000/remoteEntry.js",
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
      })
    )
  ),
  // devServer: overrideDevServer(
  //   // dev server plugin
  //   watchAll(),
  // )
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);
      // Change the dev server's config here...
      // Then return your modified config.
      config.historyApiFallback = true;
      return config;
    };
  },
};
