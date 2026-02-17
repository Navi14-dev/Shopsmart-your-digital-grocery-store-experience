import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import adminAnim from "../../assets/Revenue.json"; // use any admin-style lottie

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Lottie
          animationData={adminAnim}
          loop
          style={{ height: 280 }}
        />

        <h1 style={styles.title}>Welcome, Admin</h1>
        <p style={styles.subtitle}>
          Manage products, orders and platform activity
        </p>

        <div style={styles.actions}>
          <button
            style={styles.btn}
            onClick={() => navigate("/admin/dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            style={styles.btn}
            onClick={() => navigate("/admin/products")}
          >
            📦 Products
          </button>

          <button
            style={styles.btn}
            onClick={() => navigate("/admin/orders")}
          >
            🛒 Orders
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#020617,#020617)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#e5e7eb",
   
  },
  content: {
    textAlign: "center",
    maxWidth: "500px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginTop: "20px",
  },
  subtitle: {
    marginTop: "10px",
    opacity: 0.8,
  },
  actions: {
    marginTop: "30px",
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btn: {
    padding: "12px 22px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#6366f1,#22d3ee)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
  },
};

export default AdminHome;
