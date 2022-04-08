import jwt_decode from "jwt-decode";

export const getRoleFromJWT = (jwt) => {
  if (jwt) return jwt_decode(jwt).role;
};

export const getCompanyIdFromJWT = (jwt) => {
  console.log(jwt);
};
