"use client";
import { useEffect, useState } from "react";

export default function PeminjamanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);

    async function fetchData() {
      setLoading(true);
      const id_anggota = localStorage.getItem("id_anggota");
      const url = r === "siswa" ? `/api/peminjaman?id_anggota=${id_anggota}` : `/api/peminjaman`;
      const res = await fetch(url);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    const res = await fetch("/api/peminjaman", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pinjam: id, action }),
    });
    const result = await res.json();
    console.log("Hasil update:", result);

    // refresh data
    const id_anggota = localStorage.getItem("id_anggota");
    const url = role === "siswa" ? `/api/peminjaman?id_anggota=${id_anggota}` : `/api/peminjaman`;
    const res2 = await fetch(url);
    const json2 = await res2.json();
    setData(Array.isArray(json2) ? json2 : []);
  };

  const statusColors = {
    Pending: "text-yellow-600",
    Dipinjam: "text-green-600",
    Ditolak: "text-red-600"
  };
  const statusText = {
    Pending: "⏳ Pending",
    Dipinjam: "✅ Disetujui",
    Ditolak: "❌ Ditolak"
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-700 mb-6 text-center">
          {role === "admin" ? "Dashboard Admin" : "Daftar Peminjaman"} 📚
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada peminjaman.</p>
          ) : (
            <table className="w-full border border-gray-200">
              <thead className="bg-sky-100 text-sky-800">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Nama Anggota</th>
                  <th className="p-2">Judul Buku</th>
                  <th className="p-2">Tgl Pinjam</th>
                  <th className="p-2">Tgl Kembali</th>
                  <th className="p-2">Status</th>
                  {role === "admin" && <th className="p-2">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id_pinjam} className="text-center border-t text-gray-700">
                    <td className="p-2">{p.id_pinjam}</td>
                    <td className="p-2">{p.nama}</td>
                    <td className="p-2">{p.judul}</td>
                    <td className="p-2">{new Date(p.tanggal_pinjam).toLocaleDateString("id-ID")}</td>
                    <td className="p-2">{new Date(p.tanggal_kembali).toLocaleDateString("id-ID")}</td>
                    <td className={`p-2 font-semibold ${statusColors[p.status] || "text-gray-700"}`}>
                      {statusText[p.status] || p.status}
                    </td>
                    {role === "admin" && (
                      <td className="p-2 space-x-2">
                        {p.status === "Pending" && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              onClick={() => handleAction(p.id_pinjam, "Dipinjam")}
                            >
                              Setujui
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              onClick={() => handleAction(p.id_pinjam, "Ditolak")}
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
