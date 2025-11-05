"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        // Simpan data login di localStorage
        localStorage.setItem("id_anggota", result.id_anggota);
        localStorage.setItem("nama", result.nama);
        localStorage.setItem("role", result.status); // status admin/siswa

        setPesan("✅ Login berhasil! Mengalihkan...");

        setTimeout(() => {
          // Redirect berdasarkan role
          if (result.status === "admin") {
            router.push("/peminjaman");
          } else {
            router.push("/buku");
          }
        }, 1500);
      } else {
        setPesan("❌ " + result.message);
      }
    } catch (error) {
      console.error("Error login:", error);
      setPesan("❌ Terjadi kesalahan server.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-sky-100 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-sky-700 mb-8">
          Masuk Ke Perpustakaan
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Belum punya akun?{" "}
          <a
            href="/anggota"
            className="text-sky-600 font-semibold hover:underline"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </main>
  );
}
