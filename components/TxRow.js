import React from 'react';
import { Table, Button } from 'semantic-ui-react';

export default children => {
  const { Row, Cell } = Table;
  const { hash, time, inputs, outputs, confirmations } = children.tx;
  console.log('outputs    :   ', outputs);

  const balance = outputs.reduce((acc, current) => {
    if (current.addresses[0] === children.myAddr) {
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
      <Cell>{balance * 1 * 1e-8}</Cell>
      <Cell>{confirmations}</Cell>
    </Row>
  );
};
