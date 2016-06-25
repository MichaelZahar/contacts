import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import { getContacts, getForm } from './utils/localStorage';
import { actionValidator } from './utils/validator';
import App from './containers/App';

import '../styles/index.styl';

const store = configureStore(
  {
    contacts: getContacts(),
    form: getForm()
  },
  applyMiddleware(
    actionValidator
  )
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
