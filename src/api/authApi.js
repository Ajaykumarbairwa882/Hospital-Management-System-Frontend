

import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const signupUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/user/signup`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/user/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const resetPassword = async (resetToken, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/reset-password`, {
      resetToken,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
