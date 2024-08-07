import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');

    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      setUsername(storedUsername || '');
      setUserId(storedUserId || null);
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserId(null);
    }
  }, []);

  const logIn = (user) => {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('username', user.username);
    localStorage.setItem('user_id', user.id);

    setIsLoggedIn(true);
    setUsername(user.username);
    setUserId(user.id);
  };

  const logOut = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');

    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
  };

  return { isLoggedIn, username, userId, logIn, logOut };
};

export default useAuth;
