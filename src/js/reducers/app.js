import {
  TOGGLE_EDIT_MOD,
  TOGGLE_MOBILE_VISIBILITY_MOD
} from '../constants';

const emptyState = {
  editMod: false,
  mobileVisibilityMod: false
};

export default (state = { ...emptyState }, action) => {
  switch (action.type) {
  case TOGGLE_EDIT_MOD:
    const editMod = (action.payload !== undefined) ? action.payload : !state.editMod;

    return {
      ...state,
      editMod
    };

  case TOGGLE_MOBILE_VISIBILITY_MOD:
    const mobileVisibilityMod = (action.payload !== undefined) ? action.payload : !state.mobileVisibilityMod;

    return {
      ...state,
      mobileVisibilityMod
    };

  default:
    return state;
  }
};
