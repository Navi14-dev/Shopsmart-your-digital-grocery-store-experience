import { useState, useEffect } from "react";
import api from "../api/api";
import Lottie from "lottie-react";
import passwordAnim from "../assets/change password.json";
import UserPopup from "../components/UserPopup";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  /* ---------------- PASSWORD STRENGTH LOGIC ---------------- */

  const calculateStrength = (password) => {
    let score = 0;
    if (!password) return { label: "", width: "0%", color: "transparent" };

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      return { label: "Weak", width: "33%", color: "#ef4444" };

    if (score === 2 || score === 3)
      return { label: "Medium", width: "66%", color: "#f59e0b" };

    return { label: "Strong", width: "100%", color: "#22c55e" };
  };

  const strength = calculateStrength(newPassword);

  const isStrong = strength.label === "Strong";

  /* ---------------- ERROR SHAKE EFFECT ---------------- */

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isStrong) {
      return setError("Password must be Strong to update");
    }

    setShowLoading(true);

    try {
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setShowLoading(false);
      setShowSuccess(true);

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setShowLoading(false);
      setError(
        err.response?.data?.message || "Password change failed"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* FORM SECTION */}
        <div
          style={{
            ...styles.card,
            animation: shake ? "shake 0.4s" : "none",
          }}
        >
          <h2 style={styles.title}>Change Password 🔐</h2>
          <p style={styles.subtitle}>Keep your account secure</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Old Password */}
            <div style={styles.passwordWrapper}>
              <input
                type={showOld ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? "🙈" : "👁"}
              </span>
            </div>

            {/* New Password */}
            <div style={styles.passwordWrapper}>
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "🙈" : "👁"}
              </span>
            </div>

            {/* STRENGTH METER */}
            {newPassword && (
              <div style={styles.strengthContainer}>
                <div style={styles.strengthBarBackground}>
                  <div
                    style={{
                      ...styles.strengthBarFill,
                      width: strength.width,
                      background: strength.color,
                    }}
                  />
                </div>
                <span
                  style={{
                    ...styles.strengthText,
                    color: strength.color,
                  }}
                >
                  {strength.label}
                </span>
              </div>
            )}

            {/* BUTTON WITH GLOW + DISABLE */}
            <button
              type="submit"
              disabled={!isStrong}
              style={{
                ...styles.button,
                ...(isStrong ? styles.glowButton : styles.disabledButton),
              }}
            >
              Update Password
            </button>
          </form>
        </div>

        {/* LOTTIE */}
        <div style={styles.animationBox}>
          <Lottie animationData={passwordAnim} loop style={{ width: 380 }} />
        </div>
      </div>

      {showLoading && (
        <UserPopup
          type="loading"
          title="Updating Password..."
          message="Please wait..."
        />
      )}

      {showSuccess && (
        <UserPopup
          type="success"
          title="Password Updated 🎉"
          message="Your password has been changed successfully."
          onConfirm={() => setShowSuccess(false)}
        />
      )}

      {/* SHAKE KEYFRAMES */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-6px); }
            100% { transform: translateX(0); }
          }

          @keyframes glow {
            0% { box-shadow: 0 0 10px rgba(139,92,246,0.4); }
            50% { box-shadow: 0 0 25px rgba(236,72,153,0.8); }
            100% { box-shadow: 0 0 10px rgba(139,92,246,0.4); }
          }
        `}
      </style>
    </div>
  );
}

/* ---------- PREMIUM STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background:
      "linear-gradient(135deg,#fdf2f8,#e0f2fe,#ede9fe)",
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
    backdropFilter: "blur(25px)",
    background: "rgba(255,255,255,0.75)",
    borderRadius: "28px",
    padding: "50px",
    boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#7c3aed",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "30px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  passwordWrapper: { position: "relative" },

  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
  },

  eye: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  strengthContainer: { marginTop: "5px" },

  strengthBarBackground: {
    height: "8px",
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  strengthBarFill: {
    height: "100%",
    transition: "all 0.4s ease",
    borderRadius: "10px",
  },

  strengthText: {
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "6px",
    display: "inline-block",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },

  glowButton: {
    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    animation: "glow 2s infinite",
    cursor: "pointer",
  },

  disabledButton: {
    background: "#d1d5db",
    cursor: "not-allowed",
  },

  animationBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
};

export default ChangePassword;
