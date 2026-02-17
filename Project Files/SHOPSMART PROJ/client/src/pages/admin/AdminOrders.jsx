import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { orderStatus: status });
    fetchOrders();
  };

  // const exportExcel = () => {
  //   window.open("/api/admin/orders/export/excel", "_blank");
  // };

  // const exportPDF = () => {
  //   window.open("/api/admin/orders/export/pdf", "_blank");
  // };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>📦 All Orders (Admin)</h2>

      {/* Export Buttons */}
      <div style={{ marginBottom: 20 }}>
        {/* <button onClick={exportExcel} style={styles.exportBtn}>
          📊 Export Excel
        </button> */}
        {/* <button onClick={exportPDF} style={styles.exportBtn}>
          📄 Export PDF
        </button> */}
      </div>

      {orders.map((order) => {
        const isLocked =
          order.orderStatus === "DELIVERED" ||
          order.orderStatus === "CANCELLED";

        return (
          <div key={order._id} style={styles.card}>
            <p>
              <b>User:</b> {order.userId?.name}
            </p>
            <p>
              <b>Total:</b> ₹{order.totalAmount}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span style={statusStyle(order.orderStatus)}>
                {order.orderStatus}
              </span>
            </p>

            {/* Status Control */}
            <select
              value={order.orderStatus}
              disabled={isLocked}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
              style={styles.select}
            >
              <option value="PLACED">PLACED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              {/* <option value="CANCELLED">CANCELLED</option> */}
            </select>

            {isLocked && (
              <p style={{ color: "#9ca3af", fontSize: 12 }}>
                Status locked
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const statusStyle = (status) => {
  switch (status) {
    case "PLACED":
      return { color: "#facc15" };
    case "SHIPPED":
      return { color: "#38bdf8" };
    case "DELIVERED":
      return { color: "#22c55e" };
    case "CANCELLED":
      return { color: "#ef4444" };
    default:
      return {};
  }
};

const styles = {
  card: {
    border: "1px solid #1f2937",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    background: "#020617",
    color: "#e5e7eb",
  },
  select: {
    marginTop: 10,
    padding: 6,
    borderRadius: 6,
  },
  exportBtn: {
    marginRight: 10,
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default AdminOrders;
