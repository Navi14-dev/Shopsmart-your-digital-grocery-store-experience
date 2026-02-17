import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import UserPopup from "../../components/UserPopup";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);



  const navigate = useNavigate();

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= BUY NOW ================= */
  const buyNow = (item) => {
    navigate("/checkout", {
      state: {
        buyNow: {
          product: item.product,
          quantity: item.quantity,
          fromCart: true,
        },
      },
    });
  };

  /* ================= UPDATE QTY ================= */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put("/cart/update", { productId, quantity });
      fetchCart();
    } catch {
      alert("Update failed");
    }
  };

  /* ================= DELETE FLOW ================= */
  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setShowDeletePopup(true);
  };

 const confirmDelete = async () => {
  try {
    await api.delete(`/cart/remove/${deleteProductId}`);
    fetchCart();

    setShowDeletePopup(false);
    setDeleteProductId(null);

    // ✅ Show success popup
    setShowSuccessPopup(true);

  } catch {
    alert("Remove failed");
  }
};


  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteProductId(null);
  };

  /* ================= UI STATES ================= */
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

const validItems = cart?.items?.filter((item) => item.product) || [];

if (validItems.length === 0) {
  return (
    <div style={styles.empty}>
      <h2>Your cart is empty 🛒</h2>
    </div>
  );
}




 const total = validItems.reduce((sum, item) => {
  if (!item.product) return sum;
  return sum + (item.product?.price || 0) * item.quantity;
}, 0);


  /* ================= RENDER ================= */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Your Shopping Cart 🛍</h2>
{validItems.map((item) => (
          <div key={item.product._id} style={styles.card}>
            <div style={styles.left}>
              <h3>{item.product?.name}</h3>
            <p style={styles.price}>
  ₹{item.product?.price || 0}
</p>

            </div>

            <div style={styles.qtySection}>
              <button
                style={styles.qtyBtn}
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity - 1)
                }
              >
                -
              </button>

              <span style={styles.qtyValue}>{item.quantity}</span>

              <button
                style={styles.qtyBtn}
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <div style={styles.right}>
              <p style={styles.total}>
               ₹{(item.product?.price || 0) * item.quantity}

              </p>

              <div style={styles.actions}>
                <button
                  style={styles.buyBtn}
                  onClick={() => buyNow(item)}
                >
                  Buy Now
                </button>

                <button
                  style={styles.removeBtn}
                  onClick={() =>
                    handleDeleteClick(item.product._id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* TOTAL SECTION */}
        <div style={styles.summary}>
          <h3>Total Amount: ₹{total}</h3>

          <button
            style={styles.checkoutBtn}
            onClick={() =>
              navigate("/checkout", { state: { source: "cart" } })
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* DELETE CONFIRM POPUP */}
      {showDeletePopup && (
        <UserPopup
          type="confirm"
          title="Remove Product?"
          message="Are you sure you want to remove this product from your cart?"
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {/* SUCCESS POPUP */}
{showSuccessPopup && (
  <UserPopup
    type="success"
    title="Removed Successfully 🎉"
    message="Product has been successfully removed from your cart."
    onConfirm={() => setShowSuccessPopup(false)}
  />
)}

    </div>
  );
}

/* ================= PREMIUM STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px",
    background:
      "linear-gradient(135deg,#f0f9ff,#fdf2f8,#eef2ff)",
    fontFamily: "Inter, sans-serif",
  },

  container: {
    maxWidth: "1000px",
    margin: "auto",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#0f172a",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "22px",
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },

  left: {
    flex: 1,
  },

  price: {
    color: "#64748b",
    fontSize: "14px",
  },

  qtySection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  qtyBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    border: "none",
    background: "#e0f2fe",
    fontSize: "18px",
    cursor: "pointer",
  },

  qtyValue: {
    fontWeight: "600",
  },

  right: {
    textAlign: "right",
  },

  total: {
    fontWeight: "600",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  buyBtn: {
    padding: "8px 14px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#38bdf8,#22d3ee)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  removeBtn: {
    padding: "8px 14px",
    borderRadius: "14px",
    border: "1px solid #fecaca",
    background: "#fff",
    color: "#dc2626",
    cursor: "pointer",
  },

  summary: {
    marginTop: "40px",
    padding: "30px",
    borderRadius: "24px",
    backdropFilter: "blur(25px)",
    background: "rgba(255,255,255,0.8)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  checkoutBtn: {
    marginTop: "15px",
    padding: "14px 28px",
    borderRadius: "18px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    background:
      "linear-gradient(135deg,#8b5cf6,#ec4899)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 15px 35px rgba(139,92,246,0.3)",
  },

  empty: {
    textAlign: "center",
    marginTop: "100px",
  },
};

export default Cart;
