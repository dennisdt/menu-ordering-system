import React, { Component } from 'react';
import { Button } from 'react-materialize';
import Icon from 'react-icons-kit';
import { facebook } from 'react-icons-kit/entypo/facebook';
import './PassportLogin.css';


class FacebookLogin extends Component {
  render(){
    return(
      <div className="section center">
        <a href="auth/facebook">
          <button className="waves-effect waves-light btn blue accent-4">
            <div className="icon_text_container">
              <div className="icon_container">
                <Icon icon={facebook} className="facebook_icon" />
              </div>
              <div >
                <span className="facebook_login_text">Login with Facebook</span>
              </div>
            </div>
          </button>
        </a>
      </div>
    );
  }
}

export default FacebookLogin;
