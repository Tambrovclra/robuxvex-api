export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, telco, code, serial } = req.body;

  // Nếu thiếu field thì báo lỗi
  if (!amount || !telco || !code || !serial) {
    return res.status(400).json({ error: "missing field", body: req.body });
  }

  // Nếu đủ thì trả về OK
  res.status(200).json({
    message: "Charge API OK",
    data: { amount, telco, code, serial }
  });
}
