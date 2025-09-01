import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      amount: form.amount.value,
      telco: form.telco.value,
      code: form.code.value,
      serial: form.serial.value,
    };

    const res = await fetch("/api/tsr/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    setResult(json);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Test TSR Charge API</h2>
      <form onSubmit={handleSubmit}>
        <label>Số tiền:</label><br />
        <input type="number" name="amount" defaultValue="10000" /><br /><br />

        <label>Nhà mạng:</label><br />
        <select name="telco">
          <option value="Viettel">Viettel</option>
          <option value="Vinaphone">Vinaphone</option>
          <option value="Mobifone">Mobifone</option>
        </select><br /><br />

        <label>Mã thẻ:</label><br />
        <input type="text" name="code" defaultValue="123456" /><br /><br />

        <label>Serial:</label><br />
        <input type="text" name="serial" defaultValue="99999" /><br /><br />

        <button type="submit">Gửi</button>
      </form>

      {result && (
        <pre style={{ background: "#eee", padding: "10px", marginTop: "20px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
  }
