import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Lottie from "lottie-react";
import fireworksAnim from "../../assets/Success celebration.json";
import fireSound from "/freesound_crunchpixstudio-purchase-success-384963.mp3";
import successsound from "/updatepelgo-success-221935.mp3";


function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [celebrateNow, setCelebrateNow] = useState(false);
  const [rating, setRating] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const playSound = () => new Audio(fireSound).play();
  const playsSound = () => new Audio(successsound).play();


  const celebrate = () => {
    setCelebrateNow(true);
    playSound();
    setTimeout(() => setCelebrateNow(false), 4200);
  };

  const celebratesound = () => {
    setCelebrateNow(true);
    playsSound();
    setTimeout(() => setCelebrateNow(false), 4200);
  };

  const generateCoupon = () => {
    const used = JSON.parse(localStorage.getItem("usedCoupons")) || [];
    let code;

    do {
      code = "PREM-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    } while (used.includes(code));

    used.push(code);
    localStorage.setItem("usedCoupons", JSON.stringify(used));

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return {
      code,
      expiry: expiry.toDateString(),
    };
  };

  const revealCoupon = () => {
    if (!coupon) setCoupon(generateCoupon());
    setRevealed(true);
    celebrate();
  };

  return (
    <div className="premium-page">
      {celebrateNow && (
        <div className="fx">
          <Lottie animationData={fireworksAnim} loop />
        </div>
      )}

      <div className="glass-card">
        <span className="status-pill">Order Confirmed</span>

        <h1>Thanks for choosing ShopSmart</h1>
        <p className="muted">
          Your order has been placed successfully and is now being prepared.
        </p>

        {orderId && <p className="order-id">Order ID • {orderId}</p>}

        {/* EXPERIENCE */}
        <button className="cta-main" onClick={celebratesound}>
          I loved the experience
        </button>

        {/* RATING */}
        <div className="rating-block">
          <span>Rate your experience</span>
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={rating >= n ? "star active" : "star"}
                onClick={() => {
                  setRating(n);
                  celebratesound();
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* COUPON */}
        <div className="reward-card">
          {!revealed ? (
            <>
              <h3>Exclusive Reward Unlocked</h3>
              <p>Tap below to reveal your coupon</p>
              <button className="reveal-btn" onClick={revealCoupon}>
                Reveal My Reward
              </button>
            </>
          ) : (
            <>
              <h3>Your Premium Coupon</h3>
              <div className="coupon">{coupon.code}</div>
              <p className="expiry">Valid until {coupon.expiry}</p>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="footer-actions">
          <button onClick={() => navigate("/orders")}>My Orders</button>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>

      <style>{`
        .premium-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, #c7d2fe, #eef2ff 45%, #f8fafc);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          margin-top:-50px;
        }

        .glass-card {
          width: 520px;
          padding: 48px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .status-pill {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 18px;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .muted {
          color: #64748b;
          margin-bottom: 24px;
        }

        .order-id {
          font-size: 13px;
          color: #475569;
          margin-bottom: 34px;
        }

        .cta-main {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          border: none;
          padding: 16px;
          font-size: 16px;
          border-radius: 18px;
          cursor: pointer;
          margin-bottom: 30px;
        }

        .rating-block {
          margin-bottom: 34px;
        }

        .rating-block span {
          color: #64748b;
          font-size: 14px;
        }

        .star {
          font-size: 30px;
          margin: 0 5px;
          color: #c7d2fe;
          cursor: pointer;
        }

        .star.active {
          color: #fbbf24;
        }

        .reward-card {
          background: linear-gradient(135deg, #f8fafc, #eef2ff);
          border-radius: 22px;
          padding: 28px;
          border: 1px solid #c7d2fe;
          margin-bottom: 34px;
        }

        .reward-card h3 {
          margin-bottom: 8px;
        }

        .reward-card p {
          color: #475569;
          margin-bottom: 16px;
        }

        .reveal-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 14px;
          cursor: pointer;
        }

        .coupon {
          font-size: 24px;
          letter-spacing: 4px;
          font-weight: 700;
          color: #4338ca;
          margin-bottom: 6px;
        }

        .expiry {
          font-size: 13px;
          color: #64748b;
        }

        .footer-actions {
          display: flex;
          justify-content: space-between;
        }

        .footer-actions button {
          background: #f1f5f9;
          border: none;
          padding: 12px 20px;
          border-radius: 14px;
          cursor: pointer;
        }

        .fx {
          position: fixed;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default OrderSuccess;
