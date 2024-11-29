import React, { useState, useEffect } from 'react';

import Layout from './layout/Layout';
import Login from './Settings/Login/Login';
import ContextShare from './assets/Context/ContextShare';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("authToken");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
    <ContextShare>  {isLoggedIn ? <Layout /> : <Login />}</ContextShare>
    </>
  );
};

export default App;

