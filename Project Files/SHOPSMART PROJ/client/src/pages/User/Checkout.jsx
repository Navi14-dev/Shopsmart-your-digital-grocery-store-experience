import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";

/* 🎉 CONFETTI */
import confetti from "https://cdn.skypack.dev/canvas-confetti";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowData = location.state?.buyNow || null;
  const buyNowSource = location.state?.buyNowSource || null;
// values: "PRODUCT" | "CART"


  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
const [paymentMethod, setPaymentMethod] = useState("COD");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* 🔥 UI STATES */
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  /* 🚚 ORDER PROGRESS (NEW) */
  const [orderStep, setOrderStep] = useState(0);

  /* 📄 PDF MODAL (NEW) */
  const [showInvoice, setShowInvoice] = useState(false);

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  let successAudio;

  const initSuccessSound = () => {
    if (!successAudio) {
      successAudio = new Audio("/success.mp3");
      successAudio.load();
      successAudio.volume = 0.6;
    }
  };

  const playSuccessSound = () => {
    if (!successAudio) return;
    successAudio.currentTime = 0;
    successAudio.play().catch(() => {});
  };

  
  /* ===============================
     FETCH CART
  =============================== */
  useEffect(() => {
    if (buyNowData) {
      setLoading(false);
    } else {
      api
        .get("/cart")
        .then((res) => setCart(res.data))
        .catch(() => navigate("/cart"))
        .finally(() => setLoading(false));
    }
  }, [buyNowData, navigate]);

  if (loading) return <h3>Loading...</h3>;

  const items = buyNowData
    ? [{ product: buyNowData.product, quantity: buyNowData.quantity }]
    : cart?.items || [];

  if (items.length === 0) return <h3>Your cart is empty 🛒</h3>;

 const total = items.reduce((sum, item) => {
  if (!item.product) return sum;
  return sum + (item.product.price || 0) * item.quantity;
}, 0);

  /* ===============================
     PLACE ORDER
  =============================== */
  const placeOrder = async () => {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    )
      return alert("Please fill all customer details");

    if (!/^\d{10}$/.test(customer.phone))
      return alert("Phone number must be exactly 10 digits");

    if (!/^\d{6}$/.test(customer.pincode))
      return alert("Pincode must be exactly 6 digits");

    try {
      const payload = buyNowData
        ? {
            source: "buynow",
             buyNowSource: buyNowSource,
            productId: buyNowData.product._id,
            quantity: buyNowData.quantity,
            customerDetails: customer,
            paymentMethod: paymentMethod,
           
          }
        : {
            source: "cart",
            customerDetails: customer,
            paymentMethod: paymentMethod,
        
          };

      const res = await api.post("/orders/checkout", payload);

      initSuccessSound();
      playSuccessSound();

      if (buyNowData?.fromCart) {

await api.delete(`/cart/remove/${buyNowData.product._id}`);

}

// Full Cart Checkout → clear entire cart

if (!buyNowData) {

await api.delete("/cart/clear");

}
      // if (!buyNowData) await api.delete("/cart/clear");

      /* 🎉 CONFETTI FIX (burst + fall) */
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 120 }), 300);

      setOrderId(res.data.orderId);
      setShowSuccess(true);

      /* 🚚 ORDER PROGRESS ANIMATION */
      setOrderStep(1);
      setTimeout(() => setOrderStep(2), 800);
      setTimeout(() => setOrderStep(3), 1600);

      setTimeout(() => {
        navigate("/order-success", {
          state: { orderId: res.data.orderId },
        });
      }, 4500);
      navigate("/order-tracking", { state: { orderId } });
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    }
    

  };

  return (
    <div className="checkout-wrapper">
    <div className="checkout-card">
      <h2 className="checkout-title">Checkout</h2>
      {/* ===============================
          ✅ SUCCESS POPUP
      =============================== */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: isDarkMode ? "#111827" : "#ffffff",
            color: isDarkMode ? "#fff" : "#000",
            padding: "24px 34px",
            borderRadius: 18,
            boxShadow: "0 25px 45px rgba(0,0,0,0.35)",
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          {/* ✔️ ANIMATED CHECKMARK SVG */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 52 52"
            style={{ margin: "auto" }}
          >
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              className="check-circle"
            />
            <path
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              d="M14 27 l7 7 l17 -17"
              className="check-mark"
            />
          </svg>

          <p style={{ marginTop: 10, fontWeight: 600 }}>
            Order placed successfully!
          </p>

          {/* 🚚 ORDER PROGRESS */}
          <div style={{ marginTop: 14, fontSize: 14 }}>
            <span className={orderStep >= 1 ? "active-step" : ""}>📦 Placed</span>{" "}
            →{" "}
            <span className={orderStep >= 2 ? "active-step" : ""}>
              ⚙ Processing
            </span>{" "}
            →{" "}
            <span className={orderStep >= 3 ? "active-step" : ""}>
              🚚 Shipped
            </span>
          </div>

          {/* 📄 PDF PREVIEW MODAL */}
          <button
            style={{
              marginTop: 16,
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => setShowInvoice(true)}
          >
            📄 Preview Invoice
          </button>
        </div>
      )}

      {/* 📄 INVOICE MODAL */}
      {showInvoice && (
        <div className="modal">
          <div className="modal-content">
            <iframe
              src={`/orders/${orderId}/invoice`}
              title="Invoice"
              width="100%"
              height="100%"
            />
            <button onClick={() => setShowInvoice(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ================= ORDER SUMMARY ================= */}
      <div className="section">
        <h3>Order Summary</h3>
        {items.filter((item) => item.product).map((item) => (
          <div key={item.product._id} className="summary-item">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>
             ₹{(item.product?.price || 0) * item.quantity}

            </span>
          </div>
        ))}
        <div className="total">
          Total: ₹{total}
        </div>
      </div>

      {/* ================= CUSTOMER DETAILS ================= */}
      <div className="section">
        <h3>Customer Details</h3>

        <input
          className="input"
          placeholder="Full Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Phone Number"
          value={customer.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10)
              setCustomer({ ...customer, phone: value });
          }}
        />

        <textarea
          className="input"
          placeholder="Address"
          value={customer.address}
          onChange={(e) =>
            setCustomer({ ...customer, address: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="City"
          value={customer.city}
          onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
        />

        <input
          className="input"
          placeholder="Pincode"
          value={customer.pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 6)
              setCustomer({ ...customer, pincode: value });
          }}
        />
      </div>

      {/* ================= PAYMENT ================= */}
      <div className="section">
        <h3>Payment Method</h3>

        <select
          className="input"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="UPI">UPI</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="NET_BANKING">Net Banking</option>
        </select>
      </div>

      <button className="place-btn" onClick={placeOrder}>
        Confirm & Place Order
      </button>
    </div>

      {/* 🎨 ANIMATIONS */}
      <style>{`
        .check-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: circle 0.6s forwards;
        }
        .check-mark {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: check 0.4s 0.6s forwards;
        }
        @keyframes circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes check {
          to { stroke-dashoffset: 0; }
        }
        .active-step {
          font-weight: 600;
          color: #22c55e;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-content {
          background: white;
          width: 80%;
          height: 80%;
          padding: 10px;
          border-radius: 10px;
        }


        .checkout-wrapper {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa, #e4ecf7);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px 16px;
      }

      .checkout-card {
        width: 100%;
        max-width: 700px;
        backdrop-filter: blur(18px);
        background: rgba(255, 255, 255, 0.7);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
        transition: 0.3s ease;
      }

      .checkout-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: 30px;
        font-weight: 600;
      }

      .section {
        margin-bottom: 30px;
      }

      .section h3 {
        margin-bottom: 14px;
        font-weight: 600;
        font-size: 18px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 15px;
      }

      .total {
        margin-top: 12px;
        font-weight: 600;
        font-size: 18px;
      }

      .input {
        width: 100%;
        padding: 12px 14px;
        margin-bottom: 14px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.08);
        background: rgba(255,255,255,0.9);
        font-size: 14px;
        transition: 0.25s ease;
        outline: none;
      }

      .input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
      }

      textarea.input {
        resize: none;
        min-height: 80px;
      }

      .place-btn {
        width: 100%;
        padding: 14px;
        font-size: 16px;
        border-radius: 16px;
        border: none;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: 0.3s ease;
        box-shadow: 0 15px 30px rgba(37,99,235,0.3);
      }

      .place-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(37,99,235,0.4);
      }

      .place-btn:active {
        transform: scale(0.98);
      }
      `}</style>
    </div>
  );
}

export default Checkout;
