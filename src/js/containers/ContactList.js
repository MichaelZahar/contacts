import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContactItem from '../components/ContactItem';
import {
  removeContact,
  setFormFields,
  toggleMobileVisibilityMod
} from '../actions';
import { saveContacts } from '../utils/localStorage';

import '../../styles/contact-list.styl';

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onOpen(contactId) {
      const contact = ownProps.contacts.filter(c => c.id === contactId)[0];

      if (contact) {
        dispatch(setFormFields(contact));
        dispatch(toggleMobileVisibilityMod(true));
      }
    },

    onDelete(contactId) {
      dispatch(removeContact(contactId));
    }
  };
};

class ContactList extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired,
    onOpen: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    saveContacts(nextProps.contacts);
  }

  render() {
    const { contacts, onOpen, onDelete } = this.props;

    if (contacts.length === 0) {
      return (
        <p className="contacts-empty-list">You don't have any contacts yet.</p>
      );
    }

    return (
      <div className="list-container">
        <ul className="header">
          <li><span className="field name">Name</span></li>
          <li><span className="field birthdate">Birthdate</span></li>
          <li><span className="field cellphone">Cellphone</span></li>
          <li><span className="field address">Address</span></li>
        </ul>
        <ul>
          {contacts.map(item => (
            <ContactItem
              key={item.id}
              {...item}
              onClick={() => onOpen(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactList);
