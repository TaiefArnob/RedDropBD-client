import { useState, useEffect } from "react";
import { updateProfile, getMyRequests } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RequestCard from "../components/RequestCard";
import toast from "react-hot-toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [form, setForm] = useState({
    name:             user?.name || "",
    phone:            user?.phone || "",
    location:         user?.location || "",
    bloodGroup:       user?.bloodGroup || "",
    isDonor:          user?.isDonor ?? true,
    isAvailable:      user?.isAvailable ?? true,
    lastDonationDate: user?.lastDonationDate ? user.lastDonationDate.slice(0, 10) : "",
  });

  useEffect(() => {
    if (tab === "requests") fetchMyRequests();
  }, [tab]);

  const fetchMyRequests = async () => {
    setRequestsLoading(true);
    try {
      const { data } = await getMyRequests();
      setMyRequests(data.requests);
    } catch { toast.error("Failed to load requests."); }
    finally { setRequestsLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-crimson-700 flex items-center justify-center text-white font-display font-bold text-2xl">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">{user?.name}</h1>
          <p className="text-stone-500 font-body text-sm">{user?.email}</p>
        </div>
        <div className="ml-auto">
          <span className="blood-group-tag">{user?.bloodGroup}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {["profile", "requests"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-body font-semibold transition-all capitalize ${
              tab === t ? "bg-white text-crimson-700 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}>
            {t === "requests" ? "My Requests" : "Edit Profile"}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field">
                {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="border-t border-stone-100 pt-5 space-y-3">
              <p className="text-sm font-body font-semibold text-stone-700">Donor Settings</p>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isDonor ? "bg-crimson-600" : "bg-stone-300"}`}
                  onClick={() => setForm({ ...form, isDonor: !form.isDonor })}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isDonor ? "translate-x-6" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-body text-stone-700">I am a donor</span>
              </label>
              {form.isDonor && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isAvailable ? "bg-emerald-500" : "bg-stone-300"}`}
                      onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-body text-stone-700">
                      {form.isAvailable ? "Available to donate" : "Not available"}
                    </span>
                  </label>
                  <div>
                    <label className="block text-sm font-body font-medium text-stone-700 mb-1.5">Last Donation Date</label>
                    <input type="date" name="lastDonationDate" value={form.lastDonationDate}
                      onChange={handleChange} className="input-field" />
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {tab === "requests" && (
        <div>
          {requestsLoading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-crimson-200 border-t-crimson-700 rounded-full animate-spin" />
            </div>
          )}
          {!requestsLoading && myRequests.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-stone-500 font-body">You haven't posted any blood requests yet.</p>
            </div>
          )}
          {!requestsLoading && myRequests.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-5">
              {myRequests.map((r) => <RequestCard key={r._id} request={r} onUpdate={fetchMyRequests} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}