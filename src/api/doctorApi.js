import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const addDoctor = async (doctorData) => {
  try {
    const response = await axios.post(`${API_URL}/doctor/create`, doctorData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getHospitalDoctors = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/doctor/hospital/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctor/all`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getSingleDoctor = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/doctor/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await axios.put(`${API_URL}/doctor/update/${id}`, doctorData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const softDeleteDoctor = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/doctor/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const hardDeleteDoctor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/doctor/hard-delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
