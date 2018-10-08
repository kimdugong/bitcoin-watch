import React, { Component } from 'react';
import { bitcoin, bitcoinInit } from '../bitcoin';
import TxRow from '../components/TxRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';

class RippleWatch extends Component {
  static async getInitialProps() {
    const address = 'mwUE1KDnJ3LnKxnzEbpushUt11h9H9Leh4';
    const { data } = await axios.get(
      `https://testnet.blockchain.info/q/addressbalance/${address}?confirmations=2`
    );
    const balance = data * 1 * 1e-8;
    return { address, balance };
  }

  listenBitcoin = async () => {
    bitcoin.onmessage = async event => {
      const eventData = JSON.parse(event.data);
      const eventType = eventData.op;
      switch (eventType) {
        case 'block': {
          this.setState({ currentBlock: eventData.x.height });
          return console.log('block data  : ', eventData.x);
        }
        case 'utx': {
          const hash = eventData.x.hash;
          const tx = await axios.get(
            `https://api.blockcypher.com/v1/btc/test3/txs/${hash}`
          );
          this.setState(prev => ({ txs: [tx.data, ...prev.txs] }));
          return console.log('transaction data  : ', tx.data);
        }

        default:
          return null;
      }
    };
  };

  renderRow = txs => {
    // return false;
    return txs.map(tx => (
      <TxRow
        tx={tx}
        key={tx.hash}
        myAddr={this.props.address}
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
    txs: [],
    currentLedger: this.props.ledger,
    balance: this.props.balance,
    previousAffectingTransactionLedgerVersion: this.props.address
      .previousAffectingTransactionLedgerVersion
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
        <div>
          <h1>Dugong's Bitcoin Watch</h1>
          <div>현재 블록 : {this.state.currentBlock}</div>
        </div>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Address</HeaderCell>
              <HeaderCell>Balance</HeaderCell>
            </Row>
          </Header>
          <Body>
            <Row>
              <Cell>{this.props.address}</Cell>
              <Cell>{this.state.balance}</Cell>
            </Row>
          </Body>
        </Table>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Transaction Hash</HeaderCell>
              <HeaderCell>From</HeaderCell>
              <HeaderCell>To</HeaderCell>
              <HeaderCell>Amount(btc)</HeaderCell>
              <HeaderCell>Confirmation</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow(this.state.txs)}</Body>
        </Table>
      </Container>
    );
  }
}
export default RippleWatch;
