import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminPopup from "../../components/AdminPopup";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    try {
      await api.post("/products/add", form);
      setShowLoading(false);
      setShowSuccess(true);
    } catch {
      setShowLoading(false);
      alert("Product creation failed");
    }
  };

  return (
    <>
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>➕ Add New Product</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.grid}>
              <input
                name="name"
                placeholder="Product Name"
                onChange={handleChange}
                required
                style={styles.input}
              />

             <input
  type="number"
  name="price"
  placeholder="Price (₹)"
  min="0"
  step="1"
  required
  style={styles.input}
  onChange={(e) =>
    setForm({ ...form, price: e.target.value.replace(/\D/g, "") })
  }
/>

<input
  type="number"
  name="stock"
  placeholder="Stock"
  min="0"
  step="1"
  required
  style={styles.input}
  onChange={(e) =>
    setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })
  }
/>


              <input
                name="category"
                placeholder="Category"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <input
              name="image"
              placeholder="Image URL"
              onChange={handleChange}
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Product Description"
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.actions}>
              <button type="submit" style={styles.submitBtn}>
                ✅ Add Product
              </button>

              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate("/admin/products")}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔄 LOADING POPUP */}
      {showLoading && (
        <AdminPopup
          type="loading"
          title="Adding Product"
          message="Please wait while the product is being added..."
        />
      )}

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <AdminPopup
          type="success"
          title="Product Added"
          message="The product has been added successfully."
          onConfirm={() => navigate("/admin/products")}
        />
      )}
    </>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  card: {
    width: "100%",
    maxWidth: "720px",
    background: "linear-gradient(135deg,#020617,#0f172a)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    color: "#e5e7eb",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "30px",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#020617",
    color: "#e5e7eb",
    outline: "1px solid #1e293b",
    fontSize: "14px",
  },

  textarea: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#020617",
    color: "#e5e7eb",
    outline: "1px solid #1e293b",
    minHeight: "120px",
    resize: "vertical",
  },

  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "20px",
  },

  submitBtn: {
    flex: 1,
    background: "linear-gradient(135deg,#22d3ee,#38bdf8)",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#020617",
    fontSize: "15px",
  },

  cancelBtn: {
    flex: 1,
    background: "#020617",
    border: "1px solid #334155",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#e5e7eb",
    fontSize: "15px",
  },
};

export default AddProduct;
