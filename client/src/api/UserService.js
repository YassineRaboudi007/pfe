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
  try {
    const res = await axios.post("http://localhost:4000/user/login", fields);
    if (res.data === "Invalid Credentials") return false;
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
