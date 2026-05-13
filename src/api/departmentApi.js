import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    "Something went wrong"
  );
};


// ================= CREATE =================

export const addDepartment = async (
  departmentData
) => {
  try {
    const response = await axios.post(
      `${API_URL}/department/create`,
      departmentData
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};


// ================= GET HOSPITAL =================

export const getHospitalDepartments =
  async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/department/hospital/${userId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= GET ALL =================

export const getAllDepartments =
  async () => {
    try {
      const response = await axios.get(
        `${API_URL}/department/all`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= GET SINGLE =================

export const getSingleDepartment =
  async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/department/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= UPDATE =================

export const updateDepartment =
  async (id, departmentData) => {
    try {
      const response = await axios.put(
        `${API_URL}/department/update/${id}`,
        departmentData
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= SOFT DELETE =================

export const softDeleteDepartment =
  async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/department/soft-delete/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= RESTORE =================

export const restoreDepartment =
  async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/department/restore/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };


// ================= HARD DELETE =================

export const hardDeleteDepartment =
  async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/department/hard-delete/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        {
          cause: error,
        }
      );
    }
  };