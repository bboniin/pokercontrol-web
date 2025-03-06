import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Main from '../components/Main';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/AuthContext';

const PrivateRoute = () => {
  const { user } = useAuth();
  
  const [isMenuMinimized, setIsMenuMinimized] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  return user ?
    (
      <>
        <Sidebar isMenuMinimized={isMenuMinimized} onChange={(e)=>{setIsMenuMinimized(e == false || !isMenuMinimized)}}/>
        <Main>
          <Header onChange={() => {
            setIsMenuMinimized(!isMenuMinimized)
          }} />
          <Outlet />
        </Main>
      </>
    ) : (
      <>
      </>
    );
};

export default PrivateRoute;
