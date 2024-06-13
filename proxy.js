const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/c_actual_brief.xml',
  createProxyMiddleware({
    target: 'https://xml.smg.gov.mo',
    changeOrigin: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
);

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});