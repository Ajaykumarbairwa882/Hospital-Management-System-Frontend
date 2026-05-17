import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const createHospital = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/hospital/create`, formData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getAllHospitals = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital/all`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
export const getAllHospitalImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital/images/all`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getSingleHospital = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/hospital/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateHospitalStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/hospital/status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
