"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const result = await res.json();
      setPesan(
        "❌ " + (result.message || "Terjadi kesalahan, coba lagi nanti.")
      );
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-blue-300">
      {/* Background Awan */}
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>

      {/* Lapisan Blur Transparan */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto p-6">
        {/* Kiri - Form Register */}
        <div className="w-full md:w-1/2 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
            <span className="font-semibold text-blue-800 text-lg tracking-wide">
              JendelaDunia
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
            Daftar Akun Baru ✨
          </h1>
          <p className="text-blue-700/80 mb-6 text-sm font-medium">
            Yuk, buat akunmu dan mulai menjelajahi dunia pengetahuan!
          </p>

          {/* Pesan */}
          {pesan && (
            <p
              className={`text-center mb-4 font-medium ${
                pesan.includes("berhasil") ? "text-green-700" : "text-red-700"
              }`}
            >
              {pesan}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Lengkap"
              required
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Alamat Rumah"
              required
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="text"
              value={form.no_telp}
              onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
              placeholder="Nomor Telepon"
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Alamat Email"
              required
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Kata Sandi"
              required
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-xl text-white shadow-md transition-all duration-300 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700 shadow-blue-200"
              }`}
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-blue-800 text-sm mt-8">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-sky-600 font-semibold hover:underline"
            >
              Masuk
            </a>
          </p>
        </div>

        {/* Kanan - Ilustrasi Buku */}
        <div className="hidden md:flex w-1/2 justify-center items-center relative">
          <div className="absolute w-80 h-80 bg-sky-400/30 blur-3xl rounded-full -top-16 right-0"></div>
          <Image
            src="/book-character.jpg"
            alt="Ilustrasi daftar anggota"
            width={450}
            height={450}
            className="relative z-10 rounded-3xl drop-shadow-2xl"
          />
        </div>
      </div>
    </main>
  );
}
