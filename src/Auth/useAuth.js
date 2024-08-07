import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (!isTokenExpired) {
          setIsLoggedIn(true);
          setToken(storedToken);
        } else {
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
        }
      } catch (e) {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logIn = (newToken) => {
    localStorage.setItem('jwt', newToken);
    const decodedToken = jwtDecode(newToken);
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    if (!isTokenExpired) {
      setIsLoggedIn(true);
      setToken(newToken);
    }
  };

  const logOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setToken(null);
  };

  return { isLoggedIn, logIn, logOut, token };
};

export default useAuth;
