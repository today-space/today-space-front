import { Cookies } from "react-cookie";

const cookie = new Cookies();

export const removeCookie = (name) => {
  return cookie.remove(name, { path: "/" });
};