const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // available in dev, proxy by nginx in prod
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:9000",
            changeOrigin: true,
        })
    );
};