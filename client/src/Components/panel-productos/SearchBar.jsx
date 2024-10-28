import React from 'react';

export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder="Buscar por nombre"
      className="buscar-producto-input"
    />
  );
};
