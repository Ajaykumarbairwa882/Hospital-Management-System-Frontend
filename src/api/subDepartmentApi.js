// subDepartmentApi.js

import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    "Something went wrong"
  );
};

// ================= CREATE =================

export const addSubDepartment = async (subDepartmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/sub-department/create`,
      subDepartmentData
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= GET HOSPITAL =================

export const getHospitalSubDepartments = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/sub-department/hospital/${userId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= GET ALL =================

export const getAllSubDepartments = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/sub-department/all`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= GET SINGLE =================

export const getSingleSubDepartment = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/sub-department/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= UPDATE =================

export const updateSubDepartment = async (
  id,
  subDepartmentData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/sub-department/update/${id}`,
      subDepartmentData
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= SOFT DELETE =================

export const softDeleteSubDepartment = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/sub-department/soft-delete/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= RESTORE =================

export const restoreSubDepartment = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/sub-department/restore/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

// ================= HARD DELETE =================

export const hardDeleteSubDepartment = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/sub-department/hard-delete/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
