import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import featured1 from "../../assets/featured/featured1.webp";
import featured2 from "../../assets/featured/featured2.webp";
import featured3 from "../../assets/featured/featured3.jpg";
import featured4 from "../../assets/featured/featured4.jpg";

function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  /* ===============================
     PARALLAX + SCROLL REVEAL
  =============================== */
  
  useEffect(() => {
  let observer;

  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener("scroll", handleScroll);

  const reveals = document.querySelectorAll(".reveal");
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  });

  reveals.forEach(el => observer.observe(el));

  return () => {
    window.removeEventListener("scroll", handleScroll);
    observer?.disconnect();
  };
}, []);

const featuredProducts = [
  {
    id: 1,
    image: featured1,
    name: " Fruits ",
    price: "Starts from ₹249",
  },
  {
    id: 2,
    image: featured2,
    name: "vegetables",
    price: "Starts from ₹149",
  },
  {
    id: 3,
    image: featured3,
    name: "Rice Bags",
    price: "Starts from ₹1500",
  },
  {
    id: 4,
    image: featured4,
    name: "All Accessories",
    price: "Starts from ₹199",
  },
];

  return (
    <div className="home">
      {/* ===============================
          HERO
      =============================== */}
      <section
        className="hero"
        style={{ backgroundPositionY: `${scrollY * 0.4}px` }}
      >
        <div className="hero-inner reveal">
          <div className="hero-text">
           <img
        src="/shopsmartlogo.png"
        alt="ShopSmart Logo"
        className="hero-logo"
      />
            <p>Premium shopping experience built for smart buyers</p>
            <button onClick={() => navigate("/products")}>Shop Now</button>
          </div>

          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            class="hero-lottie"
          />
        </div>
      </section>

      {/* ===============================
          FEATURED PRODUCTS
      =============================== */}
      <section className="section featured">
        <h2 className="featured-title reveal">Featured Products</h2>

        <div className="featured-grid">
         {featuredProducts.map((product) => (
  <div
    key={product.id}
    className="featured-card reveal"
    onClick={() => navigate("/products")}
  >
    <img src={product.image} alt={product.name} />
    <h4>{product.name}</h4>
    <span>{product.price}</span>
  </div>
))}

        </div>
      </section>

      {/* ===============================
          ABOUT
      =============================== */}
      <section className="section about">
        <div className="animation">
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_yd8fbnml.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          />
        </div>

        <div className="content reveal">
          <h2>About ShopSmart</h2>
          <p>
            ShopSmart is a next-generation e-commerce platform designed to bridge
            the gap between technology and everyday shopping needs.
          </p>
          <p>
            We combine premium UI, secure payments, real-time tracking, and
            scalable cloud architecture to deliver a world-class shopping
            experience.
          </p>
        </div>
      </section>

      {/* ===============================
          MISSION (FIXED LOTTIE)
      =============================== */}
      <section className="section light">
        <div className="split reveal">
          <lottie-player
            src="/lottie/mission.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            class="about-lottie"
          />

          <div>
            <h2>Our Mission</h2>
            <p>
              At <strong>ShopSmart</strong>, our mission is to redefine online
              shopping by making it smarter, faster, and more human-centric.
            </p>
            <p>
              We focus on transparency, speed, and trust — delivering not just
              products, but confidence and convenience.
            </p>
            <p>🚀 Smart tech. Smart choices. Smart shopping.</p>
          </div>
        </div>
      </section>

      {/* ===============================
          TEAM
      =============================== */}
      <section className="section team">
        <h2>Meet Our Team</h2>

        <div className="team-grid">
          {[
            { name: "Sivanandan Chandam", role: "Team Leader" },
            { name: "Naveen Kumar Lukalapu", role: "Team Member" },
            { name: "Trivikram Tejosh Tandra", role: "Team Member" },
            { name: "Vadlamudi Surya Prakash", role: "Team Member" },
          ].map((member, i) => (
            <div className="team-card reveal" key={i}>
              <lottie-player
  src={`/lottie/Profile${i+1}.json`}
  background="transparent"
  speed="1"
  loop
  autoplay
  class="avatar"
/>

              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===============================
          FAQ
      =============================== */}
      <section className="section faq">
        <h2>Frequently Asked Questions</h2>

        <details>
          <summary>How do I place an order?</summary>
          <p>Add products to cart, choose payment, and confirm checkout.</p>
        </details>

        <details>
          <summary>What payment methods are supported?</summary>
          <p>COD, UPI, Debit Card, Credit Card & Net Banking.</p>
        </details>

        <details>
          <summary>Can I track my order?</summary>
          <p>Yes, real-time tracking is available for all orders.</p>
        </details>

        <details>
          <summary>Is my data secure?</summary>
          <p>Absolutely. We use JWT auth and encrypted storage.</p>
        </details>
      </section>

      {/* ===============================
          FOOTER
      =============================== */}
      <footer className="footer">
        <p>© 2026 ShopSmart. All rights reserved.</p>
      </footer>

      {/* ===============================
          STYLES
      =============================== */}
      <style>{`
        .section {
          padding: 80px 10%;
          display: flex;
          align-items: center;
          gap: 50px;
        }

        /* HERO */
        .hero {
  height: 100vh;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #020617 40%,
    #064e3b 100%
  );
  display: flex;
  align-items: center;
  padding: 0 10%;
  color: white;
}
  .hero {
  background-size: 300% 300%;
  animation: gradientFlow 10s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}



        /* HERO LOGO */
/* HERO LOGO */
.hero-logo {
  width: clamp(90px, 25vw, 220px);
  height: clamp(90px, 25vw, 220px);
  max-width: 100%;
  margin-top: 60px;
  margin-bottom: 20px;

  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  padding: 6px;

  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.35));
  animation: float 4s ease-in-out infinite;
}

/* Subtle floating animation */
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          width: 100%;
        }

        .hero-text h1 { font-size: 4rem; }

        .hero-text button {
          padding: 14px 36px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          cursor: pointer;
        }

        @media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-logo {
    margin-top: 40px;
  }
}

        /* FEATURED PRODUCTS */
        .featured {
          flex-direction: column;
        }

        .featured-title {
          text-align: center;
          font-size: 2.6rem;
          margin-bottom: 50px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          width: 100%;
        }

       .featured-card {
  background: white;
  padding: 18px;
  border-radius: 22px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}

.featured-card img {
  width: 100%;
  height: 260px;
  object-fit: contain;
  background: #fafafa;
  padding: 25px;
  border-radius: 18px;
}

          /* ===============================
   MISSION SECTION
=============================== */
.section.light {
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
}

.section.light .split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
}

.about-lottie {
  width: 100%;
  max-width: 420px;
  height: auto;
  margin: auto;
}

.section.light h2 {
  font-size: 2.4rem;
  margin-bottom: 16px;
  color: #111827;
}

.section.light p {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
}

/* Mobile */
@media (max-width: 900px) {
  .section.light .split {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .about-lottie {
    max-width: 300px;
  }
}


        /* TEAM */
        .team {
          flex-direction: column;
          text-align: center;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .team-card {
          background: white;
          padding: 24px;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .avatar {
          width: 200px;
          height: 115px;
          border-radius: 70%;
          margin-bottom: 14px;
          
        }

        /* FAQ */
        .faq {
          flex-direction: column;
        }

        .faq details {
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 18px 22px;
          border-radius: 14px;
          margin-bottom: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .faq summary {
          font-weight: 600;
          cursor: pointer;
        }

        /* FOOTER */
        .footer {
          background: #111827;
          color: #e5e7eb;
          text-align: center;
          padding: 32px;
        }

        /* REVEAL */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: 0.8s;
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .hero-inner,
          .featured-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
