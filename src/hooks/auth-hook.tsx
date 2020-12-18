import { useState, useCallback, useEffect } from 'react';

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
  const [token, setToken] = useState<any>(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<any>();
  const [userId, setUserId] = useState<any>(null);
  const [userName, setuserName] = useState<any>(false);
  const [userEmail, setuserEmail] = useState<any>(false);
  const [userRole, setuserRole] = useState<any>(false);
  const [newuser, setnewUser] = useState<any>(false);
  const userObjectKEY = 'userData';

  const login = useCallback((uid: any, uname: any, uemail: any, urole: any, isnewuser: boolean,token: any, expirationDate: any) => {
   
    setToken(token);
    setUserId(uid);
    setuserName(uname);
    setuserEmail(uemail);
    setuserRole(urole);
    setnewUser(isnewuser);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
        userObjectKEY,
      JSON.stringify({
        userId: uid,
        userName: uname,
        userEmail: uemail,
        userRole: urole,
        newUser: isnewuser,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setuserName(null);
    setuserEmail(null);
    setuserRole(null);
    setnewUser(false);
    localStorage.removeItem(userObjectKEY);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
      
    const userStored: any = localStorage.getItem(userObjectKEY);
    const storedData = JSON.parse(userStored);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.userName, storedData.uemail, storedData.userRole, storedData.newUser, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId, userName, userEmail, userRole, newuser };
};