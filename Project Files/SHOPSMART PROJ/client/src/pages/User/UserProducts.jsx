import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import api from "../../api/api";

function UserProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) setSearchText(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchText(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    if (!searchText && category === "all") {
      setFilteredProducts(products);
      return;
    }

    let result = products;

    if (searchText) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [searchText, category, products]);

  useEffect(() => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter((p) =>
        p.name.toLowerCase().startsWith(searchText.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(matches);
  }, [searchText, products]);

  // ✅ Direct Add To Cart Function
  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });

      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 1500);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const buyNow = (product) => {
    navigate("/checkout", {
      state: {
        buyNow: {
          product,
          quantity: 1,
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="products-wrapper">
      <div className="products-container">
        <h2 className="page-title">Explore Products</h2>

        {/* SEARCH + FILTER */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);

                if (value.trim() === "") {
                  setSearchParams({});
                } else {
                  setSearchParams({ search: value });
                }
              }}
            />

            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => {
                      setSearchText(s.name);
                      setSuggestions([]);
                    }}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid">
          {filteredProducts.map((p) => (
            <div key={p._id} className="card">
              <div className="image-wrapper">
                <img
                  src={
                    p.image
                      ? p.image
                      : "https://via.placeholder.com/200x150?text=No+Image"
                  }
                  alt={p.name}
                />
              </div>

              <h4>{p.name}</h4>
              <p className="price">₹{p.price}</p>

              {/* Show only if stock is 0 */}
              {p.stock === 0 && (
                <p className="out">Out of Stock</p>
              )}

              <button
                disabled={p.stock === 0}
                className="add-btn"
                onClick={() => addToCart(p._id)}
              >
                Add to Cart
              </button>

              <button
                disabled={p.stock === 0}
                className="buy-btn"
                onClick={() => buyNow(p)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card success">
            <h3>Added to Cart Successfully 🎉</h3>
          </div>
        </div>
      )}
    



      {/* PREMIUM STYLES */}
      <style>{`
        .products-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg,#f0f9ff,#fdf2f8,#eef2ff);
          padding: 40px 20px;
          font-family: Inter, sans-serif;
        }

        .products-container {
          max-width: 1200px;
          margin: auto;
        }

        .page-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
          font-weight: 700;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding: 12px 16px;
          border-radius: 16px;
          border: none;
          width: 260px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .suggestions {
          position: absolute;
          background: white;
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          margin-top: 5px;
          z-index: 10;
        }

        .suggestions div {
          padding: 10px;
          cursor: pointer;
        }

        .suggestions div:hover {
          background: #f3f4f6;
        }

        select {
          padding: 12px;
          border-radius: 16px;
          border: none;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
          gap: 30px;
        }

        .card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 20px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.08);
          transition: 0.3s ease;
          text-align: center;
        }

        .card:hover {
          transform: translateY(-6px);
        }

        .image-wrapper {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
        }

        .image-wrapper img {
          max-height: 160px;
          max-width: 100%;
          object-fit: contain;
        }

        .price {
          font-weight: 700;
          margin: 5px 0;
        }

        .stock {
          color: #16a34a;
        }

        .out {
          color: red;
          font-weight: bold;
        }

        .add-btn, .buy-btn {
          width: 100%;
          padding: 10px;
          border-radius: 16px;
          border: none;
          margin-top: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .add-btn {
          background: linear-gradient(135deg,#38bdf8,#22d3ee);
          color: white;
        }

        .buy-btn {
          background: linear-gradient(135deg,#a78bfa,#6366f1);
          color: white;
        }

        .add-btn:hover, .buy-btn:hover {
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
          width: 320px;
        }

        .popup-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .popup-actions button {
          padding: 8px 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
        }

        .success {
          background: linear-gradient(135deg,#d1fae5,#f0fdf4);
          color: #065f46;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default UserProducts;
