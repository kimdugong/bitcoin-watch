let bitcoin;
if (typeof window !== 'undefined') {
  bitcoin = new window.WebSocket('wss://ws.blockchain.info/testnet3/inv');
}

const bitcoinInit = () => {
  bitcoin.onopen = () => {
    // const address = 'mrFctiMTPooqAdwnKyLPm2y2EdQYXLBcns';
    const address = 'mwUE1KDnJ3LnKxnzEbpushUt11h9H9Leh4';
    console.log('socket open  : ');

    bitcoin.send('{"op":"ping_block"}');
    bitcoin.send(`{"op":"addr_sub", "addr":"${address}"}`);
    bitcoin.send('{"op":"blocks_sub"}');
  };

  bitcoin.onerror = event => {
    console.log('socket error');
  };
};

export { bitcoinInit, bitcoin };
