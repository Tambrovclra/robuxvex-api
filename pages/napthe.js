import { useState } from "react";

export default function NapThePage() {
  const [telco, setTelco] = useState("VIETTEL");
  const [code, setCode] = useState("");
  const [serial, setSerial] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/napthe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telco, code, serial, amount: parseInt(amount) }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Có lỗi xảy ra khi gọi API" });
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Nạp Thẻ Test</h2>
      <form onSubmit={handleSubmit}>
        <label>Nhà mạng:</label>
        <select value={telco} onChange={(e) => setTelco(e.target.value)}>
          <option value="VIETTEL">Viettel</option>
          <option value="MOBIFONE">Mobifone</option>
          <option value="VINAPHONE">Vinaphone</option>
          <option value="ZING">Zing</option>
        </select>

        <br /><br />
        <label>Mệnh giá:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ví dụ: 10000"
          required
        />

        <br /><br />
        <label>Mã thẻ:</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã thẻ"
          required
        />

        <br /><br />
        <label>Serial:</label>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Nhập số serial"
          required
        />

        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Nạp thẻ"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Kết quả:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
