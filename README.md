# Bitcoin-watch

## only for testnet3

### testnet wallet generator

https://bitcoinpaperwallet.com/bitcoinpaperwallet/generate-wallet.html?design=alt-testnet

### testnet faucet

https://coinfaucet.eu/en/btc-testnet/

### Websockets and Bitcoin testnet3 API

wss://ws.blockchain.info/testnet3/inv

### Your Credentials

### Player 1 payee

#### Public Key

mwUE1KDnJ3LnKxnzEbpushUt11h9H9Leh4

#### WIF

92aSHYkchcLRm1XbQ3BAmA7ReRBSAs9oDxMc9F9U7kpSDgRamfi

### Player 2 payer

#### Public Key

mrFctiMTPooqAdwnKyLPm2y2EdQYXLBcns

#### WIF

93BkY78fNctgBfPjqABGwscuGiVM2iQzeRSkGtzDE2EPiAYhfZX

### API Reference

https://www.blockchain.com/ko/api/blockchain_api

https://testnet.blockexplorer.com/api-ref

https://www.blockcypher.com/dev/bitcoin/

### API end point

https://api.blockcypher.com/v1/btc/test3/txs/

### rawTx decoder

https://live.blockcypher.com/btc-testnet/decodetx/

### tx explorer

https://testnet.blockchain.info/tx/81b2915472a702af1f8d39dc8c8e84c09fef8f4a9cb50b3f64d717d8e2271042

blockcypher 가 훨씬 사용하기 쉽게 제공하고 있다.

https://live.blockcypher.com/btc-testnet/2f74e62d56232b020dac2e58bf5ccd8d528b37237161e1fa365f2b170818c450

### address explorer

https://testnet.blockchain.info/address/mrFctiMTPooqAdwnKyLPm2y2EdQYXLBcns

#### transaction version 을 확인할 것!

blockchain.info 는 version 2 transation 에 대한 조회가 가능하지만 blockcypher 는 version 1 만 지원한다.

그런데 bitcoinjs-lib 의 transaction builder 의 default 값이 version 2 였음...

blockcypher 의 api 를 사용하고 싶었기 때문에 version 1 을 명시해서 version 1 transaction 을 만들었다.
