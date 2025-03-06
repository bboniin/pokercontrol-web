import React from 'react';

import { Container } from './styles';
import loader from '../../assets/loading.gif';
import loaderWhite from '../../assets/loadingWhite.gif';

const Loader = ({white, size}) => (
  <Container>
    <div>
      <img src={white ? loaderWhite : loader} alt="loader" style={size ? {width: size, height: size}: {}}/>
    </div>
  </Container>
);

export default Loader;
