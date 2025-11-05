"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BukuPage() {
  const [buku, setBuku] = useState([]);
  const [pesan, setPesan] = useState("");
  const [role, setRole] = useState("");
  const [formTambah, setFormTambah] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahun_terbit: "",
    kategori: "",
    stok: 1
  });
  const [stokTambah, setStokTambah] = useState({}); // id_buku: jumlah
  const router = useRouter();

  // Ambil daftar buku dari API
  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);

    async function fetchBuku() {
      const res = await fetch("/api/buku");
      const data = await res.json();
      setBuku(data);
    }
    fetchBuku();
  }, []);

  // Fungsi pinjam buku (siswa)
  const handlePinjam = async (id_buku) => {
    const id_anggota = Number(localStorage.getItem("id_anggota"));
    if (!id_anggota) { alert("Login dulu!"); router.push("/login"); return; }

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_anggota, id_buku }),
      });
      const result = await res.json();
      setPesan(result.message);
      setTimeout(() => { setPesan(""); router.push("/peminjaman"); }, 1500);
    } catch (error) {
      setPesan("❌ Terjadi kesalahan saat meminjam buku.");
    }
  };

  // Fungsi tambah stok (admin)
  const handleTambahStok = async (id_buku) => {
    const jumlah = Number(stokTambah[id_buku]);
    if (!jumlah || jumlah <= 0) return;

    try {
      const res = await fetch(`/api/buku`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_buku, stok: jumlah })
      });
      const result = await res.json();
      setPesan(result.message);

      // refresh daftar buku
      const resBuku = await fetch("/api/buku");
      const dataBuku = await resBuku.json();
      setBuku(dataBuku);
    } catch (error) {
      setPesan("❌ Gagal menambahkan stok.");
    }
  };

  // Fungsi tambah buku baru (admin)
  const handleTambahBuku = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formTambah),
      });
      const result = await res.json();
      setPesan(result.message);
      setFormTambah({ judul: "", pengarang: "", penerbit: "", tahun_terbit: "", kategori: "", stok: 1 });

      // refresh daftar buku
      const resBuku = await fetch("/api/buku");
      const dataBuku = await resBuku.json();
      setBuku(dataBuku);
    } catch (error) {
      setPesan("❌ Gagal menambahkan buku baru.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-sky-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-900 mb-6 text-center">
          Daftar Buku Perpustakaan 📖
        </h1>

        {pesan && (
          <p className="text-center font-medium mb-6 text-green-800">{pesan}</p>
        )}

        {/* Form tambah buku baru */}
        {role === "admin" && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Tambah Buku Baru</h2>
            <form onSubmit={handleTambahBuku} className="grid gap-3 md:grid-cols-2">
              <input type="text" placeholder="Judul" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.judul} onChange={e => setFormTambah({...formTambah, judul: e.target.value})} required />
              <input type="text" placeholder="Pengarang" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.pengarang} onChange={e => setFormTambah({...formTambah, pengarang: e.target.value})} required />
              <input type="text" placeholder="Penerbit" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.penerbit} onChange={e => setFormTambah({...formTambah, penerbit: e.target.value})} required />
              <input type="number" placeholder="Tahun Terbit" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.tahun_terbit} onChange={e => setFormTambah({...formTambah, tahun_terbit: e.target.value})} required />
              <input type="text" placeholder="Kategori" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.kategori} onChange={e => setFormTambah({...formTambah, kategori: e.target.value})} />
              <input type="number" placeholder="Stok" className="p-2 border rounded placeholder-gray-500 text-gray-800"
                value={formTambah.stok} min={1}
                onChange={e => setFormTambah({...formTambah, stok: e.target.value})} required />
              <button type="submit" className="bg-sky-700 hover:bg-sky-800 text-white py-2 rounded col-span-2">Tambah Buku</button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {buku.map((item) => (
            <div
              key={item.id_buku}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-2xl transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900">{item.judul}</h2>
              <p className="text-gray-800 mt-1">📖 Pengarang: <span className="font-medium">{item.pengarang}</span></p>
              <p className="text-gray-800">🏢 Penerbit: <span className="font-medium">{item.penerbit}</span></p>
              <p className="text-gray-800">📅 Tahun: <span className="font-medium">{item.tahun_terbit}</span></p>
              <p className="text-gray-800">🏷️ Kategori: <span className="font-medium">{item.kategori}</span></p>
              <p className="text-gray-800">📦 Stok: <span className={`font-semibold ${item.stok > 0 ? "text-green-700" : "text-red-700"}`}>
                {item.stok > 0 ? `${item.stok} tersedia` : "Habis"}
              </span></p>

              {/* Tombol tambah stok admin */}
              {role === "admin" && (
                <div className="mt-3 flex gap-2">
                  <input type="number" min={1} placeholder="Tambah stok"
                    className="border p-1 rounded w-24 placeholder-gray-500 text-gray-800"
                    value={stokTambah[item.id_buku] || ""}
                    onChange={e => setStokTambah({...stokTambah, [item.id_buku]: e.target.value})} />
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-3 rounded"
                    onClick={() => handleTambahStok(item.id_buku)}>
                    Tambah Stok
                  </button>
                </div>
              )}

              {/* Tombol pinjam siswa */}
              {role !== "admin" && (
                <button
                  onClick={() => handlePinjam(item.id_buku)}
                  disabled={item.stok === 0}
                  className={`mt-4 w-full rounded-lg py-2 font-semibold text-white transition-all ${
                    item.stok === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-sky-700 hover:bg-sky-800"
                  }`}
                >
                  {item.stok === 0 ? "Stok Habis" : "Pinjam Buku"}
                </button>
              )}
            </div>
          ))}
        </div>

        {buku.length === 0 && (
          <p className="text-center text-gray-700 mt-10">Tidak ada data buku 😢</p>
        )}
      </div>
    </main>
  );
}
