import axios from "axios";
import { makeChargeSign, normalizeTelco, TSR_ENDPOINT } from "../../../../lib/tsr";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { telco, amount, code, serial, username } = req.body || {};
  if (!telco || !amount || !code || !serial || !username) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const partnerId = process.env.TSR_PARTNER_ID;
  const partnerKey = process.env.TSR_PARTNER_KEY;
  if (!partnerId || !partnerKey) return res.status(500).json({ error: "Missing TSR env vars" });

  try {
    const t = normalizeTelco(telco);
    const command = "charging";
    const request_id = `${Date.now()}_${username}`;
    const sign = makeChargeSign({
      partnerKey,
      code,
      command,
      partnerId,
      requestId: request_id,
      serial,
      telco: t,
    });

    const payload = {
      partner_id: partnerId,
      request_id,
      telco: t,
      amount: String(amount),
      code,
      serial,
      command,
      sign,
    };

    const { data } = await axios.post(TSR_ENDPOINT, payload, { timeout: 20000 });
    return res.status(200).json({ ok: true, data, request_id });
  } catch (e) {
    console.error("Charge error", e?.response?.data || e.message);
    return res.status(500).json({ error: "Connection error to TSR" });
  }
}
