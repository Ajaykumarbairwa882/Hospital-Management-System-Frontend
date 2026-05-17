import { useState } from "react";

function Signup({ loading, onSignup }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateField = (field, value) => {
    setFormData((oldData) => ({
      ...oldData,
      [field]: value,
    }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    onSignup(formData);
  };

  return (
    <form className="authForm" onSubmit={submitForm}>
      <label>Name</label>
      <input
        value={formData.name}
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Enter name"
      />

      <label>Email</label>
      <input
        type="email"
        value={formData.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="Enter email"
      />

      <label>Password</label>
      <input
        type="password"
        value={formData.password}
        onChange={(event) => updateField("password", event.target.value)}
        placeholder="Enter password"
      />

      <button className="authBtn" disabled={loading}>
        {loading ? "Please wait..." : "Signup"}
      </button>
    </form>
  );
}

export default Signup;
