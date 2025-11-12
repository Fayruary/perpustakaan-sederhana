"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        // ✅ Simpan ke sessionStorage (client)
        localStorage.setItem("id_anggota", result.id_anggota);
        localStorage.setItem("nama", result.nama);
        localStorage.setItem("role", result.status);


        // ✅ SweetAlert Success
        await Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang, ${result.nama}!`,
          confirmButtonColor: "#2563eb",
          background: "rgba(255,255,255,0.75)",
          color: "#1e3a8a",
          backdrop: `
            rgba(0,0,0,0.3)
            url("/clouds.svg")
            center top
            no-repeat
          `,
          customClass: {
            popup:
              "rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30",
          },
        });

        // ✅ Redirect berdasarkan role
        if (result.status === "admin") {
          router.push("/home");
        } else {
          router.push("/home");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: result.message || "Email atau password salah.",
          confirmButtonColor: "#2563eb",
          background: "rgba(255,255,255,0.8)",
          color: "#1e3a8a",
          customClass: {
            popup:
              "rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30",
          },
        });
      }
    } catch (error) {
      console.error("Error login:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Tidak dapat terhubung ke server.",
        confirmButtonColor: "#2563eb",
        background: "rgba(255,255,255,0.8)",
        color: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-blue-300">
      {/* Background dekoratif */}
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto p-6">
        {/* Kiri - Form Login */}
        <div className="w-full md:w-1/2 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
            <span className="font-semibold text-blue-800 text-lg tracking-wide">
              JendelaDunia
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
            Selamat Datang Kembali 👋
          </h1>
          <p className="text-blue-700/80 mb-6 text-sm font-medium">
            Silakan masuk untuk melanjutkan ke sistem perpustakaan digital.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Masukkan Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-blue-300/40 bg-white/50 rounded-xl p-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Kata Sandi"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-blue-800">
                <input type="checkbox" className="accent-blue-600" />
                <span>Ingat Saya</span>
              </label>
              <a href="#" className="text-blue-700 font-medium hover:underline">
                Lupa Sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
              } text-white font-semibold py-3 rounded-xl transition-all shadow-md`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-blue-800 text-sm mt-8">
            Belum punya akun?{" "}
            <a
              href="/anggota"
              className="text-sky-600 font-semibold hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </div>

        {/* Kanan - Ilustrasi */}
        <div className="hidden md:flex w-1/2 justify-center items-center relative">
          <div className="absolute w-80 h-80 bg-sky-400/30 blur-3xl rounded-full -top-16 right-0"></div>
          <Image
            src="/book-character.jpg"
            alt="Ilustrasi membaca buku"
            width={450}
            height={450}
            className="relative z-10 rounded-3xl drop-shadow-2xl"
          />
        </div>
      </div>
    </main>
  );
}
