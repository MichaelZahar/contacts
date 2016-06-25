/* eslint no-console: 0 */
const contacts = 'CONTACTS_LIST';
const form = 'CONTACTS_FORM';

const getJSON = (key) => {
  const stringData = localStorage[key];

  if (stringData) {
    try {
      return JSON.parse(stringData);
    } catch (error) {
      console.log(error);
    }
  }

  return undefined;
};

export const getContacts = () => getJSON(contacts);
export const getForm = () => getJSON(form);
export const saveContacts = (data) => localStorage.setItem(contacts, JSON.stringify(data));
export const saveForm = (data) => localStorage.setItem(form, JSON.stringify(data));
