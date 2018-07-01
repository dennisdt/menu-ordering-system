import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BurgerMenu from './BurgerMenu';
// hello
import './Nav.css';

class Header extends Component {

  renderContent() {
    console.log("Props:", this.props);
    switch(this.props.auth) {
      case null:
        return 'Logging in...';
      case false:
        return;
      default:
        return (
          <div>
            <li>
              <div>
                <BurgerMenu />
              </div>
            </li>
          </div>
      );
    }
  }

  render() {
    return (
      <nav className="blue darken-4">
        <div>
          <ul className="left">
            {this.renderContent()}
          </ul>
          <Link to={ this.props.auth ? "/home" : "/" } className="brand-logo Center" >Let's Order!</Link>
        </div>
      </nav>
    );
  }
}


function mapStateToProps(state){
  return { auth: state.auth }
}

export default connect(mapStateToProps)(Header);
