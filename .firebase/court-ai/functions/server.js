const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrcourtai = onRequest({"region":"asia-east1"}, (req, res) => server.then(it => it.handle(req, res)));
  