import React from 'react';

const InputField = ({ label, type, placeholder, icon }) => {
  return (
    <div className="flex-column-login">
      <label>{label}</label>
      <div className="inputForm-login">
        {icon}
        <input placeholder={placeholder} className="input-login" type={type} />
      </div>
    </div>
  );
};

export default InputField;
