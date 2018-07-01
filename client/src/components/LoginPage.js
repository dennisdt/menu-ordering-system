import React, { Component } from 'react';
import { connect } from 'react-redux';
import FacebookLogin from './FacebookLogin';

class LoginPage extends Component {

  renderContent() {
    switch(this.props.auth) {
      case null:
      case false:
        return (
          <div>
            <FacebookLogin />
          </div>
        );
      default:
        return;
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

function mapStateToProps(state) {
  return {auth: state.auth}
}

export default connect(mapStateToProps)(LoginPage);
