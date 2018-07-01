import React, { Component } from 'react';

class AudioButton extends Component {
  render(){
    return(
      <div className="center section">
        <a className="btn-floating btn-large waves-effect waves-light blue">
          <i className="material-icons">volume_up</i>
        </a>
      </div>
    );
  }
}

export default AudioButton;
