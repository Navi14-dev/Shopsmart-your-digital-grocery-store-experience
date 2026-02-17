import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);



  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
  try {
    await api.delete(`/products/${selectedProductId}`);
    setProducts(products.filter(p => p._id !== selectedProductId));
    setShowDeleteModal(false);
    setShowSuccessModal(true);
  } catch {
    alert("Delete failed");
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Manage Products</h2>

        <button
          style={styles.addBtn}
          onClick={() => navigate("/admin/add-product")}
        >
          ➕ Add Product
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  No products found
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p._id} style={styles.tr}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>₹{p.price}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(`/admin/edit-product/${p._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
  style={styles.deleteBtn}
  onClick={() => {
    setSelectedProductId(p._id);
    setShowDeleteModal(true);
  }}
>
  Delete
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>⚠️ Confirm Delete</h3>
      <p>Are you sure you want to delete this product?</p>

      <div style={styles.modalActions}>
        <button
          style={styles.cancelBtn}
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          style={styles.confirmDeleteBtn}
          onClick={deleteProduct}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
{showSuccessModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>✅ Success</h3>
      <p>Product deleted successfully.</p>

      <button
        style={styles.successBtn}
        onClick={() => setShowSuccessModal(false)}
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
  },

  addBtn: {
    background: "linear-gradient(135deg,#22d3ee,#0ea5e9)",
    color: "#020617",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  tableCard: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    color: "#94a3b8",
    fontWeight: "600",
  },

  tr: {
    background: "#020617",
    transition: "all 0.25s ease",
  },

  td: {
    padding: "14px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#94a3b8",
  },

  editBtn: {
    background: "#22c55e",
    border: "none",
    color: "#022c22",
    padding: "8px 14px",
    borderRadius: "8px",
    marginRight: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
},

modal: {
  background: "#020617",
  padding: "30px",
  borderRadius: "16px",
  width: "360px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
},

modalActions: {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "25px",
},

cancelBtn: {
  background: "#475569",
  border: "none",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
},

confirmDeleteBtn: {
  background: "#ef4444",
  border: "none",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
},

successBtn: {
  marginTop: "20px",
  background: "#22c55e",
  border: "none",
  color: "#022c22",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
},

};

export default AdminProducts;
