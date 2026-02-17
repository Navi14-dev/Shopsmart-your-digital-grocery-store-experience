import { useEffect, useState } from "react";
import api from "../../api/api";
import Lottie from "lottie-react";
import profileAnim from "../../assets/Edit Profile.json"; // add animation
import UserPopup from "../../components/UserPopup";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.phone)) {
      return setError("Phone number must be exactly 10 digits");
    }

    setShowLoading(true);

    try {
      await api.put("/auth/update", {
        name: form.name,
        phone: form.phone,
      });

      setShowLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setShowLoading(false);
      setError("Profile update failed ❌");
    }
  };

  if (loading) return <UserPopup type="loading" title="Loading Profile..." />;

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        {/* LEFT SIDE FORM */}
        <div style={styles.card}>
          <h2 style={styles.title}>Your Profile 👤</h2>
          <p style={styles.subtitle}>
            Manage your account details here
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={styles.input}
              required
            />

            <input
              placeholder="Email"
              value={form.email}
              disabled
              style={styles.disabledInput}
            />

            <input
              placeholder="Phone (10 digits)"
              value={form.phone}
              maxLength={10}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              Save Changes
            </button>
          </form>
        </div>

        {/* RIGHT SIDE ANIMATION */}
        <div style={styles.animationBox}>
          <Lottie
            animationData={profileAnim}
            loop
            style={{ width: 380 }}
          />
        </div>
      </div>

      {/* Loading Popup */}
      {showLoading && (
        <UserPopup
          type="loading"
          title="Updating Profile..."
          message="Please wait while we save your changes."
        />
      )}

      {/* Success Popup */}
      {showSuccess && (
        <UserPopup
          type="success"
          title="Profile Updated 🎉"
          message="Your profile has been updated successfully."
          onConfirm={() => setShowSuccess(false)}
        />
      )}
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
      "linear-gradient(135deg,#fdf2f8,#fef3c7,#e0e7ff)",
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
    transition: "0.3s",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#4c1d95",
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
    gap: "16px",
  },

  input: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
  },

  disabledInput: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "#f3f4f6",
    fontSize: "14px",
    color: "#6b7280",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    background:
      "linear-gradient(135deg,#a78bfa,#f472b6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 15px 35px rgba(167,139,250,0.35)",
  },

  animationBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
};

export default Profile;
