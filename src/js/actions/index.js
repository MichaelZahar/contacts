import {
  validateStringLength,
  validateDate,
  validateRussianCellphone
} from '../utils/validator';
import {
  CONTACT_ADD,
  CONTACT_REMOVE,
  CONTACT_UPDATE,
  FORM_SET_FIELDS,
  FORM_RESET_FIELDS,
  FORM_UPDATE_FIELDS,
  TOGGLE_EDIT_MOD,
  TOGGLE_MOBILE_VISIBILITY_MOD
} from '../constants';

const validator = {
  name: {
    func: (name) => {
      return validateStringLength(name, 2, 100, true);
    },
    msg: 'Name id required and must contain 2 - 100 chars.'
  },
  birthdate: {
    func: (birthdate) => {
      return validateDate(birthdate, new Date('01/01/1900'), new Date());
    },
    msg: 'Invalid birthday data.'
  },
  cellphone: {
    func: (cellphone) => {
      return !cellphone || validateRussianCellphone(cellphone);
    },
    msg: 'Invalid phone number. Please use only correct russian cellphone numbers.'
  }
};

export const addContact = (data, success, failure) => {
  return {
    type: CONTACT_ADD,
    payload: {
      id: Date.now(),
      name: data.name,
      birthdate: data.birthdate,
      city: data.city,
      address: data.address,
      cellphone: data.cellphone
    },
    meta: {
      validator,
      success,
      failure
    }
  };
};

export const updateContact = (data, success, failure) => {
  return {
    type: CONTACT_UPDATE,
    payload: data,
    meta: {
      validator,
      success,
      failure
    }
  };
};

export const removeContact = (contactId) => {
  return {
    type: CONTACT_REMOVE,
    payload: contactId
  };
};

export const setFormFields = (data) => {
  return {
    type: FORM_SET_FIELDS,
    payload: data
  };
};

export const updateFormFields = (data) => {
  return {
    type: FORM_UPDATE_FIELDS,
    payload: data,
    meta: {
      validator,
      weakValidation: true
    }
  };
};

export const resetFormFields = () => {
  return {
    type: FORM_RESET_FIELDS,
    payload: {}
  };
};

export const toggleEditMod = (value) => {
  const action = {
    type: TOGGLE_EDIT_MOD
  };

  if (value !== undefined) {
    action.payload = value;
  }

  return action;
}
;
export const toggleMobileVisibilityMod = (value) => {
  const action = {
    type: TOGGLE_MOBILE_VISIBILITY_MOD
  };

  if (value !== undefined) {
    action.payload = value;
  }

  return action;
};
