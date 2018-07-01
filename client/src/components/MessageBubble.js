import React, { Component } from 'react';
import { Row, Col, CardPanel } from 'react-materialize';
import './MessageBubble.css';


class MessageBubble extends Component {
  render(){
    return(
      <div className="container">
        <select name="select">
          <option key={1} value="first">(714) 999-9999</option>
          <option key={2} value="second">(714) 111-1111</option>
          <option key={3} value="third">(714) 123-4567</option>
        </select>
        <div className="center">
            <CardPanel className="black-text">
                <textarea className="message-box center">
                  Write your message here!
                </textarea>
            </CardPanel>
        </div>
      </div>
    );
  }
}

export default MessageBubble;
