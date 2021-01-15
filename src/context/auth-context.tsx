import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: '',
  userName: null,
  userEmail: '',
  userRole: null,
  token: '',
  isNewUser: false,
  login: (uid: any, uname: any, uemail: any, urole:any, isnewuser: any,token: any, expirationDate?: any) => {},
  logout: () => {}
});
