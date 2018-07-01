import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';

import App from './components/App';
const myStore = createStore( reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={myStore}><App /></Provider>
  , document.querySelector('#root'));
