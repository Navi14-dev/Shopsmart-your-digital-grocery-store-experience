import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import Lottie from "lottie-react";
import orderDetailsAnim from "../../assets/OrderDetails.json";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Download Invoice
  const downloadInvoice = async () => {
    try {
      const res = await api.get(`/orders/${order._id}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Invoice download failed");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get("/orders/myorders");
        const foundOrder = res.data.find((o) => o._id === id);
        setOrder(foundOrder);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const cancelOrder = async () => {
    try {
      await api.put(`/orders/${order._id}/cancel`);
      setShowCancelPopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Cancel failed");
    }
  };

  if (loading)
    return (
      <div className="loader-wrapper">
        <Lottie animationData={orderDetailsAnim} style={{ height: 180 }} />
      </div>
    );

  if (!order) return <h3 style={{ textAlign: "center" }}>Order not found</h3>;

  return (
    <div className="details-wrapper">
      <div className="details-container">
        {/* 🔥 LOTTIE HEADER */}
        <div className="header">
          <Lottie animationData={orderDetailsAnim} style={{ height: 140 }} />
          <h2>Order Details</h2>
        </div>

        {/* 🧾 ORDER INFO CARD */}
        <div className="glass-card">
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Status:</b> {order.orderStatus}</p>
          <p><b>Payment Method:</b> {order.paymentMethod || "COD"}</p>
          <p>
            <b>Payment Status:</b>{" "}
            {order.paymentMethod === "COD" ? "Pending" : "Paid"}
          </p>
          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* 🛒 ITEMS */}
        <h3 className="items-title">Items</h3>

        {order.items.map((item, idx) => (
          <div key={idx} className="item-card">
            <p><b>{item.productId?.name || "Product not available"}</b></p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ₹{item.price}</p>

            <button className="invoice-btn" onClick={downloadInvoice}>
              Download Invoice
            </button>
          </div>
        ))}

        {/* ❌ CANCEL BUTTON */}
        {order.orderStatus === "PLACED" && (
          <button
            className="cancel-btn"
            onClick={() => setShowCancelPopup(true)}
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* 🔴 CANCEL CONFIRM POPUP */}
      {showCancelPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Cancel this order?</h3>
            <p>This action cannot be undone.</p>

            <div className="popup-actions">
              <button
                className="popup-keep"
                onClick={() => setShowCancelPopup(false)}
              >
                Keep Order
              </button>

              <button
                className="popup-confirm"
                onClick={cancelOrder}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card success">
            <h3>Order Cancelled Successfully</h3>
          </div>
        </div>
      )}

      {/* 🎨 PREMIUM LIGHT STYLES */}
      <style>{`
        .details-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg,#f0f9ff,#fdf2f8,#eef2ff);
          padding: 40px 16px;
          font-family: Inter, sans-serif;
        }

        .details-container {
          max-width: 700px;
          margin: auto;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .glass-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .items-title {
          margin-bottom: 15px;
        }

        .item-card {
          background: white;
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .invoice-btn {
          margin-top: 8px;
          padding: 8px 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg,#38bdf8,#22d3ee);
          color: white;
          font-weight: 600;
        }

        .cancel-btn {
          margin-top: 20px;
          padding: 12px 20px;
          border-radius: 16px;
          border: none;
          background: #ef4444;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .cancel-btn:hover {
          transform: translateY(-2px);
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .popup-card {
          background: white;
          padding: 30px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          width: 340px;
        }

        .popup-actions {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        .popup-keep {
          background: #e5e7eb;
          border: none;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
        }

        .popup-confirm {
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
        }

        .success {
          background: linear-gradient(135deg,#d1fae5,#f0fdf4);
          color: #065f46;
          font-weight: 600;
        }

        .loader-wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg,#f0f9ff,#fdf2f8,#eef2ff);
        }
      `}</style>
    </div>
  );
}

export default OrderDetails;
