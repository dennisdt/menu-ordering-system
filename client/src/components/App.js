import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';


import Header from './Header';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';


class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  renderContent(){
    switch(this.props.auth) {
      case null:
      case false:
        return (
          <div>
            <Dashboard />
          </div>
        );
      default:
        return;
    }
  }

  render() {
    return (
      <div className="container blue-grey lighten-5">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={ LandingPage } />
            <Route exact path="/" component={ LoginPage } />
            <Route exact path="/home" component={ Dashboard } />
          </div>
        </BrowserRouter>
      </div>
    );
  }
};

function mapStateToProps(state){
  return { auth: state.auth }
}

export default connect(mapStateToProps, actions)(App);
