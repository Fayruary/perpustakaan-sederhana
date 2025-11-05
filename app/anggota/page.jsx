"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DaftarAnggotaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    no_telp: "",
    email: "",
    password: "",
  });
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    const res = await fetch("/api/anggota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setPesan("🎉 Pendaftaran berhasil! Mengarahkan ke halaman login...");
      setForm({ nama: "", alamat: "", no_telp: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/login"); 
      }, 1500);
    } else {
      const result = await res.json();
      setPesan("❌ " + (result.message || "Terjadi kesalahan, coba lagi nanti."));
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-sky-100 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-sky-700 mb-8">
          Daftar Anggota Baru
        </h1>

        {pesan && (
          <p
            className={`text-center mb-6 font-medium ${
              pesan.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {pesan}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Masukkan Nama Lengkap"
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2">Alamat</label>
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Masukkan Alamat Rumah"
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2">No. Telepon</label>
            <input
              type="text"
              value={form.no_telp}
              onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
              placeholder="Masukkan Nomor Telepon"
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Masukkan Email"
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Masukkan Password"
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl text-white shadow-lg transition-all duration-300 ${
              loading ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sudah punya akun?{" "}
          <a href="/login" className="text-sky-600 font-semibold hover:underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </main>
  );
}
