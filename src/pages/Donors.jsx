import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchDonors } from "../api/axios";
import DonorCard from "../components/DonorCard";
import toast from "react-hot-toast";

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Donors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [bloodGroup, setBloodGroup] = useState(searchParams.get("bloodGroup") || "");
  const [location, setLocation]     = useState(searchParams.get("location") || "");

  const fetchDonors = async (bg = bloodGroup, loc = location) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (bg)  params.bloodGroup = bg;
      if (loc) params.location   = loc;
      const { data } = await searchDonors(params);
      setDonors(data.donors);
    } catch {
      toast.error("Failed to fetch donors.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if query params present
  useEffect(() => {
    if (searchParams.get("bloodGroup") || searchParams.get("location")) {
      fetchDonors(searchParams.get("bloodGroup") || "", searchParams.get("location") || "");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...(bloodGroup && { bloodGroup }), ...(location && { location }) });
    fetchDonors();
  };

  const handleReset = () => {
    setBloodGroup("");
    setLocation("");
    setDonors([]);
    setSearched(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Find Blood Donors</h1>
        <p className="text-stone-500 font-body mt-1">Search for available donors near you</p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-body font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="input-field">
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg || "All groups"}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-body font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              className="input-field" placeholder="e.g. Dhaka, Chittagong" />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary whitespace-nowrap">
              {loading ? "Searching…" : "Search"}
            </button>
            {searched && (
              <button type="button" onClick={handleReset} className="btn-outline whitespace-nowrap">
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-crimson-200 border-t-crimson-700 rounded-full animate-spin" />
          <p className="text-stone-400 font-body mt-4">Finding donors…</p>
        </div>
      )}

      {!loading && searched && (
        <>
          <p className="text-sm font-body text-stone-500 mb-5">
            {donors.length > 0
              ? `Found ${donors.length} available donor${donors.length !== 1 ? "s" : ""}`
              : "No available donors found for the given criteria."}
          </p>
          {donors.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((d) => <DonorCard key={d._id} donor={d} />)}
            </div>
          )}
          {donors.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
              <div className="text-4xl mb-3">🩸</div>
              <h3 className="font-display font-semibold text-stone-700 text-xl mb-1">No donors found</h3>
              <p className="text-stone-400 font-body text-sm">Try a different location or blood group</p>
            </div>
          )}
        </>
      )}

      {!loading && !searched && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display font-semibold text-stone-700 text-xl">Start your search</h3>
          <p className="text-stone-400 font-body text-sm mt-1">Enter a blood group or location above</p>
        </div>
      )}
    </div>
  );
}