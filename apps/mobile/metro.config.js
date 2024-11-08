const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withTurborepoManagedCache(
  withMonorepoPaths(
    withNativeWind(config, {
      input: "./src/styles.css",
      configPath: "./tailwind.config.ts",
    }),
  ),
);

function withMonorepoPaths(config) {
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, "../..");

  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  return config;
}

function withTurborepoManagedCache(config) {
  config.cacheStores = [
    new FileStore({ root: path.join(__dirname, "node_modules/.cache/metro") }),
  ];
  return config;
}
