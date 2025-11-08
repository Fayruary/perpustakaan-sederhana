"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // ✅ Cek apakah user sudah login (pakai sessionStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Hapus data lama dari localStorage
      localStorage.removeItem("id_anggota");
      localStorage.removeItem("nama");
      localStorage.removeItem("role");

      // Cek sessionStorage (hanya selama tab aktif)
      const id = sessionStorage.getItem("id_anggota");
      setIsLoggedIn(!!id);
    }
  }, []);

  // ✅ Fungsi proteksi login
  const handleProtectedNav = (path) => {
    if (isLoggedIn === null) return; // Tunggu hasil cek
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Akses Dibatasi",
        text: "Silakan login terlebih dahulu untuk melanjutkan.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Login Sekarang",
      }).then(() => {
        router.push("/login");
      });
    } else {
      router.push(path);
    }
  };

  // ✅ Fungsi tombol "Jelajahi Sekarang"
  const handleExplore = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: "Belum Login",
        text: "Silakan login untuk menjelajahi koleksi buku.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Login Sekarang",
      }).then(() => {
        router.push("/login");
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 relative overflow-hidden">
      {/* Background Awan */}
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-16 py-5 bg-blue-200/70 backdrop-blur-md shadow-md fixed w-full z-50">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
          <span className="text-lg font-semibold text-blue-700">
            Perpustakaan
          </span>
        </div>

        {/* Navigasi utama */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600 transition"
          >
            Beranda
          </button>
          <button
            onClick={() => handleProtectedNav("/buku")}
            disabled={isLoggedIn === null}
            className={`hover:text-blue-600 transition ${
              isLoggedIn === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Buku
          </button>
          <button
            onClick={() => handleProtectedNav("/peminjaman")}
            disabled={isLoggedIn === null}
            className={`hover:text-blue-600 transition ${
              isLoggedIn === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Peminjaman
          </button>
        </nav>

        {/* Tombol Daftar & Masuk */}
        <div className="flex gap-3">
          <Link
            href="/anggota"
            className="px-4 py-2 border border-blue-600 text-blue-700 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm md:text-base"
          >
            Daftar
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 text-sm md:text-base"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 mt-32 md:mt-40 relative">
        {/* Konten Kiri */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 z-10"
        >
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-8 md:p-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-snug drop-shadow-sm">
              Perpustakaan Digital
            </h1>
            <p className="text-gray-700 max-w-md">
              Temukan dan jelajahi ribuan buku. Akses koleksi favoritmu kapan
              saja dan di mana saja melalui platform perpustakaan digital kami.
            </p>
            <Link
              href={isLoggedIn ? "/buku" : "#"}
              onClick={handleExplore}
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-300"
            >
              Jelajahi Sekarang
            </Link>
          </div>
        </motion.div>

        {/* Ilustrasi Kanan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex w-full md:w-1/2 justify-center relative mt-16 md:mt-0"
        >
          <motion.div
            whileHover={{ y: -10, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border border-blue-100 bg-white/70 backdrop-blur-lg flex justify-center items-center p-5"
          >
            <Image
              src="/book-character.jpg"
              alt="Ilustrasi karakter buku lucu"
              width={500}
              height={500}
              className="w-[280px] md:w-[340px] lg:w-[380px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              priority
            />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
