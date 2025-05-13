import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
      <motion.form
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="fieldset-legend flex items-center justify-center">
          <h1 className="text-xl">Create your account</h1>
        </legend>

        <label className="label">Name</label>
        <input
          type="text"
          name="fullName"
          className="input"
          placeholder="Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          className="input"
          placeholder="•••••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-neutral mt-4" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Signup"}
        </button>

        <div className="text-center">
          <p className="mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Signup;
