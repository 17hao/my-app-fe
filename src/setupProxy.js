const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // available in development environment
    // using nginx as proxy in production envrionment
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:9000",
            changeOrigin: true,
        })
    );
};