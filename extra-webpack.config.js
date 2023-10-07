const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, options)=> {
  console.log(` Using: '${config.mode}' mode`);
  config.mode !== 'production' && config.plugins.push(new BundleAnalyzerPlugin());
  return config;
};