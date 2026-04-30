import { useAuth } from "../context/AuthContext";
import { deleteRequest, updateRequestStatus } from "../api/axios";
import toast from "react-hot-toast";

const urgencyClass = {
  critical: "badge-critical",
  medium:   "badge-medium",
  low:      "badge-low",
};

export default function RequestCard({ request, onUpdate }) {
  const { user } = useAuth();
  const isOwner = user?._id === request.user?._id;

  const handleMarkFulfilled = async () => {
    try {
      await updateRequestStatus(request._id, "fulfilled");
      toast.success("Marked as fulfilled!");
      onUpdate?.();
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this request?")) return;
    try {
      await deleteRequest(request._id);
      toast.success("Request deleted.");
      onUpdate?.();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="blood-group-tag">{request.bloodGroup}</div>
          <div>
            <h3 className="font-display font-semibold text-stone-800 text-base">{request.hospital}</h3>
            <p className="text-xs text-stone-500 font-body">{request.location}</p>
          </div>
        </div>
        <span className={urgencyClass[request.urgency] || "badge-medium"}>
          {request.urgency}
        </span>
      </div>

      <div className="border-t border-stone-100 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-stone-700 font-body">
          <svg className="w-4 h-4 text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {request.contactName}
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600 font-body">
          <svg className="w-4 h-4 text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {request.contactPhone}
        </div>
        {request.notes && (
          <p className="text-xs text-stone-400 italic font-body pt-1 border-t border-stone-50">"{request.notes}"</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
        <p className="text-xs text-stone-400 font-body">
          {new Date(request.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        {isOwner && (
          <div className="flex gap-2">
            <button onClick={handleMarkFulfilled} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              ✓ Fulfilled
            </button>
            <button onClick={handleDelete} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}