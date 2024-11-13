import React from 'react';

export const FormButton = ({ buttonText, disabled }) => {
  return (
    <button disabled={disabled} className="button-submit">
      {buttonText}
    </button>
  );
};
