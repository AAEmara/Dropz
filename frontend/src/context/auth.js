import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  role: null,
  loading: true,
  login: () => {},
  logout: () => {}
});
