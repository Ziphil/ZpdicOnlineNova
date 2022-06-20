//

import {
  createProxyMiddleware
} from "http-proxy-middleware";


function expressMiddleware(router: any): void {
  router.use("/internal", createProxyMiddleware({
    target: "http://localhost:8050",
    changeOrigin: true
  }))
}

module.exports = expressMiddleware;