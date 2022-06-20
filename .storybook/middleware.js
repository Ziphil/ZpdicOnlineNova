//


function expressMiddleware(router) {
  const {createProxyMiddleware} = require("http-proxy-middleware");
  router.use("/internal*", createProxyMiddleware({
    target: "http://localhost:8050",
    changeOrigin: true
  }))
}

module.exports = expressMiddleware;