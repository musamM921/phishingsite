const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // Замените '/api' на путь, по которому вы хотите отправлять запросы к API
    createProxyMiddleware({
      target: 'https://console.cloud.google.com/apis/credentials/wizard?api=safebrowsing.googleapis.com&previousPage=%2Fapis%2Fapi%2Fsafebrowsing.googleapis.com%2Fmetrics%3Fproject%3Dapi-project-111-412711&project=api-project-111-412711',  // Замените на адрес вашего стороннего API
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',  // Если API не требует префикса, оставьте эту строку пустой
      },
    })
  );
};
