import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import Lottie from "lottie-react";
import loginAnim from "../assets/Login.json"; // add your light themed animation
import UserPopup from "../components/UserPopup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [showSuccess, setShowSuccess] = useState(false);
const [showLoading, setShowLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setShowLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    setShowLoading(false);
    setShowSuccess(true);

    setTimeout(() => {
  setShowSuccess(false);
  login(res.data.token, res.data.user);
}, 1500);


  } catch (err) {
    setShowLoading(false);
    setError(err.response?.data?.message || "Login failed");
  }
};


  return (
  <div style={styles.page}>
    <div style={styles.cardWrapper}>
      
      {/* LEFT SIDE - FORM */}
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>
          Login to continue your smart shopping experience
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          {/* Password with eye icon */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...styles.input, paddingRight: "45px" }}
            />

            <span
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button type="submit" style={styles.loginBtn}>
            Login
          </button>
        </form>

        <div style={styles.links}>
          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            ✨ New User ? Create New Account
          </button>

          <button
            style={styles.forgotBtn}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - LOTTIE */}
      <div style={styles.animationBox}>
        <Lottie animationData={loginAnim} loop style={{ width: 380 }} />
      </div>
    </div>

    {/* POPUPS */}
    {showLoading && (
      <UserPopup
        type="loading"
        title="Signing You In"
        message="Please wait..."
      />
    )}

    {showSuccess && (
      <UserPopup
        type="success"
        title="Login Successful 🎉"
        message="Welcome back to ShopSmart!"
      />
    )}
  </div>
);

}


/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background:
      "linear-gradient(135deg,#f0f9ff,#e0f2fe,#fdf2f8)",
    fontFamily: "Inter, sans-serif",
    
  },

  cardWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    maxWidth: "1100px",
    width: "100%",
   
  },

  card: {
    flex: 1,
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.65)",
    borderRadius: "24px",
    padding: "50px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
    
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "30px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  passwordWrapper: {
  position: "relative",
  width: "100%",
},

eyeIcon: {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "16px",
},

  input: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
  },

  loginBtn: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#38bdf8,#22d3ee)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 10px 30px rgba(56,189,248,0.35)",
  },

  links: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  link: {
    color: "#0ea5e9",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  forgotBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  },

  animationBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  registerBtn: {
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid #38bdf8",
  background: "rgba(56,189,248,0.08)",
  color: "#0284c7",
  fontWeight: "600",
  cursor: "pointer",
},

forgotBtn: {
  background: "none",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "14px",
},

};

export default Login;
