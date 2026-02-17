import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import ordersAnim from "../../assets/Order Box Animation.json";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/myorders");
        setOrders(res.data);
      } catch (err) {
        alert("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDeliveryDate = (createdAt) => {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 0);
    return deliveryDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-wrapper">
        <div className="orders-container empty">
          <Lottie animationData={ordersAnim} style={{ height: 200 }} />
          <h3>No orders yet 📦</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-wrapper">
      <div className="orders-container">
        <div className="header-section">
          <Lottie animationData={ordersAnim} style={{ height: 150 }} />
          <h2 className="title">My Orders</h2>
        </div>

        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              {/* ✅ FULL ORDER ID */}
              <span className="order-id">
                Order #{order._id}
              </span>

              <span className={`status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            </div>

            <p><b>Ordered On:</b> {formatDateTime(order.createdAt)}</p>
            <p><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Payment Method:</b> {order.paymentMethod || "COD"}</p>
            <p>
              <b>Payment Status:</b>{" "}
              {order.paymentMethod === "COD" ? "Pending" : "Paid"}
            </p>
            <p>
              <b>Estimated Delivery:</b>{" "}
              {getDeliveryDate(order.createdAt)} (10 hours)
            </p>

           <div className="items">
{order.items.map((item) => (
  <div key={item._id}>
    {item.productId
      ? `${item.productId.name} × ${item.quantity}`
      : `Product Removed × ${item.quantity}`}
  </div>
))}


</div>


            <p>
              <b>Tracking:</b>{" "}
              {order.orderStatus === "PLACED" && "📦 Order Placed"}
              {order.orderStatus === "SHIPPED" && "🚚 On the way"}
              {order.orderStatus === "DELIVERED" && "✅ Delivered"}
              {order.orderStatus === "CANCELLED" && "❌ Cancelled"}
            </p>

            <div className="actions">
              <button
                className="view-btn"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                View Details
              </button>

              {order.orderStatus === "PLACED" && (
                <button
                  className="cancel-btn"
                  onClick={() => setCancelOrderId(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 CANCEL CONFIRM POPUP */}
      {cancelOrderId && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Cancel this order?</h3>
            <p>Are you Sure to Cancel the Order ?</p>

            <div className="popup-actions">
              <button
                className="popup-cancel"
                onClick={() => setCancelOrderId(null)}
              >
                Keep Order
              </button>

              <button
                className="popup-confirm"
                onClick={async () => {
                  await api.put(`/orders/${cancelOrderId}/cancel`);
                  setCancelOrderId(null);

                  // ✅ SHOW SUCCESS POPUP
                  setShowSuccessPopup(true);

                  setTimeout(() => {
                    setShowSuccessPopup(false);
                    window.location.reload();
                  }, 2000);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP AFTER CANCELLATION */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card success-popup">
            <h3>Order Cancelled Successfully ❌</h3>
            <p>Your order has been cancelled.</p>
          </div>
        </div>
      )}

      {/* 🎨 STYLES */}
      <style>{`
        .orders-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg,#f0f9ff,#fdf2f8,#eef2ff);
          padding: 40px 16px;
          font-family: Inter, sans-serif;
        }

        .orders-container {
          max-width: 900px;
          margin: auto;
        }

        .header-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
        }

        .order-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          word-break: break-all;
        }

        .status {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .placed { background:#dbeafe; color:#2563eb; }
        .shipped { background:#fef9c3; color:#ca8a04; }
        .delivered { background:#dcfce7; color:#16a34a; }
        .cancelled { background:#fee2e2; color:#dc2626; }

        .actions {
          margin-top: 14px;
          display: flex;
          gap: 10px;
        }

        .view-btn, .cancel-btn {
          padding: 10px 16px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .view-btn {
          background: linear-gradient(135deg,#38bdf8,#22d3ee);
          color: white;
        }

        .cancel-btn {
          background: #f87171;
          color: white;
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

        .success-popup {
          border-left: 6px solid #ef4444;
        }

        .popup-actions {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        .popup-cancel {
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

        .empty {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Orders;
