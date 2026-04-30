import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name?.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-crimson-700 text-white mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Welcome back</h1>
          <p className="text-stone-500 font-body text-sm mt-2">Sign in to your LifeFlow account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-body text-stone-500 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-crimson-700 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}