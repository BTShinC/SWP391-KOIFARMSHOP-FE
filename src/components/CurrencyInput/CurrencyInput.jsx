import React from 'react';
import { Input } from 'antd';

const CurrencyInput = ({ value, onChange, ...props }) => {
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const numbers = inputValue.replace(/\D/g, '');
    
    if (numbers || inputValue === '') {
      onChange(numbers);
    }
  };

  const formatNumber = (val) => {
    if (!val) return '';
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Input
      {...props}
      onChange={handleChange}
      value={formatNumber(value)}
    />
  );
};

export default CurrencyInput;