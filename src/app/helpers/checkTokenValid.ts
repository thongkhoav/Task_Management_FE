import { jwtDecode } from 'jwt-decode';

const checkTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;
  const decodedToken = jwtDecode(token);
  const currentTime = (new Date().getTime() - 5000) / 1000;
  if (decodedToken.exp === undefined || decodedToken.exp < currentTime) {
    return false;
  }
  return true;
};
export default checkTokenValid;
