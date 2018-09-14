import React, { Component } from 'react';

class BitcoinWatch extends Component {
  static async getInitialProps() {
    return { hello: 'greeting' };
  }

  componentDidMount = () => {};

  render() {
    return <div>{this.props.hello}</div>;
  }
}

export default BitcoinWatch;
