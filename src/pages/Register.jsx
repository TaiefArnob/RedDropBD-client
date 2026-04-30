import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", bloodGroup: "", location: "", phone: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success("Account created! Welcome to LifeFlow.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800">Create Your Account</h1>
          <p className="text-stone-500 font-body text-sm mt-2">Join the LifeFlow donor network</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="input-field" placeholder="Taief Arnob" required />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="01XXXXXXXXX" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="Min. 6 characters" required />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                  className="input-field" required>
                  <option value="">Select group</option>
                  {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  className="input-field" placeholder="Dhaka, Mirpur" required />
              </div>
            </div>

            <div className="flex items-start gap-3 bg-crimson-50 rounded-xl p-4 border border-crimson-100">
              <svg className="w-5 h-5 text-crimson-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-stone-600 font-body">
                You'll be registered as a donor by default. You can update your availability anytime from your profile.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-body text-stone-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-crimson-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}