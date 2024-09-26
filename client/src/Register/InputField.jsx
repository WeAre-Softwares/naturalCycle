import React from 'react';

const InputField = ({ label, placeholder, type, className, required }) => {
  return (
    <div>
      <div className="flex-column">
        <label>{label}</label>
      </div>
      <div className="inputForm">
        <input
          placeholder={placeholder}
          className={className}
          type={type}
          required={required}
        />
      </div>
    </div>
  );
};

export default InputField;
