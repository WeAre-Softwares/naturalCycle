export const preventFormSubmitOnEnter = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};
