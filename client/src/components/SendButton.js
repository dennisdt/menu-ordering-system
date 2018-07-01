import React, { Component } from 'react';

class SendButton extends Component {
  render(){
    return(
      <div className="center section">
        <button className="btn-large light-blue waves-effect waves-light" type="submit" name="action">
          Send Message
          <i className="material-icons right">send</i>
        </button>
      </div>
    );
  }
}

export default SendButton;
