import { useState, useEffect } from "react";
import { getAllRequests, createRequest } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RequestCard from "../components/RequestCard";
import toast from "react-hot-toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EMPTY_FORM = {
  bloodGroup: "", hospital: "", location: "", contactName: "", contactPhone: "",
  urgency: "medium", notes: ""
};

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchRequests = async () => {
    try {
      const { data } = await getAllRequests();
      setRequests(data.requests);
    } catch {
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest(form);
      toast.success("Blood request posted!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Blood Requests</h1>
          <p className="text-stone-500 font-body mt-1">Active requests from people who need blood</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ New Request"}
          </button>
        )}
        {!user && (
          <a href="/login" className="btn-outline text-sm">Login to Post</a>
        )}
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="card mb-8 border-crimson-100 border-2">
          <h2 className="font-display font-semibold text-xl text-stone-800 mb-5">New Blood Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Blood Group Needed</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field" required>
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Urgency</label>
                <select name="urgency" value={form.urgency} onChange={handleChange} className="input-field">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Hospital Name</label>
              <input name="hospital" value={form.hospital} onChange={handleChange}
                className="input-field" placeholder="Dhaka Medical College Hospital" required />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="input-field" placeholder="Dhaka, Azimpur" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Contact Name</label>
                <input name="contactName" value={form.contactName} onChange={handleChange}
                  className="input-field" placeholder="Your name or patient's" required />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Contact Phone</label>
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                  className="input-field" placeholder="01XXXXXXXXX" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Additional Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange}
                className="input-field resize-none" rows={3} placeholder="Any important details…" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? "Posting…" : "Post Request"}
            </button>
          </form>
        </div>
      )}

      {/* Request List */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-crimson-200 border-t-crimson-700 rounded-full animate-spin" />
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-display font-semibold text-stone-700 text-xl mb-1">No active requests</h3>
          <p className="text-stone-400 font-body text-sm">Be the first to post a blood request</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((r) => (
            <RequestCard key={r._id} request={r} onUpdate={fetchRequests} />
          ))}
        </div>
      )}
    </div>
  );
}