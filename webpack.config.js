const DotEnvWebpack = require('dotenv-webpack');

module.exports = (config, { isProd, isDev }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */
  let envPath = '.env';
  switch (process.env.TWILIO_PROFILE) {
      case 'Dev':
          envPath = '.env.dev';
          break;
      case 'Production':
          envPath = '.env.prod';
          break;
  }
    // If path was set, use the dotenv-webpack to inject the variables
  if (envPath) {
    config.plugins.push(new DotEnvWebpack({
        path: envPath
    }));
  }
  return config;
}
