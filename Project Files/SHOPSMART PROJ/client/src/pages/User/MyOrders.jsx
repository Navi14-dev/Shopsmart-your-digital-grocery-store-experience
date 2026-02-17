import { useEffect, useState } from "react";
import api from "../../api/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/myorders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Status:</b> {order.orderStatus}</p>

          <ul>
            {order.items.map((item) => (
              <li key={item._id}>
                {item.productId.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
