import express from "express";
import { snap, coreApi } from "../utils/midtrans.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// ============================
// CREATE TRANSACTION
// ============================
router.post("/create", async (req, res) => {
  try {
    const { amount, first_name, email } = req.body;

    const orderId = "ORDER-" + Date.now();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name,
        email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      message: "Transaksi berhasil dibuat",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      message: "Gagal membuat transaksi",
      error: error.message,
    });
  }
});

// ============================
// CHECK STATUS
// ============================
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("Checking status for:", orderId);

    const status = await coreApi.transaction.status(orderId);

    console.log("Midtrans response:", status);

    res.json(status);
  } catch (error) {
    console.error("STATUS ERROR:", error);

    res.status(500).json({
      message: "Gagal cek status transaksi",
      error: error.message,
    });
  }
});

// ============================
// MIDTRANS NOTIFICATION
// ============================
router.post("/notification", async (req, res) => {
  try {
    const notification = await coreApi.transaction.notification(req.body);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log("MIDTRANS NOTIFICATION");
    console.log("Order ID:", orderId);
    console.log("Status:", transactionStatus);
    console.log("Fraud:", fraudStatus);

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        console.log("Payment success");
      }
    }

    if (transactionStatus === "settlement") {
      console.log("Payment settled");
    }

    if (transactionStatus === "pending") {
      console.log("Waiting payment");
    }

    if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      console.log("Payment failed");
    }

    res.status(200).json({ message: "Notification received" });
  } catch (error) {
    console.error("Notification error:", error);

    res.status(500).json({
      message: "Notification handling failed",
      error: error.message,
    });
  }
});

export default router;
