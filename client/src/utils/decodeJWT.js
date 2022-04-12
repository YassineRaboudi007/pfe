import jwt_decode from "jwt-decode";

export const getRoleFromJWT = (jwt) => {
  if (jwt) return jwt_decode(jwt).role;
};

export const getCompanyIdFromJWT = (jwt) => {
  if (jwt && jwt_decode(jwt).role === "company") return jwt_decode(jwt).id;
  return false;
};
