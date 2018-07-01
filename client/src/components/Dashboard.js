import React, { Component } from 'react';
import { connect } from 'react-redux';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import MessageBubble from './MessageBubble';
import AudioButton from './AudioButton';
import SendButton from './SendButton';


class Dashboard extends Component {

  renderContent( ) {
    switch(this.props.auth) {
      case false:
        return (
          <div>
            <LandingPage />
            <LoginPage />
          </div>
        );
      default:
        return (
          <div>
            <MessageBubble />
            <AudioButton />
            <SendButton />
          </div>
        );
    }
  }

  render(){
    return(
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {auth: state.auth}
}

export default connect(mapStateToProps)(Dashboard);
