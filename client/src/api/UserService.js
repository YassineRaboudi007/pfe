import axios from "axios";

export const addUser = async (fields) => {
  const { data } = await axios({
    method: "post",
    url: "http://localhost:4000/user/signup",
    data: fields,
  });

  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return {
      status: "success",
      msg: "User Added Successfully",
      token: data,
    };
  }
};

export const getUser = async (fields) => {
  const { data } = await axios.post("http://localhost:4000/user/login", fields);
  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return {
      status: "success",
      msg: "Logged In Successfully",
      token: data,
    };
  }
};

export const getUserById = async (id) => {
  const { data } = await axios.post("http://localhost:4000/user/" + id);
  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return data;
  }
};

export const requestUserResetPassword = async (email) => {
  const { data } = await axios.post(
    "http://localhost:4000/user/resetPasswordRequest",
    { email }
  );
  console.log("data ", data);
  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return {
      status: "success",
      msg: "Email Sent Successfully",
      token: data,
    };
  }
};

export const userPasswordReset = async (fields) => {
  const { data } = await axios.post(
    "http://localhost:4000/user/passwordReset",
    fields
  );
  console.log("data ", data);
  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return {
      status: "success",
      msg: "Password Reset Successfully",
      token: data,
    };
  }
};

export const updateUser = async (fields) => {
  const { data } = await axios.put("http://localhost:4000/user/update", fields);
  if (data.err) {
    return { status: "error", msg: data.err };
  } else {
    return {
      status: "success",
      msg: "Account Update Successfully",
      token: data,
    };
  }
};
