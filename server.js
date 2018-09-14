const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
// const bitcoin = require('./bitcoin');
const Socket = require('blockchain.info/Socket');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });

module.exports = app.prepare().then(() => {
  const bitcoin = new Socket({ network: 3 });
  console.log(bitcoin);
  const server = express();
  server.use(bodyParser.json());

  bitcoin.op('ping', req => console.log(req));
  bitcoin.onBlock(block => {
    console.log('new block created  : ', block);
  });
  bitcoin.onOpen(() => {
    console.log('Connected to Blockchain.info!', bitcoin);
  });
  bitcoin.onTransaction(tx => console.log(tx));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });
});
