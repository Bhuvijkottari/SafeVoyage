import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export default function RegisterForm({ role = "user" }) {
  const [form, setForm] = useState({ name: "", phone: "", place: "", aadhaar: "" });
  const [createdId, setCreatedId] = useState(null);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // Clear error on change
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.place.trim()) errs.place = "Place is required";
    if (!form.aadhaar.trim()) errs.aadhaar = "Aadhaar number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function generateBlockchainId() {
    return (role === "user" ? "SV-" : "AUTH-") + uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase();
  }

  async function isDuplicateId(id) {
    const collectionName = role === "user" ? "users" : "authority";
    const q = query(collection(db, collectionName), where(role === "user" ? "id" : "authorityId", "==", id));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    let id;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    do {
      id = generateBlockchainId();
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        alert("Error generating unique ID. Try again.");
        return;
      }
    } while (await isDuplicateId(id));

    const newDoc = {
      ...form,
      createdAt: serverTimestamp(),
    };

    if (role === "user") {
      newDoc.id = id;
      newDoc.role = "user";
    } else if (role === "authority") {
      newDoc.authorityId = id;
      newDoc.role = "authority";
    }

    const collectionName = role === "user" ? "users" : "authority";

    try {
      await addDoc(collection(db, collectionName), newDoc);
      setCreatedId(id);
      setForm({ name: "", phone: "", place: "", aadhaar: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to register. Try again.");
    }
  }

  return (
    <div className="mt-4">
      {createdId ? (
        <div className="p-4 bg-green-50 rounded space-y-2">
          <div className="text-sm text-gray-600">Registration successful!</div>
          <div className="mt-1 font-mono text-lg bg-white inline-block px-3 py-2 rounded shadow">{createdId}</div>
          <div className="text-xs text-gray-500">
            Save this ID — use it to login.
          </div>
          <button
            onClick={() => setCreatedId(null)}
            className="mt-3 px-3 py-1 rounded bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition"
          >
            Register another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 focus:outline-none transition duration-300 ${errors.name ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 focus:outline-none transition duration-300 ${errors.phone ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="Place"
              className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 focus:outline-none transition duration-300 ${errors.place ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
            />
            {errors.place && <p className="text-xs text-red-500 mt-1">{errors.place}</p>}
          </div>

          <div>
            <input
              name="aadhaar"
              value={form.aadhaar}
              onChange={handleChange}
              placeholder="Aadhaar number"
              className={`w-full rounded-xl p-4 bg-gray-700/80 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 focus:outline-none transition duration-300 ${errors.aadhaar ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"}`}
            />
            {errors.aadhaar && <p className="text-xs text-red-500 mt-1">{errors.aadhaar}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input id="terms" type="checkbox" className="h-4 w-4" required />
            <label htmlFor="terms" className="text-sm text-gray-400 select-none">
              I agree to Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 shadow-lg transition duration-300"
          >
            Register & Generate ID
          </button>
        </form>
      )}
    </div>
  );
}
