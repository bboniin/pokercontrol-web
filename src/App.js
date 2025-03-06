import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './hooks/AuthContext';

import Router from './routes';
import GlobalStyles from './styles/global';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
        // Seed Token
        colorPrimary: '#00c281',
        colorPrimaryHover: "#333",
        borderRadius: 2,
        colorFill: '#001B22',
        colorIcon: '#001B22',
        colorBgContainer: '#fff',
      },
      components: {
        Button: {
          colorPrimary: '#00c281',
          colorPrimaryHover: "#00c281CC",
          boxShadow: 0
        },
        Input: {
          lineWidthFocus: 1,
        }
      },
    }}>
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
      <GlobalStyles />
      <ToastContainer autoClose={3000} />
    </ConfigProvider>
  );
}

export default App;
