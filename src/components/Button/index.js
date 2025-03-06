import React from 'react';

import { Container } from './styles';

const Button = ({ text, onClick }) => (
  <Container onClick={onClick}>{text}</Container>
);

export default Button;
