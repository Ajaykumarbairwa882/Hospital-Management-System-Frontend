
import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const createAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/create`, adminData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const signupAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/signup`, adminData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getAdmins = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateAdminInfo = async (id, adminData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/${id}`, adminData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
