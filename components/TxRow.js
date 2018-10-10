import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { roundToDecimals } from '../utils';

export default props => {
  const { Row, Cell } = Table;
  const {
    hash,
    received,
    confirmed,
    inputs,
    outputs,
    block_height,
    fees
  } = props.tx;
  const balance = outputs.reduce((acc, current) => {
    if (
      current.addresses[0] !== null &&
      current.addresses[0] === props.myAddr
    ) {
      return acc + current.value;
    }
    return acc;
  }, 0);

  const from = inputs[0].addresses[0].substr(0, 8);
  const to = outputs
    .filter(out => out.addresses[0] !== from)
    .map(out => out.addresses[0].substr(0, 8));
  return (
    <Row>
      <Cell>
        <a href={`https://testnet.blockchain.info/tx/${hash}`}>
          {hash.substr(0, 8)}
        </a>
      </Cell>
      <Cell>{from}</Cell>
      <Cell>{to.join(', \r\n')}</Cell>
      <Cell>{roundToDecimals(8, balance * 1 * 1e-8)}</Cell>
      <Cell>{roundToDecimals(8, fees * 1 * 1e-8)}</Cell>
      <Cell>
        {block_height === -1
          ? 'Unconfirmed'
          : props.currentBlock - block_height + 1}
      </Cell>
      <Cell>{confirmed ? confirmed : received}</Cell>
    </Row>
  );
};
