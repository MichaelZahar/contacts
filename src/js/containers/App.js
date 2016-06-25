import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContactList from './ContactList';
import AddContact from './AddContact';
import { toggleMobileVisibilityMod, toggleEditMod } from '../actions';

const mapStateToProps = (state) => {
  return {
    app: state.app,
    form: state.form,
    contacts: state.contacts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleMobileVisibilityMod: () => dispatch(toggleMobileVisibilityMod()),
    onToggleEditMod: () => dispatch(toggleEditMod())
  };
};

/**
 * @class
 * @extends React.Component
 */
class App extends Component {
  render() {
    const {
      app: { mobileVisibilityMod, editMod },
      contacts,
      onToggleEditMod,
      onToggleMobileVisibilityMod
    } = this.props;
    const contactsContainerClassName = [
      'contacts-container',
      mobileVisibilityMod ? 'visible' : 'hidden',
      editMod ? 'editable' : ''
    ].join(' ');

    return (
      <div className="app-container">
        <div className={contactsContainerClassName}>
          <div className="contacts-add">
            <AddContact fields={['name', 'birthdate', 'cellphone', 'city', 'address']} />
          </div>
          <div className="contacts-list">
            <header>
              <button className="add" onClick={e => {
                e.preventDefault();
                onToggleMobileVisibilityMod();
              }}>new</button>
              <button className="edit" onClick={e => {
                e.preventDefault();
                onToggleEditMod();
              }}>Edit</button>
              <h1>Contacts</h1>
            </header>
            <ContactList contacts={contacts} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
