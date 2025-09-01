import fetch from "node-fetch";

const TSR_API = "https://thesieure.com/chargingws/v2";
const PARTNER_ID = process.env.TSR_PARTNER_ID;
const PARTNER_KEY = process.env.TSR_PARTNER_KEY;

export async function chargeCard({ telco, code, serial, amount, request_id }) {
  const body = {
    telco,
    code,
    serial,
    amount,
    request_id,
    partner_id: PARTNER_ID,
    sign: md5(PARTNER_KEY + code + serial), // theo quy định của TSR
  };

  const res = await fetch(TSR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}
