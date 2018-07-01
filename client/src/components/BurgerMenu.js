import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Stripe from './Stripe';
import './BurgerMenu.css';

import Icon from 'react-icons-kit';
import {ic_settings} from 'react-icons-kit/md/ic_settings';
import {ic_home} from 'react-icons-kit/md/ic_home';
import {ic_help} from 'react-icons-kit/md/ic_help';
import { ic_card_giftcard } from 'react-icons-kit/md/ic_card_giftcard';
import { logout } from 'react-icons-kit/iconic/logout';


class BurgerMenu extends Component {
  render(){
    return(
      <div>
        <Menu width={ '200px' }  >
          <a id="home" className="menu-item" href="/home">
            <Icon icon={ic_home} className="icon"/>
            Home
          </a>

          <a id="help" className="menu-item" href="/help">
            <Icon icon={ic_help} className="icon" />
            Help
          </a>

          <a id="settings" className="menu-item" href="/home">
            <Icon icon={ic_settings} className="icon" />
            Settings
          </a>

          <a id="logout" className="menu-item" href="/api/logout">
          <Icon icon={logout} className="icon" />
          Logout
          </a>

          <Stripe className="menu-item" />

        </Menu>
      </div>
    );
  }
}

export default BurgerMenu;
