import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DropIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/donors",   label: "Find Donors" },
    { to: "/requests", label: "Blood Requests" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-crimson-700 font-display font-bold text-xl">
            <span className="animate-pulse-slow"><DropIcon /></span>
            RedDropBD
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-body font-medium transition-colors ${
                  pathname === l.to ? "text-crimson-700" : "text-stone-600 hover:text-crimson-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm font-body font-medium transition-colors ${
                  pathname === "/admin" ? "text-crimson-700" : "text-stone-600 hover:text-crimson-700"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth buttons desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-body font-medium text-stone-700 hover:text-crimson-700 transition-colors">
                  {user.name?.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="btn-outline text-sm !px-4 !py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-body font-medium text-stone-700 hover:text-crimson-700 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:text-crimson-700"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-stone-100 mt-1 pt-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="text-sm font-body font-medium text-stone-700 hover:text-crimson-700 py-1">
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-body font-medium text-stone-700 hover:text-crimson-700 py-1">Admin</Link>
            )}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-body font-medium text-stone-700 py-1">My Profile</Link>
                <button onClick={handleLogout} className="text-left text-sm font-body font-medium text-crimson-700 py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-body font-medium text-stone-700 py-1">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm inline-block text-center !py-2">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}