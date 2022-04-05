import axios from "axios";

export const addUser = async (fields) => {
  const res = await axios({
    method: "post",
    url: "http://localhost:4000/user/signup",
    data: fields,
  });
  return res.data;
};

export const getUser = async (fields) => {
  const res = await axios.post("http://localhost:4000/user/login", fields);
  return res.data;
};
