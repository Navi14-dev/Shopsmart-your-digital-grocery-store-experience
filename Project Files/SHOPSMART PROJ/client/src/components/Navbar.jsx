import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRef } from "react";
import api from "../api/api";
import Lottie from "lottie-react";
import shopAnim from "../assets/Shop-icon.json";
import { memo } from "react";
import AdminPopup from "../components/AdminPopup"; // adjust path

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
const [showLogoutPopup, setShowLogoutPopup] = useState(false);
const [showLogoutLoading, setShowLogoutLoading] = useState(false);
const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);



const [mobileOpen, setMobileOpen] = useState(false);


  const isAdmin = user?.role === "admin";



const handleLogout = () => {
  setShowLogoutPopup(true);
};


const confirmLogout = () => {
  setShowLogoutPopup(false);
  setShowLogoutLoading(true);

  // simulate small delay (optional)
  setTimeout(() => {
    logout();
    setShowLogoutLoading(true);
    setShowLogoutSuccess(true);
  }, 1000);
};


const cancelLogout = () => {
  setShowLogoutPopup(false);
};


const location = useLocation();
const hideNavbar = ["/login", "/register"].includes(location.pathname);

{!hideNavbar && <Navbar />}



  const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
  if (!user || !query) {
    setSuggestions([]);
    return;
  }

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/products");
      const matches = res.data
        .filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matches);
    } catch {
      setSuggestions([]);
    }
  };

  fetchSuggestions();
}, [query, user]);


  const profileLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase();

  return (
   <nav
  style={{
    ...styles.nav,
    background: isAdmin
      ? "linear-gradient(135deg,#020617,#020617,#020617)"
      : styles.nav.background,
  }}
>

      {/* LOGO */}
     <div
  style={styles.logoContainer}
  onClick={() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }}
>

        <img src="/shopsmartlogo.png" alt="logo" style={styles.logo} />
        <span style={styles.brand}>ShopSmart</span>
      </div>


      <div
  className="mobile-btn"
  style={styles.mobileMenuBtn}
  onClick={() => setMobileOpen(!mobileOpen)}
>
  ☰
