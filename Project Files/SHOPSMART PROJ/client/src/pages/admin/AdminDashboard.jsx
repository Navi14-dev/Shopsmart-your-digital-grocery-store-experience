import { useEffect, useState } from "react";
import api from "../../api/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  const [page, setPage] = useState({
    users: 1,
    products: 1,
    orders: 1,
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch {
        alert("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (loading) return <p style={{ color: "#fff" }}>Loading dashboard...</p>;
  if (!stats) return null;

  /* ---------------- PAGINATION ---------------- */

  const paginate = (data, section) => {
    const start = (page[section] - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const renderPagination = (total, section) => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div style={styles.pagination}>
        <button
          disabled={page[section] === 1}
          onClick={() =>
            setPage((p) => ({ ...p, [section]: p[section] - 1 }))
          }
        >
          ◀
        </button>

        <span>
          Page {page[section]} / {totalPages}
        </span>

        <button
          disabled={page[section] === totalPages}
          onClick={() =>
            setPage((p) => ({ ...p, [section]: p[section] + 1 }))
          }
        >
          ▶
        </button>
      </div>
    );
  };

  /* ---------------- CHART DATA ---------------- */

  const ordersByDate = {};
  const revenueByDate = {};

  stats.orders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;

    if (o.paymentStatus === "PAID") {
      revenueByDate[date] =
        (revenueByDate[date] || 0) + o.totalAmount;
    }
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div style={styles.cards}>
        <div style={styles.card}>👥 Users: {stats.totalUsers}</div>
        <div style={styles.card}>📦 Products: {stats.totalProducts}</div>
        <div style={styles.card}>🛒 Orders: {stats.totalOrders}</div>
        <div style={styles.card}>💰 Revenue: ₹{stats.totalRevenue}</div>
      </div>

      {/* USERS */}
      <h2 onClick={() => toggleSection("users")} style={styles.sectionTitle}>
        👥 Users {openSection === "users" ? "▲" : "▼"}
      </h2>

      {openSection === "users" && (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {paginate(stats.users, "users").map((u) => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.role}</td>
                    <td style={styles.td}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(stats.users.length, "users")}
        </>
      )}

      {/* PRODUCTS */}
      <h2 onClick={() => toggleSection("products")} style={styles.sectionTitle}>
        📦 Products {openSection === "products" ? "▲" : "▼"}
      </h2>

      {openSection === "products" && (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {paginate(stats.products, "products").map((p) => (
                  <tr key={p._id} style={styles.tr}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>₹{p.price}</td>
                    <td style={styles.td}>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(stats.products.length, "products")}
        </>
      )}

      {/* ORDERS */}
      <h2 onClick={() => toggleSection("orders")} style={styles.sectionTitle}>
        🛒 Orders {openSection === "orders" ? "▲" : "▼"}
      </h2>

      {openSection === "orders" && (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginate(stats.orders, "orders").map((o) => (
                  <tr key={o._id} style={styles.tr}>
                    <td style={styles.td}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>₹{o.totalAmount}</td>
                    <td style={styles.td}>
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td style={styles.td}>{o.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(stats.orders.length, "orders")}
        </>
      )}

      {/* CHARTS */}
      <h2 style={styles.sectionTitle}>📊 Analytics</h2>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <Line
            data={{
              labels: Object.keys(ordersByDate),
              datasets: [
                {
                  label: "Orders",
                  data: Object.values(ordersByDate),
                  borderColor: "#22d3ee",
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div style={styles.chartCard}>
          <Line
            data={{
              labels: Object.keys(revenueByDate),
              datasets: [
                {
                  label: "Revenue",
                  data: Object.values(revenueByDate),
                  borderColor: "#4ade80",
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e5e7eb",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
};
const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    background: "#0f172a",
    padding: "24px",
    borderRadius: "16px",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: "40px",
    cursor: "pointer",
  },

  tableWrapper: {
    background: "#020617",
    padding: "16px",
    borderRadius: "16px",
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
  },
  tr: {
    background: "#0f172a",
    transition: "all 0.25s ease",
  },
  td: {
    padding: "12px",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginBottom: "30px",
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))",
    gap: "30px",
  },
  chartCard: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "18px",
    height: "300px",
  },
};

export default AdminDashboard;
