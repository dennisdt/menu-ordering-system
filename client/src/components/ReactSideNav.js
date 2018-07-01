import React, { Component } from 'react';
import ReactStripeCheckout from 'react-stripe-checkout';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import './ReactSideNav.css';

import Icon from 'react-icons-kit';
import {ic_settings} from 'react-icons-kit/md/ic_settings';
import {ic_help} from 'react-icons-kit/md/ic_help';
import { ic_card_giftcard } from 'react-icons-kit/md/ic_card_giftcard';
import { logout } from 'react-icons-kit/iconic/logout';

class ReactSideNav extends Component {
  render(){
    return(
      <div className="side-nav-container">
        <SideNav highlightColor='#f6ff7c' highlightBgColor='#3b9fd6' defaultSelected='sales'>

            <Nav id='settings'>
                <NavIcon><Icon icon={ic_settings}/></NavIcon>
                <NavText> Settings </NavText>
            </Nav>

            <Nav id='help'>
                <NavIcon><Icon icon={ic_help}/></NavIcon>
                <NavText> Help </NavText>
            </Nav>
            <Nav id="stripe">

              <NavIcon><Icon icon={ic_card_giftcard}/></NavIcon>
              <NavText>
                <ReactStripeCheckout
                  amount={100}
                  token={token => console.log(token)}
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  name="Tellem Kevin"
                  description="I live off donations. Feed me!">
                    <button className="btn purple accent-1">Donate</button>
                </ReactStripeCheckout>
                </NavText>
            </Nav>

            <Nav id="logout">
              <NavIcon><Icon icon={logout}/></NavIcon>
              <NavText><a href="api/logout">Logout</a></NavText>
            </Nav>

        </SideNav>
      </div>
    );
  }
}

export default ReactSideNav;
