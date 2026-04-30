export default function DonorCard({ donor }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="blood-group-tag">{donor.bloodGroup}</div>
          <div>
            <h3 className="font-display font-semibold text-stone-800 text-base leading-tight">{donor.name}</h3>
            <p className="text-xs text-stone-500 font-body mt-0.5">{donor.location}</p>
          </div>
        </div>
        <span className="badge-available">Available</span>
      </div>

      <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-stone-600 font-body">
          <svg className="w-4 h-4 text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {donor.phone}
        </div>
        {donor.lastDonationDate && (
          <div className="flex items-center gap-2 text-xs text-stone-400 font-body">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last donated: {new Date(donor.lastDonationDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        )}
      </div>

      <a
        href={`tel:${donor.phone}`}
        className="btn-primary text-center text-sm !py-2 mt-auto"
      >
        Contact Donor
      </a>
    </div>
  );
}