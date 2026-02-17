function AdminPopup({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "confirm", // confirm | success
}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        <div style={styles.actions}>
          {type === "confirm" && (
            <>
              <button style={styles.cancelBtn} onClick={onCancel}>
                {cancelText}
              </button>
              <button style={styles.confirmBtn} onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          )}

          {type === "success" && (
            <button style={styles.confirmBtn} onClick={onConfirm}>
              OK
            </button>
          )}
          {type === "loading" && (
  <div style={styles.loaderWrap}>
    <div style={styles.loader}></div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.75)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",     // ✅ vertical center
  justifyContent: "center", // ✅ horizontal center
  zIndex: 9999,
},


 popup: {
  width: "100%",
  maxWidth: "420px",
  background: "linear-gradient(180deg,#020617,#0f172a)",
  borderRadius: "20px",                 // ✅ full rounded
  padding: "26px",
  animation: "scaleIn 0.3s cubic-bezier(.4,0,.2,1)",
      // ✅ better for center
  boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
  color: "#e5e7eb",
},


  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  message: {
    fontSize: "14px",
    color: "#cbd5f5",
    marginBottom: "24px",
  },

  actions: {
    display: "flex",
    gap: "12px",
  },

  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  confirmBtn: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg,#22d3ee,#38bdf8)",
    border: "none",
    color: "#020617",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },


  loaderWrap: {
  display: "flex",
  justifyContent: "center",
  padding: "20px 0",
},

loader: {
  width: "42px",
  height: "42px",
  border: "4px solid rgba(255,255,255,0.2)",
  borderTop: "4px solid #38bdf8",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
},

};

export default AdminPopup;
