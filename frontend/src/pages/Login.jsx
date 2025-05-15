import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)]">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />

          <button type="submit" className="btn btn-neutral mt-4" disabled={isLoggingIn}>
            Login
          </button>
          
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
