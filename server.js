const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(cors());
// Proxy configuration for different APIs
const apiProxies = {
  "/uxosapi": "https://debug.byjusorders.com/list",
  "/batchapihex":
    "https://api.byjus.com/tth-batching/api/v1/kartAndUxos/batch/",
  "/batchapinum": "https://api.tllms.com/blc/bms/api/v1/batch",
  
};

Object.keys(apiProxies).forEach((context) => {
  app.use(
    context,
    createProxyMiddleware({
      target: apiProxies[context],
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(context, ""),
    })
  );
});
const proxyConfigTllms = {
  target: "https://e490-14-143-179-34.ngrok-free.app/",
  changeOrigin: true,
  pathRewrite: {
    "^/tllmsapi": "", // remove /api prefix when forwarding to the target URL
  },
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    // If you need to manipulate headers or query parameters, you can do it here
    // For example, if the target URL requires specific headers, you can add them here
    // proxyReq.setHeader('Authorization', 'Bearer some-token');
  },
};
const proxyConfigUxosSync = {
  target: "https://03a9-14-143-179-34.ngrok-free.app/",
  changeOrigin: true,
  pathRewrite: {
    "^/uxosSyncapi": "", // remove /api prefix when forwarding to the target URL
  },
  secure: false,
  onProxyReq: (proxyReq, req, res) => {},
};
app.use("/tllmsapi", createProxyMiddleware(proxyConfigTllms));
app.use("/uxosSyncapi", createProxyMiddleware(proxyConfigUxosSync));

app.listen(3001, () => {
  console.log("Proxy server running on port 3001");
});

// "/tllmsapi":
//     "https://03a9-14-143-179-34.ngrok-free.app/get_tllms1",