</div>



      {/* SEARCH */}
      {user?.role === "user" && (
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {suggestions.length > 0 && (
            <div style={styles.dropdown}>
              {suggestions.map(s => (
                <div
                  key={s._id}
                  style={styles.item}
                  onClick={() => navigate(`/products?search=${s.name}`)}
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LINKS */}
    <div
  className={`navbar-links ${mobileOpen ? "mobile-open" : ""}`}
  style={styles.links}
>


        {!user && (
  <div style={styles.publicActions}>
    <div style={styles.lottieWrap}>
      <Lottie
        animationData={shopAnim}
        loop
        style={{ height: 46 }}
      />
    </div>

    <button
      style={styles.shopBtn}
      onClick={() => navigate("/register")}
    >
      🛍️ Shop Now
    </button>
  </div>
)}

        {user?.role === "user" && (
          <>
            <Link style={styles.link} to="/">Home</Link>
            <Link style={styles.link} to="/products">Products</Link>
          <Link to="/cart" style={styles.cart} title="Cart">
  🛒
</Link>

<div style={{ position: "relative" }} ref={menuRef}>
  <div
    style={styles.avatar}
    onClick={() => setShowMenu(prev => !prev)}
    title="Profile"
  >
    {profileLetter}
  </div>

  {showMenu && (
    <div style={styles.profileMenu}>
      <div
        style={styles.menuItem}
        onClick={() => navigate("/profile")}
      >
        ✏️ Edit Profile
      </div>

      <div
        style={styles.menuItem}
        onClick={() => navigate("/orders")}
      >
        📦 My Orders
      </div>

      <div
        style={styles.menuItem}
        onClick={() => navigate("/change-password")}
      >
        🔒 Change Password
      </div>

      <div
        style={{ ...styles.menuItem, color: "#ef4444" }}
        onClick={handleLogout}
      >
        🚪 Logout
      </div>
    </div>
              )}
            </div>
          </>
        )}

        {/* Admin Side  */}
{user?.role === "admin" && (
  <>
    <Link style={styles.adminLink} to="/admin/dashboard">Dashboard</Link>
    <Link style={styles.adminLink} to="/admin/products">Products</Link>
    <Link style={styles.adminLink} to="/admin/orders">Orders</Link>

    <div style={styles.adminAvatar} title="Admin">
      {profileLetter}
    </div>

    <button style={styles.adminLogoutBtn} onClick={handleLogout}>
      Logout
    </button>
  </>
)}
{showLogoutPopup && (
  <AdminPopup
    type="confirm"
    title="Confirm Logout"
    message="Are you sure you want to logout ?"
    confirmText="Logout"
    cancelText="Cancel"
    onConfirm={confirmLogout}
    onCancel={cancelLogout}
  />
)}
{showLogoutLoading && (
  <AdminPopup
    type="loading"
    title="Logging Out..."
    message="Please wait while we securely log you out."
  />
)}
{showLogoutSuccess && (
  <AdminPopup
    type="success"
    title="Logged Out Successfully ✅"
    message="You have been safely logged out."
    onConfirm={() => {
      setShowLogoutSuccess(false);
      window.location.href = "/";
    }}
  />
)}

{/* {showLogoutSuccess && (
  <AdminPopup
    type="success"
    title="Logged Out Successfully ✅"
    message="You have been logged out from the admin panel."
    onConfirm={() => {
      setShowLogoutSuccess(false);
      window.location.href = "/";
    }}
  />
)} */}



      </div>
      <style>
{`
@media (max-width: 900px) {

  .navbar-links {
    position: absolute;
    top: 80px;
    right: 0;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    width: 100%;
    display: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  .navbar-links.mobile-open {
    display: flex;
  }
}

@media (max-width: 900px) {
  nav > div:nth-child(2) {
    display: block !important;
  }
}
@media (max-width: 900px) {
  .mobile-btn {
    display: block !important;
  }
}

`}
</style>

    </nav>
  );
}

const styles = {
nav: {
  position: "sticky",
  top: 0,
  zIndex: 999,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 32px",
  background:
    "linear-gradient(135deg,#38bdf8,#22d3ee,#34d399)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  fontFamily: "Inter, sans-serif",
  transition: "all 0.35s ease",
},

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  brand: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#20302cff",
  },

  logo: {
    height: "44px",
    width: "44px",
    borderRadius: "50%",
    background: "#fff",
    padding: "4px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
  },

searchBox: {
  position: "relative",
  flex: 1,
  maxWidth: "300px",
},


  searchInput: {
    padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  width: "100%",
  maxWidth: "260px",
    fontFamily: "Inter",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  dropdown: {
    position: "absolute",
    top: "42px",
    width: "100%",
    background: "#fff",
    color: "#000",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
  },

  item: {
    padding: "8px 10px",
    cursor: "pointer",
  },

  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  link: {
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#022c22",
    textDecoration: "none",
  },


  registerBtn: {
    fontFamily: "Poppins",
    background: "#022c22",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
  },

 cart: {
  fontSize: "20px",
  background:
    "linear-gradient(135deg,#00FFFF ,#00008B)",
  padding: "10px 14px",
  borderRadius: "999px",
  textDecoration: "none",
  color: "#ffffff",
  boxShadow: "0 8px 20px rgba(244, 18, 59, 0.4)",
  transition: "all 0.3s ease",
  cursor: "pointer",
},



   profile: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#022c22",
    color: "#fff",
    fontWeight: "700",
  },
avatar: {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg,#000000,#000000)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(56,189,248,0.45)",
  transition: "transform 0.25s ease",
},
 profileMenu: {
  position: "absolute",
  right: 0,
  top: "54px",
  background:
    "linear-gradient(180deg,#ffffff,#f1f5f9)",
  borderRadius: "16px",
  width: "200px",
  padding: "8px",
  boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
  animation: "fadeSlide 0.25s ease forwards",
},

menuItem: {
  padding: "12px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.25s ease",
  color: "#4667aeff",
},


  logoutBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },





  publicActions: {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  
},

lottieWrap: {
  width: "50px",
 
},



shopBtn: {
  background:
    "linear-gradient(135deg,#facc15,#f97316)",
  border: "none",
  padding: "12px 22px",
  borderRadius: "999px",
  fontFamily: "Poppins",
  fontWeight: "700",
  fontSize: "14px",
  color: "#1f2937",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(249,115,22,0.45)",
  transition: "all 0.3s ease",
},



// Admin Styles 
  adminLink: {
  fontFamily: "Inter",
  fontWeight: "600",
  color: "#e5e7eb",
  textDecoration: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  transition: "all 0.3s ease",
  background: "rgba(255,255,255,0.05)",
},

adminAvatar: {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg,#6366f1,#22d3ee)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "700",
  boxShadow: "0 8px 18px rgba(99,102,241,0.45)",
},

adminLogoutBtn: {
  background:
    "linear-gradient(135deg,#ef4444,#dc2626)",
  border: "none",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(239,68,68,0.4)",
},


mobileMenuBtn: {
  display: "none",
  fontSize: "26px",
  cursor: "pointer",
  color: "#fff",
},

mobileLinksOpen: {
  display: "flex",
},

};

export default memo(Navbar);
