const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name price")
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );

    doc.pipe(res);

    /* ===============================
       HEADER (NO EMOJI ❌)
    =============================== */
    doc.fontSize(22).text("ShopSmart Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Order Status: ${order.orderStatus}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);

    doc.moveDown();
    doc.text("--------------------------------------------------");

    /* ===============================
       CUSTOMER DETAILS (FROM CHECKOUT)
    =============================== */
    doc.moveDown();
    doc.fontSize(14).text("Customer Details", { underline: true });
    doc.moveDown(0.5);

    const customer = order.customerDetails;

    if (customer) {
      doc.fontSize(12);
      doc.text(`Name: ${customer.name}`);
      doc.text(`Phone: ${customer.phone}`);
      doc.text(`Address: ${customer.address}`);
      doc.text(`City: ${customer.city}`);
      doc.text(`Pincode: ${customer.pincode}`);
    } else {
      doc.text("Customer details not available");
    }

    doc.moveDown();
    doc.text("--------------------------------------------------");

    /* ===============================
       USER ACCOUNT INFO (OPTIONAL)
    =============================== */
    if (order.userId) {
      doc.moveDown();
      doc.fontSize(14).text("Account Info", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Registered Name: ${order.userId.name}`);
      doc.text(`Email: ${order.userId.email}`);
      doc.moveDown();
      doc.text("--------------------------------------------------");
    }

    /* ===============================
       ORDER ITEMS
    =============================== */
    doc.moveDown();
    doc.fontSize(16).text("Order Summary", { underline: true });
    doc.moveDown();

    let grandTotal = 0;

    order.items.forEach((item, index) => {
      const productName = item.productId?.name || "Product not available";
      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;

      doc.fontSize(12).text(`${index + 1}. ${productName}`);
      doc.text(`   Quantity: ${item.quantity}`);
      doc.text(`   Price: ₹${item.price}`);
      doc.text(`   Total: ₹${itemTotal}`);
      doc.moveDown();
    });

    doc.text("--------------------------------------------------");

    /* ===============================
       GRAND TOTAL
    =============================== */
    doc.moveDown();
    doc.fontSize(14).text(`Grand Total: ₹${grandTotal}`, {
      align: "right",
    });

    /* ===============================
       FOOTER
    =============================== */
    doc.moveDown(2);
    doc.fontSize(10).text(
      "Thank you for shopping with ShopSmart.\nThis is a system-generated invoice.",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
