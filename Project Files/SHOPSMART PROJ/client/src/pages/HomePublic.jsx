import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import shopAnim from "../assets/shop.json";

function HomePublic() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1 style={styles.title}>
          Welcome to <span style={styles.brand}>ShopSmart</span>
        </h1>

        <p style={styles.subtitle}>
          Smart shopping starts here.  
          Discover products you’ll love ✨
        </p>

        <button
          style={styles.shopBtn}
          onClick={() => navigate("/register")}
        >
          Start Shopping
        </button>
      </div>

      <div style={styles.right}>
        <Lottie
          animationData={shopAnim}
          loop
          style={{ width: 420 }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "60px",
overflow: "hidden",
  background: `
    linear-gradient(
      135deg,
      #fff7ed,
      #e0f2fe,
      #bae6fd,
      #67e8f9,
      #a5f3fc
    )
  `,
  backgroundSize: "400% 400%",
  animation: "beachMove 18s ease infinite",

  fontFamily: "Inter, sans-serif",
},


  left: {
    maxWidth: "520px",
    marginLeft:"50px"
  },

  title: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "16px",
    color: "#022c22",
  },

  brand: {
    background:
      "linear-gradient(135deg,#38bdf8,#22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "18px",
    color: "#334155",
    marginBottom: "32px",
    lineHeight: 1.6,
  },

  shopBtn: {
    padding: "14px 28px",
    borderRadius: "999px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(34,197,94,0.4)",
    transition: "transform 0.2s ease",
  },

  right: {
    display: "flex",
    alignItems: "center",
    marginRight:"80px",
    justifyContent: "center",
  },
};

export default HomePublic;
