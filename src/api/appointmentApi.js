import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};


export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/appointment/create`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};


export const getUserAppointments = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/appointment/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getDoctorAppointments = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/appointment/doctor/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const approveAppointment = async (appointmentId) => {
  try {
    const response = await axios.put(
      `${API_URL}/appointment/approve/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
