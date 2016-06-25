import React from 'react';
import DeleteLink from './DeleteLink';

const fixValue = (number) => {
  const str = number + '';

  return str.length >= 2 ? str : '0' + str;
};

const getDateString = (date) => {
  const d = new Date(date);

  return [
    fixValue(d.getDate()),
    fixValue(d.getMonth() + 1),
    d.getFullYear()
  ].join('.');
};

const formatCellphone = (str) => {
  const [, c, d1, d2, d3] = str.match(/(\d{3})\D*(\d{3})\D*(\d{2})\D*(\d{2})/);

  return `(${c}) ${d1}-${d2}-${d3}`;
};

export default ({
  onClick,
  onDelete,
  name,
  birthdate,
  city,
  address,
  cellphone
}) => {
  const cphone = (cellphone) ? '+7 ' + formatCellphone(cellphone) : '';
  const fullAddress = [city, address].filter(str => !!str).join(', ') || '';

  return (
    <li className="contact-item" onClick={onClick}>
      <DeleteLink onDelete={onDelete} />
      <span className="row">
        <span className="field name">
          <span className="title">Name</span> {name}
        </span>
        <span className="field birthdate">
          <span className="title">Birthdate</span> {getDateString(birthdate)}
        </span>
        <span className={['field', 'cellphone', !cphone && 'empty' ].join(' ')}>
          <span className="title">Cellphone</span> {cphone}
        </span>
        <span className={['field', 'address', !fullAddress && 'empty'].join(' ')}>
          <span className="title">Address</span> {fullAddress}
        </span>
      </span>
    </li>
  );
};
