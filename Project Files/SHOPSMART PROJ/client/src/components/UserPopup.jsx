function UserPopup({
  type = "success", // loading | success | confirm
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        {type === "loading" && (
          <div style={styles.loader}></div>
        )}

        {type === "success" && (
          <button style={styles.okBtn} onClick={onConfirm}>
            OK
          </button>
        )}

        {type === "confirm" && (
          <div style={styles.buttonGroup}>
            <button style={styles.cancelBtn} onClick={onCancel}>
              {cancelText}
            </button>

            <button style={styles.confirmBtn} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(255,255,255,0.4)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popup: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#0f172a",
  },

  message: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },

  okBtn: {
    padding: "12px 24px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg,#38bdf8,#22d3ee)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },

  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "999px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
  },

  confirmBtn: {
    padding: "10px 20px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  loader: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default UserPopup;
