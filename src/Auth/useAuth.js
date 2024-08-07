import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logIn = () => {
    localStorage.setItem('auth', 'true');
    setIsLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('auth');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, logIn, logOut };
};

export default useAuth;
