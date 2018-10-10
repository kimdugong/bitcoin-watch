import React, { Component } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Container, Table } from 'semantic-ui-react';

import { bitcoin, bitcoinInit } from '../bitcoin';
import { roundToDecimals } from '../utils';
import TxRow from '../components/TxRow';

const address = 'mwUE1KDnJ3LnKxnzEbpushUt11h9H9Leh4';
class BitcoinWatch extends Component {
  static async getInitialProps() {
    const zeroConfirmBal = await axios.get(
      `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=0`
    );
    const sixConfirmBal = await axios.get(
      `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=6`
    );
    return {
      zeroConfirmBal: zeroConfirmBal.data * 1 * 1e-8,
      sixConfirmBal: sixConfirmBal.data * 1 * 1e-8
    };
  }

  listenBitcoin = () => {
    bitcoin.onmessage = async event => {
      const eventData = JSON.parse(event.data);
      const eventType = eventData.op;
      const unconfirmedTxs = this.state.unconfirmedTxs;
      switch (eventType) {
        case 'block': {
          console.log(
            'block data              :                   ',
            eventData.x
          );

          unconfirmedTxs.forEach(async tx => {
            const { data } = await axios.get(
              `https://api.blockcypher.com/v1/btc/test3/txs/${tx.hash}`
            );
            if (data.confirmations !== 0) {
              this.setState(prev => {
                return {
                  txs: [data, ...prev.txs],
                  unconfirmedTxs: [
                    ...prev.unconfirmedTxs.filter(
                      prevTx => prevTx.hash !== tx.hash
                    )
                  ]
                };
              });
            }
            return true;
          });

          const zeroConfirmBal = await axios.get(
            `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=0`
          );
          const sixConfirmBal = await axios.get(
            `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=6`
          );
          return this.setState({
            currentBlock: eventData.x.height,
            zeroConfirmBal: zeroConfirmBal.data * 1 * 1e-8,
            sixConfirmBal: sixConfirmBal.data * 1 * 1e-8
          });
        }
        case 'utx': {
          const hash = eventData.x.hash;
          const zeroConfirmBal = await axios.get(
            `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=0`
          );
          const tx = await axios.get(
            `https://api.blockcypher.com/v1/btc/test3/txs/${hash}`
          );
          console.log(
            'transaction data              :                   ',
            tx.data
          );
          return this.setState(prev => ({
            zeroConfirmBal: zeroConfirmBal.data * 1 * 1e-8,
            unconfirmedTxs: [tx.data, ...prev.unconfirmedTxs]
          }));
        }

        default:
          return null;
      }
    };
  };

  renderRow = (txs, myAddr) => {
    // return false;
    return txs.map(tx => (
      <TxRow
        tx={tx}
        key={tx.hash}
        myAddr={myAddr}
        currentBlock={this.state.currentBlock}
      />
    ));
  };

  componentDidMount = async () => {
    await bitcoinInit();
    await this.listenBitcoin();
  };

  componentDidUpdate(prevProps) {}

  state = {
    unconfirmedTxs: [],
    txs: [],
    zeroConfirmBal: this.props.zeroConfirmBal,
    sixConfirmBal: this.props.sixConfirmBal
  };

  render() {
    const { Header, Row, HeaderCell, Body, Cell } = Table;
    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"
          />
        </Head>
        <h1>Dugong's Bitcoin Watch</h1>
        <div>
          현재 블록 : {this.state.currentBlock}{' '}
          <a href={'https://testnet.blockchain.info/'} target="_blank">
            (Testnet3)
          </a>
        </div>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Address</HeaderCell>
              <HeaderCell>Balance: 6 Confirmation</HeaderCell>
              <HeaderCell>Balance: 0 Confirmation</HeaderCell>
            </Row>
          </Header>
          <Body>
            <Row>
              <Cell>{address}</Cell>
              <Cell>{roundToDecimals(8, this.state.sixConfirmBal)}</Cell>
              <Cell>{roundToDecimals(8, this.state.zeroConfirmBal)}</Cell>
            </Row>
          </Body>
        </Table>

        <h3>Unconfirmed Tx</h3>

        <Table>
          <Header>
            <Row>
              <HeaderCell>Transaction Hash</HeaderCell>
              <HeaderCell>From</HeaderCell>
              <HeaderCell>To</HeaderCell>
              <HeaderCell>Amount(BTC)</HeaderCell>
              <HeaderCell>Fee(BTC)</HeaderCell>
              <HeaderCell>Confirmations</HeaderCell>
              <HeaderCell>Received Time</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow(this.state.unconfirmedTxs, address)}</Body>
        </Table>

        <h3>Confirmed Tx</h3>

        <Table>
          <Header>
            <Row>
              <HeaderCell>Transaction Hash</HeaderCell>
              <HeaderCell>From</HeaderCell>
              <HeaderCell>To</HeaderCell>
              <HeaderCell>Amount(BTC)</HeaderCell>
              <HeaderCell>Fee(BTC)</HeaderCell>
              <HeaderCell>Confirmations</HeaderCell>
              <HeaderCell>Confirmed Time</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow(this.state.txs, address)}</Body>
        </Table>
      </Container>
    );
  }
}
export default BitcoinWatch;
