import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Lottie from "lottie-react";
import registerAnim from "../assets/Register.json";
import UserPopup from "../components/UserPopup";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  /* ---------------- PASSWORD RULES ---------------- */

  const hasUpper = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.password);
  const hasMinLength = form.password.length >= 8;

  const isStrong =
    hasUpper && hasNumber && hasSpecial && hasMinLength;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.phone)) {
      return setError("Phone number must be exactly 10 digits");
    }

    if (!isStrong) {
      return setError(
        "Password must be 8+ characters, include uppercase, number & special character"
      );
    }

    setShowLoading(true);

    try {
      await api.post("/auth/register", form);

      setShowLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setShowLoading(false);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        <div style={styles.card}>
          <h2 style={styles.title}>Create Account ✨</h2>
          <p style={styles.subtitle}>
            Join ShopSmart and start shopping smarter today
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Phone (10 digits)"
              maxLength="10"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              required
              style={styles.input}
            />

            {/* Password with Eye Icon */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                style={{
                  ...styles.input,
                  paddingRight: "16.5px",
                }}
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>

            {/* PASSWORD CHECKLIST */}
            {form.password && (
              <div style={styles.checklist}>
                <p style={hasMinLength ? styles.valid : styles.invalid}>
                  {hasMinLength ? "✔" : "✖"} 8+ Characters
                </p>
                <p style={hasUpper ? styles.valid : styles.invalid}>
                  {hasUpper ? "✔" : "✖"} 1 Uppercase Letter
                </p>
                <p style={hasNumber ? styles.valid : styles.invalid}>
                  {hasNumber ? "✔" : "✖"} 1 Number
                </p>
                <p style={hasSpecial ? styles.valid : styles.invalid}>
                  {hasSpecial ? "✔" : "✖"} 1 Special Character
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isStrong}
              style={{
                ...styles.registerBtn,
                ...(isStrong
                  ? styles.enabledBtn
                  : styles.disabledBtn),
              }}
            >
              Register
            </button>
          </form>

          <div style={styles.links}>
            <button
              style={styles.loginLink}
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </button>
          </div>
        </div>

        <div style={styles.animationBox}>
          <Lottie
            animationData={registerAnim}
            loop
            style={{ width: 380 }}
          />
        </div>
      </div>

      {showLoading && (
        <UserPopup
          type="loading"
          title="Creating Account..."
          message="Please wait while we set things up."
        />
      )}

      {showSuccess && (
        <UserPopup
          type="success"
          title="Registered Successfully 🎉"
          message="Welcome to ShopSmart!"
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

  wrapper: {
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

  input: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },

  passwordWrapper: {
    position: "relative",
  },

  eyeIcon: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#64748b",
  },

  checklist: {
    fontSize: "13px",
    lineHeight: "1.8",
  },

  valid: {
    color: "#22c55e",
  },

  invalid: {
    color: "#ef4444",
  },

  registerBtn: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "600",
    fontSize: "15px",
  },

  enabledBtn: {
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(34,197,94,0.35)",
  },

  disabledBtn: {
    background: "#d1d5db",
    color: "#fff",
    cursor: "not-allowed",
  },

  links: {
    marginTop: "24px",
  },

  loginLink: {
    background: "none",
    border: "none",
    color: "#0ea5e9",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },

  animationBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
};

export default Register;
