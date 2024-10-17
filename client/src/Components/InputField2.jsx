import React from 'react';

export const InputField = ({
  label,
  placeholder,
  type,
  className,
  register,
  error,
}) => {
  return (
    <div>
      <div className="flex-column">
        <label>{label}</label>
      </div>
      <div className="inputForm">
        <input
          {...register}
          placeholder={placeholder}
          className={className}
          type={type}
        />
        {/* TODO: FIX Desing error */}
        {error && <p style={{ color: 'red' }}>{error.message}</p>}{' '}
      </div>
    </div>
  );
};
