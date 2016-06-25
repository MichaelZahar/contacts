import {
  FORM_SET_FIELDS,
  FORM_RESET_FIELDS,
  FORM_UPDATE_FIELDS, VALIDATOR_UPDATE_ERROR
} from '../constants';

const emptyState = { fields: {}, error: {}, mobileVisibilityMod: false };

export default (state = { ...emptyState }, action) => {
  switch (action.type) {
  case FORM_SET_FIELDS:
    return {
      ...state,
      fields: action.payload,
      error: {}
    };

  case FORM_RESET_FIELDS:
    return { ...emptyState };

  case FORM_UPDATE_FIELDS:
    return {
      ...state,
      fields: {
        ...state.fields,
        ...action.payload
      }
    };

  case VALIDATOR_UPDATE_ERROR:
    return {
      ...state,
      error: {
        ...state.error,
        ...action.payload
      }
    };

  default:
    return state;
  }
};
