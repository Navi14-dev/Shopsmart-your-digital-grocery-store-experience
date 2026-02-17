import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });
      alert("Added to cart");
    } catch {
      alert("Add to cart failed");
    }
  };

  // const buyNow = async (productId) => {
  //   try {
  //     const res = await api.post("/orders/buynow", {
  //       productId,
  //       quantity: 1,
  //     });
  //     alert(res.data.message);
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Buy Now failed");
  //   }
  // };
 


  return (
    <div>
      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <h4>{p.name}</h4>
          <p>₹{p.price}</p>
          <p>Stock: {p.stock}</p>

          <button onClick={() => addToCart(p._id)}>Add to Cart</button>
          {/* <button onClick={() => buyNow(p._id)}>Buy Now</button> */}
           <button
  onClick={() =>
    navigate("/checkout", {
      state: {
        buyNow: true,
        productId: p._id,
        quantity: 1,
      },
    })
  }
>
  Buy Now
</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
