import crypto from "crypto";

export const TSR_ENDPOINT = "https://thesieure.com/chargingws/v2";
export const SPECIAL_TELCOS = ["GARENA", "ZING", "VCOIN"];

export function normalizeTelco(t) {
  return String(t || "").trim().toUpperCase();
}

export function makeChargeSign({ partnerKey, code, command, partnerId, requestId, serial, telco }) {
  const raw = `${partnerKey}${code}${command}${partnerId}${requestId}${serial}${telco}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

export function verifyCallbackSign({ partnerKey, code, serial, callbackSign }) {
  const expect = crypto.createHash("md5").update(`${partnerKey}${code}${serial}`).digest("hex");
  return expect === String(callbackSign).toLowerCase();
}

export function targetTaxPercent(telco) {
  return SPECIAL_TELCOS.includes(normalizeTelco(telco)) ? 15 : 20;
}

export function desiredUserVndFromDeclared(declaredValue, telco) {
  const t = targetTaxPercent(telco);
  return Math.round(Number(declaredValue) * (1 - t / 100));
}

export function vndToRobux(vnd) {
  const per1000 = Number(process.env.ROBUX_PER_1000VND || 0);
  if (!per1000) return 0;
  return Math.floor((vnd / 1000) * per1000);
}
