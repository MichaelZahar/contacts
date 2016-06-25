import { CONTACT_ADD, CONTACT_UPDATE } from '../constants';

export default (state, action) => {
  let data;

  switch (action.type) {
  case CONTACT_ADD:
    data = action.payload;

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      city: data.city,
      birthdate: data.birthdate,
      cellphone: data.cellphone
    };

  case CONTACT_UPDATE:
    data = action.payload;

    return {
      ...state,
      name: data.name,
      address: data.address,
      city: data.city,
      birthdate: data.birthdate,
      cellphone: data.cellphone
    };

  default:
    return state;
  }
};
