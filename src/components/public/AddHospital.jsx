import { useState } from "react";

const emptyImage = { name: "", image: "" };

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
};

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
  const [images, setImages] = useState([{ ...emptyImage }]);

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

  const updateImageField = (index, field, value) => {
    setImages((oldImages) =>
      oldImages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateImageFile = async (index, file) => {
    if (!file) {
      updateImageField(index, "image", "");
      return;
    }

    const image = await fileToDataUrl(file);
    updateImageField(index, "image", image);
  };

  const addImageRow = () => {
    setImages((oldImages) => [...oldImages, { ...emptyImage }]);
  };

  const removeImageRow = (index) => {
    setImages((oldImages) =>
      oldImages.length === 1
        ? [{ ...emptyImage }]
        : oldImages.filter((_, itemIndex) => itemIndex !== index),
    );
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
      images: images.filter((item) => item.name.trim() && item.image),
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

      <div className="imageFields">
        <div className="imageFieldsHead">
          <label>Images</label>
          <button type="button" onClick={addImageRow}>
            +
          </button>
        </div>

        {images.map((item, index) => (
          <div className="imageRow" key={index}>
            <input
              value={item.name}
              onChange={(event) =>
                updateImageField(index, "name", event.target.value)
              }
              placeholder="Image name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => updateImageFile(index, event.target.files[0])}
            />
            <button type="button" onClick={() => removeImageRow(index)}>
              -
            </button>
          </div>
        ))}
      </div>

      <button className="authBtn" disabled={loading}>
        {loading ? "Please wait..." : "Add Hospital"}
      </button>
    </form>
  );
}

export default AddHospital;
