import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContactForm from '../components/ContactForm';
import {
  addContact,
  resetFormFields,
  toggleMobileVisibilityMod,
  updateContact,
  updateFormFields
} from '../actions';
import { saveForm } from '../utils/localStorage';

import '../../styles/add-contact.styl';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(data) {
      dispatch(updateFormFields(data));
    },

    onSubmit(formData, reset) {
      const action = formData.id ? updateContact : addContact;

      dispatch(
        action(
          formData,
          () => {
            dispatch(resetFormFields());
            reset();
          }
        )
      );
    },

    onReset() {
      dispatch(resetFormFields());
      dispatch(toggleMobileVisibilityMod(false));
    }
  };
};

class AddContact extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    saveForm(nextProps.form);
  }

  render() {
    const { form: { fields, error }, onChange, onSubmit, onReset } = this.props;

    return (
      <ContactForm
        data={fields}
        error={error}
        onSubmit={onSubmit}
        onChange={onChange}
        onReset={onReset}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddContact);
