import { test } from '../../../lib/tsr';
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const partnerKey = process.env.TSR_PARTNER_KEY;
  if (!partnerKey) return res.status(500).json({ error: "Missing TSR_PARTNER_KEY" });

  const { status, message, request_id, declared_value, value, amount, code, serial, telco, callback_sign } = req.body || {};

  if (!verifyCallbackSign({ partnerKey, code, serial, callbackSign: callback_sign })) {
    return res.status(403).json({ error: "Invalid callback_sign" });
  }

  console.log("[TSR CALLBACK]", req.body);

  if (Number(status) === 1 || Number(status) === 2) {
    const declaredValue = Number(declared_value || value || 0);
    const amountReceived = Number(amount || 0);

    const desiredUserVnd = desiredUserVndFromDeclared(declaredValue, telco);
    let finalUserVnd = Math.min(amountReceived, desiredUserVnd);

    if (String(process.env.TSR_ABSORB_DEFICIT || "").toLowerCase() === "true") {
      finalUserVnd = desiredUserVnd;
    }

    const robux = vndToRobux(finalUserVnd);

    // TODO: cập nhật DB, cộng robux cho user
    console.log(`[CREDIT] req=${request_id} telco=${telco} robux=${robux}`);

    return res.status(200).json({ ok: true });
  }

  console.log("[TSR CALLBACK] non-success:", status, message);
  return res.status(200).json({ ok: true });
}
