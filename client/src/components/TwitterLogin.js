import React, { Component } from 'react';
import { Button } from 'react-materialize';
import Icon from 'react-icons-kit';
import {twitter} from 'react-icons-kit/entypo/twitter';
import './PassportLogin.css';


class TwitterLogin extends Component {
  render(){
    return(
      <div className="section center">
        <a href="auth/twitter">
          <button className="btn waves-light light-blue lighten-3 login_button" >
            <div className="icon_text_container" >
              <div className="icon_container">
                <Icon icon={twitter} className="twitter_icon"/>
              </div>
              <div>
                 <span className="twitter_login_text">Login with Twitter</span>
              </div>
            </div>
          </button>
        </a>
      </div>
    );
  }
}

export default TwitterLogin;
