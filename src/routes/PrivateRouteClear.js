import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const PrivateRouteClear = () => {
  const { user } = useAuth();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  return user ?
    (
      <Outlet />
    ) : (
      <>
      </>
    );
};

export default PrivateRouteClear;
