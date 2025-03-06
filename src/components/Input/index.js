import React from 'react';

import { Container } from './styles';

const Input = ({ title, icon, placeholder, value, onChange, type, white, onKeyDown}) => (
  <Container white={white}>
    {title && (
      <p white={white}>{title}</p>
    )}
    <div className={white ? "input-white" : 'input'}>
      {icon && (icon)}
      <input type={type || "text"} placeholder={placeholder} value={value} onKeyDown={(text)=>{onKeyDown(text)}} onChange={(text)=>{onChange(text)}}/>
    </div>
  </Container>
);

export default Input;
