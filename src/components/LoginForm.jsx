import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginForm({ role = "user" }) {
  const [form, setForm] = useState({ id: "", place: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    if (!form.id.trim()) newErrors.id = "ID is required";
    if (role === "authority" && !form.place.trim()) newErrors.place = "Place is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    let snapshot;

    if (role === "user") {
      const q = query(
        collection(db, "users"),
        where("id", "==", form.id),
        where("role", "==", "user")
      );
      snapshot = await getDocs(q);
    } else if (role === "authority") {
      const q = query(
        collection(db, "authority"),
        where("authorityId", "==", form.id),
        where("place", "==", form.place),
        where("role", "==", "authority")
      );
      snapshot = await getDocs(q);
    }

    if (!snapshot.empty) {
  const userData = snapshot.docs[0].data();
  localStorage.setItem("safevoyage_current", JSON.stringify(userData));
  
  // Navigate based on role
  if (role === "user") {
    navigate("/home");
  } else if (role === "authority") {
    navigate("/authoritydashboard");
  }
} else {
  alert("Login failed. Check your credentials or register first.");
}

  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          {role === "user" ? "Blockchain ID" : "Authority ID"}
        </label>
        <input
          name="id"
          value={form.id}
          onChange={handleChange}
          placeholder={role === "user" ? "SV-XXXX..." : "AUTH-XXXX..."}
          className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 
            text-white border-2 focus:outline-none transition duration-300
            ${errors.id ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
        />
        {errors.id && <p className="mt-1 text-sm text-red-500">{errors.id}</p>}
      </div>

      {role === "authority" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Host Place</label>
          <input
            name="place"
            value={form.place}
            onChange={handleChange}
            placeholder="Enter host place"
            className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 
              text-white border-2 focus:outline-none transition duration-300
              ${errors.place ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
          />
          {errors.place && <p className="mt-1 text-sm text-red-500">{errors.place}</p>}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-2xl shadow-lg transition duration-300"
      >
        Login
      </button>
    </form>
  );
}
