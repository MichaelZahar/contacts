import { combineReducers } from 'redux';
import app from './app';
import contacts from './contacts';
import form from './form';

export const rootReducer = combineReducers({
  app,
  contacts,
  form
});
