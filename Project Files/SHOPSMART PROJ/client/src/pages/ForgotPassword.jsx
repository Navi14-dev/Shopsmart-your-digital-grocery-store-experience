import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import forgotAnim from "../assets/Forgot Password.json";
import UserPopup from "../components/UserPopup";
import { Eye, EyeOff } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  /* ---------------- PASSWORD RULES ---------------- */

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;

  const passwordsMatch =
    confirmPassword && newPassword === confirmPassword;

  const isStrong =
    hasUpper && hasNumber && hasSpecial && hasMinLength;

  /* ---------------- SUBMIT ---------------- */

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isStrong)
      return setError("Password does not meet requirements");

    if (!passwordsMatch)
      return setError("Passwords do not match");

    setShowLoading(true);

    try {
      await api.put("/auth/forgot-password", {
        email,
        newPassword,
      });

      setShowLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setShowLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        <div style={styles.card}>
          <h2 style={styles.title}>Reset Your Password 🔐</h2>
          <p style={styles.subtitle}>
            Enter your registered email and choose a secure password
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={submit} style={styles.form}>

            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            {/* NEW PASSWORD */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>

            {/* CHECKLIST */}
            {newPassword && (
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

            {/* CONFIRM PASSWORD */}
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                style={{
                  ...styles.input,
                  ...(passwordsMatch
                    ? styles.matchGlow
                    : {}),
                }}
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </div>
            </div>

            {confirmPassword && (
              <p
                style={
                  passwordsMatch
                    ? styles.valid
                    : styles.invalid
                }
              >
                {passwordsMatch
                  ? "✔ Passwords Match"
                  : "✖ Passwords Do Not Match"}
              </p>
            )}

            <button
              type="submit"
              disabled={!isStrong || !passwordsMatch}
              style={{
                ...styles.resetBtn,
                ...(isStrong && passwordsMatch
                  ? styles.glowButton
                  : styles.disabledButton),
              }}
            >
              Reset Password
            </button>
          </form>

          <div style={styles.links}>
            <button
              style={styles.loginLink}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>

        <div style={styles.animationBox}>
          <Lottie
            animationData={forgotAnim}
            loop
            style={{ width: 380 }}
          />
        </div>
      </div>

      {showLoading && (
        <UserPopup
          type="loading"
          title="Resetting Password..."
          message="Please wait..."
        />
      )}

      {showSuccess && (
        <UserPopup
          type="success"
          title="Password Reset Successful 🎉"
          message="You can now login with your new password."
        />
      )}

      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 10px rgba(34,197,94,0.4); }
            50% { box-shadow: 0 0 25px rgba(34,197,94,0.8); }
            100% { box-shadow: 0 0 10px rgba(34,197,94,0.4); }
          }
        `}
      </style>
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
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "30px",
    color: "#64748b",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

 input: {
  padding: "14px 18px",
  paddingRight: "0px", 
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  width: "100%",
},


  matchGlow: {
    border: "1px solid #22c55e",
    animation: "glow 2s infinite",
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

  resetBtn: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
  },

  glowButton: {
    animation: "glow 2s infinite",
    cursor: "pointer",
  },

  disabledButton: {
    background: "#d1d5db",
    cursor: "not-allowed",
  },

  loginLink: {
    background: "none",
    border: "none",
    color: "#0ea5e9",
    cursor: "pointer",
    marginTop: "20px",
  },

  animationBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  passwordWrapper: {
  position: "relative",
  display: "flex",
  alignItems: "center",
},

eyeIcon: {
  position: "absolute",
  right: "18px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
},

};

export default ForgotPassword;
