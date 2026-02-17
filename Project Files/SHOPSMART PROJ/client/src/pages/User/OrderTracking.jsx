import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function OrderTracking() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [status, setStatus] = useState("initiated");
  const [celebrate, setCelebrate] = useState(false);

  // 🐢 SLOW TRUCK MOVEMENT (MORE TIME)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("placed");
    }, 1500); // ⏳ increased time (4 seconds)

    return () => clearTimeout(timer);
  }, []);

  const progressPercent = status === "placed" ? 100 : 0;

  // 🎉 FULL SCREEN CELEBRATION
  const handleCelebrate = () => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2500); // 🎆 longer celebration
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", position: "relative" }}>
      <h2>📦 Track Your Order</h2>
      <p>
        Order ID: <strong>{orderId}</strong>
      </p>

      {/* 🚚 PROGRESS BAR */}
      <div style={{ position: "relative", marginTop: 40 }}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className="truck"
          style={{ left: `calc(${progressPercent}% - 20px)` }}
        >
          🚚
        </div>
      </div>

      {/* 📍 STEPS */}
      <div className="steps">
        <span className={status === "initiated" ? "active" : ""}>
          🟡 Order Initiated
        </span>
        <span className={status === "placed" ? "active" : ""}>
          ✅ Order Placed Successfully
        </span>
      </div>

      {/* 🎉 BUTTON */}
      {status === "placed" && (
        <div style={{ marginTop: 50, textAlign: "center" }}>
          <button className="celebrate-btn" onClick={handleCelebrate}>
            🎊 Enjoy the Shopping
          </button>
        </div>
      )}

      {/* 💥 FULL SCREEN CRACKERS */}
      {celebrate && (
        <div className="confetti">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                fontSize: `${16 + Math.random() * 20}px`,
              }}
            >
              🎆
            </span>
          ))}
        </div>
      )}

      <style>{`
        .progress-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #22c55e);
          transition: width 2.5s ease-in-out; /* 🐢 slower fill */
        }

        .truck {
          position: absolute;
          top: -32px;
          font-size: 26px;
          transition: left 2.5s ease-in-out; /* 🐢 slower truck */
        }

        .steps {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 15px;
        }

        .steps span {
          color: #9ca3af;
        }

        .steps .active {
          color: #16a34a;
          font-weight: 600;
        }

        /* 🎉 BUTTON */
        .celebrate-btn {
          padding: 16px 30px;
          font-size: 17px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(90deg, #22c55e, #15803d);
          color: white;
          font-weight: 600;
          box-shadow: 0 12px 24px rgba(34, 197, 94, 0.45);
          transition: transform 0.25s ease;
        }

        .celebrate-btn:hover {
          transform: scale(1.08);
        }

        /* 💥 FULL SCREEN CONFETTI */
        .confetti {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .confetti span {
          position: absolute;
          top: -10%;
          animation: fall 5s ease-out forwards;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderTracking;
