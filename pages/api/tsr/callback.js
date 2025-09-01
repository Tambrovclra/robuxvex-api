import crypto from "crypto";
import { db } from "@/lib/firebase"; // giả sử bạn đã config Firestore ở đây
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { request_id, status, declared_value, card_type, amount, sign } = req.body;

    // ✅ B1: Kiểm tra chữ ký bảo mật từ TSR
    const mySign = crypto
      .createHash("md5")
      .update(
        process.env.TSR_PARTNER_KEY + request_id + process.env.TSR_PARTNER_ID
      )
      .digest("hex");

    if (sign !== mySign) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    // ✅ B2: Lưu vào Firestore (collection: transactions)
    const ref = doc(db, "transactions", request_id.toString());
    await setDoc(ref, {
      request_id,
      status, // 1 = thành công, 2 = thất bại, 99 = pending
      declared_value,
      card_type,
      amount,
      updated_at: new Date().toISOString(),
    });

    console.log("Callback TSR:", req.body);

    res.json({ message: "Callback received" });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
