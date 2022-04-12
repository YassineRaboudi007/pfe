import axios from "axios";

export const addCompany = async (fields) => {
  const res = await axios.post("http://localhost:4000/company/signup", fields);
  return res.data;
};

export const getCompany = async (fields) => {
  const res = await axios.post("http://localhost:4000/company/login", fields);
  return res.data;
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
