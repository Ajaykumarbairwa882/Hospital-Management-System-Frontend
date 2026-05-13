import { useState } from "react";

function AddHospital({ states = [], districts = [], cities = [], loading, onSubmit }) {
  const [formData, setFormData] = useState({
    hospitalName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    district: "",
    city: "",
  });

  const activeStates = states.filter((state) => state.status === "active");
  const activeDistricts = districts.filter((district) => {
    const stateId = district.state?._id || district.state;
    return district.status === "active" && stateId === formData.state;
  });
  const activeCities = cities.filter((city) => {
    const districtId = city.district?._id || city.district;
    return city.status === "active" && districtId === formData.district;
  });

  const updateField = (field, value) => {
    setFormData((oldData) => {
      const nextData = {
        ...oldData,
        [field]: value,
      };

      if (field === "state") {
        nextData.district = "";
        nextData.city = "";
      }

      if (field === "district") {
        nextData.city = "";
      }

      return nextData;
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    const hospitalData = {
      hospitalName: formData.hospitalName,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
    };

    onSubmit(hospitalData);
  };

  return (
    <form className="authForm" onSubmit={submitForm}>
      <label>Hospital Name</label>
      <input
        required
        value={formData.hospitalName}
        onChange={(event) => updateField("hospitalName", event.target.value)}
        placeholder="Enter hospital name"
      />

      <label>Name</label>
      <input
        required
        value={formData.name}
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Enter owner name"
      />

      <label>Email</label>
      <input
        required
        type="email"
        value={formData.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="Enter email"
      />

      <label>Phone</label>
      <input
        required
        value={formData.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        placeholder="Enter phone"
      />

      <label>Address</label>
      <textarea
        required
        value={formData.address}
        onChange={(event) => updateField("address", event.target.value)}
        placeholder="Enter address"
      />

      <label>State</label>
      <select
        required
        value={formData.state}
        onChange={(event) => updateField("state", event.target.value)}
      >
        <option value="">Select state</option>
        {activeStates.map((state) => (
          <option value={state._id} key={state._id}>
            {state.stateName}
          </option>
        ))}
      </select>

      <label>District</label>
      <select
        required
        value={formData.district}
        onChange={(event) => updateField("district", event.target.value)}
      >
        <option value="">Select district</option>
        {activeDistricts.map((district) => (
          <option value={district._id} key={district._id}>
            {district.districtName}
          </option>
        ))}
      </select>

      <label>City</label>
      <select
        required
        value={formData.city}
        onChange={(event) => updateField("city", event.target.value)}
      >
        <option value="">Select city</option>
        {activeCities.map((city) => (
          <option value={city._id} key={city._id}>
            {city.cityName}
          </option>
        ))}
      </select>

      <button className="authBtn" disabled={loading}>
        {loading ? "Please wait..." : "Add Hospital"}
      </button>
    </form>
  );
}

export default AddHospital;
