import axios from "axios";

export const addCompany = async (fields) => {
  const res = await axios.post("http://localhost:4000/company/signup", fields);
  return res.data;
};

export const getCompany = async (fields) => {
  const { data } = await axios.post(
    "http://localhost:4000/company/login",
    fields
  );
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

export const getAllCompanys = async () => {
  const res = await axios.get("http://localhost:4000/company/");
  return res.data.companys;
};

export const getCompanyById = async (id) => {
  if (id) {
    const res = await axios.post("http://localhost:4000/company/" + id);
    return res.data.company;
  }
};

export const requestCompanyResetPassword = async (email) => {
  const { data } = await axios.post(
    "http://localhost:4000/company/resetPasswordRequest",
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

export const companyPasswordReset = async (fields) => {
  const { data } = await axios.post(
    "http://localhost:4000/company/passwordReset",
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
