import { useState, useEffect } from "react";
import { getStats, getAllUsers, toggleBlockUser, deleteUser, getAllRequestsAdmin } from "../api/axios";
import toast from "react-hot-toast";

const StatCard = ({ label, value, color }) => (
  <div className="card text-center">
    <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-stone-500 font-body text-sm mt-1">{label}</p>
  </div>
);

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "requests") fetchAllRequests();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const { data } = await getStats();
      setStats(data.stats);
    } catch { toast.error("Failed to load stats."); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getAllRequestsAdmin();
      setRequests(data.requests);
    } catch { toast.error("Failed to load requests."); }
    finally { setLoading(false); }
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      await toggleBlockUser(id);
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"}.`);
      fetchUsers();
    } catch { toast.error("Action failed."); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted.");
      fetchUsers();
    } catch { toast.error("Failed to delete."); }
  };

  const TABS = ["overview", "users", "requests"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Admin Dashboard</h1>
        <p className="text-stone-500 font-body mt-1">Monitor and manage the LifeFlow platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-body font-semibold transition-all capitalize ${
              tab === t ? "bg-white text-crimson-700 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}>
            {t === "overview" ? "Overview" : t === "users" ? "Users" : "Requests"}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Users"    value={stats.totalUsers}    color="text-stone-800" />
          <StatCard label="Active Donors"  value={stats.totalDonors}   color="text-emerald-600" />
          <StatCard label="Total Requests" value={stats.totalRequests}  color="text-stone-800" />
          <StatCard label="Active Requests"value={stats.activeRequests} color="text-crimson-700" />
          <StatCard label="Blocked Users"  value={stats.blockedUsers}   color="text-red-500" />
        </div>
      )}

      {/* Users Table */}
      {tab === "users" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-100">
                {["Name", "Email", "Blood Group", "Location", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-stone-400 font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-800">{u.name}</td>
                  <td className="py-3 px-4 text-stone-500">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-crimson-100 text-crimson-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {u.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500">{u.location}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-stone-100 text-stone-600"
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                    }`}>{u.isBlocked ? "Blocked" : "Active"}</span>
                  </td>
                  <td className="py-3 px-4">
                    {u.role !== "admin" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            u.isBlocked
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}>
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && (
            <p className="text-center text-stone-400 py-8 font-body">No users found.</p>
          )}
        </div>
      )}

      {/* Requests Table */}
      {tab === "requests" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-100">
                {["Blood Group", "Hospital", "Location", "Contact", "Urgency", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-stone-400 font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-block bg-crimson-100 text-crimson-700 text-xs font-semibold px-2 py-1 rounded-full">{r.bloodGroup}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-800">{r.hospital}</td>
                  <td className="py-3 px-4 text-stone-500">{r.location}</td>
                  <td className="py-3 px-4 text-stone-500">{r.contactPhone}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      r.urgency === "critical" ? "bg-red-100 text-red-700" :
                      r.urgency === "medium"   ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>{r.urgency}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      r.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-400 text-xs">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && requests.length === 0 && (
            <p className="text-center text-stone-400 py-8 font-body">No requests found.</p>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-crimson-200 border-t-crimson-700 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}