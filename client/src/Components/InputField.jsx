import React from 'react';

export const InputField = ({
  label,
  type,
  placeholder,
  icon,
  register,
  error,
}) => {
  return (
    <div className="flex-column-login">
      <label>{label}</label>
      <div className="inputForm-login">
        {icon}
        <input
          {...register}
          placeholder={placeholder}
          className="input-login"
          type={type}
        />
        {/* TODO: FIX Desing error */}
        {error && <p style={{ color: 'red' }}>{error.message}</p>}{' '}
      </div>
    </div>
  );
};
