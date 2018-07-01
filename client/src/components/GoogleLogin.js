import React, { Component } from 'react';
import {Button} from 'react-materialize';
import Icon from 'react-icons-kit';
import {googlePlus} from 'react-icons-kit/entypo/googlePlus';

class GoogleLogin extends Component {
  render(){
    return(
      <div className="center section">
        <a href="auth/google">
          <button className="btn waves-light light-blue darken-4 login_button">
            <div className="icon_text_container">
              <div className="icon_container">
                <Icon icon={googlePlus} />
              </div>
              <div>
                <span className="google_login_text">Login with Google</span>
              </div>
            </div>
          </button>
        </a>
      </div>
    );
  }
}

export default GoogleLogin;
