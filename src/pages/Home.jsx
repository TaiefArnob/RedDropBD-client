import { Link } from "react-router-dom";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const stats = [
  { value: "Every 2s", label: "Someone needs blood" },
  { value: "3 lives", label: "Saved per donation" },
  { value: "38%", label: "People eligible to donate" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-crimson-900 via-crimson-800 to-crimson-700 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-crimson-600 opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white opacity-5" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
          <p className="text-crimson-200 font-body text-4xl font-bold  uppercase tracking-widest mb-4 animate-fade-up">
            Bangladesh's Blood Donor Network
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
            Give the Gift of Life.
            <br />
            <span className="text-crimson-200">Donate Blood Today.</span>
          </h1>
          <p className="text-crimson-100 font-body text-lg max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
            Connect with blood donors in your area instantly. Every drop counts, every second matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
            <Link to="/donors" className="bg-white text-crimson-700 font-body font-semibold px-8 py-4 rounded-xl hover:bg-crimson-50 transition-all shadow-lg text-base">
              Find a Donor
            </Link>
            <Link to="/requests" className="border-2 border-white text-white font-body font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
              View Requests
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl font-bold text-crimson-700">{s.value}</p>
              <p className="text-stone-500 font-body text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood groups */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-stone-800">Search by Blood Group</h2>
          <p className="text-stone-500 font-body mt-2">Tap a blood group to find available donors instantly</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map((bg) => (
            <Link
              key={bg}
              to={`/donors?bloodGroup=${encodeURIComponent(bg)}`}
              className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-white border-2 border-stone-100 hover:border-crimson-400 hover:shadow-md transition-all group"
            >
              <span className="font-display font-bold text-lg text-stone-800 group-hover:text-crimson-700 transition-colors">{bg}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-stone-800 text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Register as a Donor", desc: "Create your account, add your blood group and location, and toggle your availability." },
              { step: "02", title: "Search for Donors", desc: "Filter available donors by blood group and location. Get contact details instantly." },
              { step: "03", title: "Post a Blood Request", desc: "Need blood urgently? Post a request with hospital details and urgency level." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-crimson-50 text-crimson-700 font-display font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-stone-800 text-lg mb-2">{item.title}</h3>
                <p className="text-stone-500 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-crimson-50 py-14 border-t border-crimson-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-stone-800 mb-3">Ready to Save a Life?</h2>
          <p className="text-stone-500 font-body text-sm mb-6">Join thousands of donors across Bangladesh making a difference every day.</p>
          <Link to="/register" className="btn-primary text-base">Join LifeFlow Now</Link>
        </div>
      </section>
    </div>
  );
}