import contact from './contact';
import {
  CONTACT_ADD,
  CONTACT_REMOVE,
  CONTACT_UPDATE
} from '../constants';

export default (
  state = [],
  action
) => {
  let newContacts;
  let contactId;

  switch (action.type) {
  case CONTACT_ADD:
    newContacts = [
      contact(undefined, action),
      ...state
    ];

    return newContacts;

  case CONTACT_REMOVE:
    contactId = action.payload;
    newContacts = state.filter(item => item.id !== contactId);

    return newContacts;


  case CONTACT_UPDATE:
    contactId = action.payload.id;

    newContacts = state.map(item => {
      if (contactId === item.id) {
        return contact(item, action);
      }

      return item;
    });

    return newContacts;

  default:
    return state;
  }
};
