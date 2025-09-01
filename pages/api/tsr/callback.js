import admin from "../../../lib/firebaseAdmin";

function calcTax(telco, declaredAmount, realAmount) {
  // realAmount: số tiền thực tế TSR trả sau khi trừ thuế
  // declaredAmount: mệnh giá thẻ gốc
  let totalTax = ["GARENA", "ZING", "VCOIN"].includes(telco.toUpperCase())
    ? 15
    : 20;

  let tsrTax = 100 - (realAmount / declaredAmount) * 100;
  let extraTax = totalTax - tsrTax;

  return { totalTax, extraTax };
}

export default async function handler(req, res) {
  const { status, amount, value, request_id, telco, userId } = req.body;

  if (status !== "success") {
    return res.status(400).json({ error: "Card failed" });
  }

  // Tính thêm thuế
  const { extraTax } = calcTax(telco, amount, value);
  let finalValue = value - (value * extraTax) / 100;

  // Ghi vào Firestore
  const db = admin.firestore();
  await db
    .collection("users")
    .doc(userId)
    .update({
      balance: admin.firestore.FieldValue.increment(finalValue),
    });

  res.status(200).json({ message: "User updated", finalValue });
}
