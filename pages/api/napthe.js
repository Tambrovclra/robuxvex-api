import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Lấy Partner ID và Key từ Environment Variables
    const partnerId = process.env.TSR_PARTNER_ID;
    const partnerKey = process.env.TSR_PARTNER_KEY;

    // Lấy dữ liệu client gửi lên (thông tin thẻ)
    const { telco, code, serial, amount } = req.body;

    // Tạo request_id duy nhất
    const requestId = Date.now().toString();

    // Chuỗi cần ký theo quy tắc của Thesieure
    const signData = `${partnerId}${code}${serial}${amount}${requestId}${partnerKey}`;
    const sign = crypto.createHash("md5").update(signData).digest("hex");

    // Gửi request tới API Thesieure
    const response = await fetch("https://thesieure.com/chargingws/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partner_id: partnerId,
        request_id: requestId,
        telco,
        code,
        serial,
        amount,
        sign,
      }),
    });

    const data = await response.json();

    // Trả kết quả về cho client
    res.status(200).json(data);
  } catch (error) {
    console.error("Napthe API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
