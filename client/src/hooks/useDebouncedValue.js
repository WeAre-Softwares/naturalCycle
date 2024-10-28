import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export const useDebouncedValue = (value, delay = 600) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    // Llama al debounce
    handler();

    // Limpia el debounce al desmontar o cambiar el valor
    return () => handler.cancel();
  }, [value, delay]);

  return debouncedValue;
};
