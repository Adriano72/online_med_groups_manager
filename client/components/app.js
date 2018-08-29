import React, { Component } from 'react';
import Header from './header';

class mainApp extends Component {

  render(props) {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default mainApp;
