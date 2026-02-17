import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/block`);
      fetchUsers(); // refresh list
    } catch {
      alert("Action failed");
    }
  };

  if (loading) return <p style={{ color: "#fff" }}>Loading users...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Manage Users</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.isBlocked ? "🚫 Blocked" : "✅ Active"}
              </td>
              <td>
                <button
                  onClick={() => toggleBlock(u._id)}
                  style={{
                    background: u.isBlocked ? "#16a34a" : "#dc2626",
                    color: "#fff",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#020617",
    minHeight: "100vh",
    color: "#e5e7eb"
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};

export default AdminUsers;
