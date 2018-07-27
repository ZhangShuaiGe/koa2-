module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'boke-node',
      script    : './app.js',
      env: {
        NODE_ENV: 'prd'
      },
      env_prd : {
        NODE_ENV: 'prd'
      },
      env_test:{
        NODE_ENV: 'test'
      },
      env_dev:{
          NODE_ENV: 'dev'
      },
    }
  ]
};
