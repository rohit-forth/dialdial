const express = require('express')
const next = require("next");
const port = 5000;
const hostname = 'localhost'
const app = next({ dev: false, port, hostname });
const handle = app.getRequestHandler();
app
  .prepare()
  .then(() => {
    const server = express();
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });