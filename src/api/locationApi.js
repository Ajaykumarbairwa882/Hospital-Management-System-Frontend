

import axios from "axios";

const API_URL = "http://localhost:3000";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const getStates = async () => {
  try {
    const response = await axios.get(`${API_URL}/locations/states`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getDistricts = async () => {
  try {
    const response = await axios.get(`${API_URL}/locations/districts`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const getCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/locations/cities`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const addState = async (stateName) => {
  try {
    const response = await axios.post(`${API_URL}/locations/states`, {
      country: "India",
      stateName,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateState = async (id, stateName) => {
  try {
    const response = await axios.put(`${API_URL}/locations/states/${id}`, {
      country: "India",
      stateName,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const addDistrict = async (districtName, state) => {
  try {
    const response = await axios.post(`${API_URL}/locations/districts`, {
      districtName,
      state,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateDistrict = async (id, districtName, state) => {
  try {
    const response = await axios.put(`${API_URL}/locations/districts/${id}`, {
      districtName,
      state,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const addCity = async (cityName, district) => {
  try {
    const response = await axios.post(`${API_URL}/locations/cities`, {
      cityName,
      district,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateCity = async (id, cityName, district) => {
  try {
    const response = await axios.put(`${API_URL}/locations/cities/${id}`, {
      cityName,
      district,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateStateStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/locations/states/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const deleteState = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/locations/states/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateDistrictStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/locations/districts/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const deleteDistrict = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/locations/districts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const updateCityStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/locations/cities/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export const deleteCity = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/locations/cities/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};
