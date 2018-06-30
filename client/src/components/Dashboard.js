import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './FoodMenu';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/foodmenu" component={FoodMenu} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(Dashboard);