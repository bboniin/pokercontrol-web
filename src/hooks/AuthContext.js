import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@pokercontrol:token');
    const user = localStorage.getItem('@pokercontrol:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;


      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  /**
   * SignIn
   */
  const update = useCallback(({ user }) => {
      localStorage.setItem('@pokercontrol:user', JSON.stringify(user));
      setData({ token: data.token, user: user });
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    await api.post("/session", { email, password })
    .then((response) => {
      const { user, token } = response.data;

      localStorage.setItem('@pokercontrol:token', token);
      localStorage.setItem('@pokercontrol:user', JSON.stringify(user));

      api.defaults.headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
      }
      
      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user });
      
      return true
    }).catch(({ response }) => {
      if (response) {
        if (response.data) {
          if (response.data.message) {
            toast.warn(response.data.message)
          } else {
            toast.error("Erro Interno. verifique sua conexão e tente novamente")
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente")
        }
      } else {
        toast.error("Erro Interno. verifique sua conexão e tente novamente")
      }
      return false
    })
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@pokercontrol:user');
    localStorage.removeItem('@pokercontrol:token');

    setData({});
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, update }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const contenxt = useContext(AuthContext);
  if (!contenxt) {
    throw new Error('useAuth must be used with an AuthProvider');
  }
  return contenxt;
}

export { AuthProvider, useAuth };
