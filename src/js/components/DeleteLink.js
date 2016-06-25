import React from 'react';

export default ({ onDelete }) => {
  return (
    <a href="#" className="delete" onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete();
    }}>delete</a>
  );
};
