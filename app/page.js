"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Footer from "./components/Footer";


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

  // Fungsi proteksi login
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

      {/* Navbar */}
      <header className="fixed w-full z-50 flex justify-center mt-4">
  <div className="bg-blue-200/70 backdrop-blur-md shadow-md rounded-xl max-w-4xl w-full px-4 md:px-8 py-3 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
      <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
      <span className="text-base md:text-lg font-semibold text-blue-700">JendelaDunia</span>
    </div>

    {/* Navigasi utama */}
    <nav className="hidden md:flex gap-6 font-medium text-gray-700">
      <button onClick={() => router.push("/home")} disabled={isLoggedIn === null} className={`hover:text-blue-600 transition ${isLoggedIn === null ? "opacity-50 cursor-not-allowed" : ""}`}>Beranda</button>
      <button onClick={() => handleProtectedNav("/buku")} disabled={isLoggedIn === null} className={`hover:text-blue-600 transition ${isLoggedIn === null ? "opacity-50 cursor-not-allowed" : ""}`}>Buku</button>
      <button onClick={() => handleProtectedNav("/peminjaman")} disabled={isLoggedIn === null} className={`hover:text-blue-600 transition ${isLoggedIn === null ? "opacity-50 cursor-not-allowed" : ""}`}>Peminjaman</button>
    </nav>

    {/* Tombol Daftar & Masuk */}
    <div className="flex gap-2">
      <Link href="/anggota" className="px-3 py-1.5 border border-blue-600 text-blue-700 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm md:text-base">Daftar</Link>
      <Link href="/login" className="px-3 py-1.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 text-sm md:text-base">Masuk</Link>
    </div>
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
              JendelaDunia
            </h1>
            <p className="text-gray-700 max-w-md">
              Temukan dan jelajahi ribuan buku. Akses koleksi favoritmu kapan
              saja dan di mana saja melalui platform perpustakaan JendelaDunia kami.
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
<br></br>
<br></br>
<br></br>
      {/* Fitur Unggulan */}
      <section className="py-20 px-8 md:px-20 bg-blue-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
          Mengapa Memilih Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Ribuan Koleksi</h3>
            <p className="text-gray-700">
              Akses ribuan buku dari berbagai genre, mulai dari fiksi, non-fiksi, hingga buku akademik.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
             <h3 className="text-xl font-semibold mb-3 text-blue-700">Informasi Lengkap</h3>
  <p className="text-gray-700">
    Lihat detail buku, termasuk penulis, kategori, penerbit, tahun dan stok nya, sehingga lebih mudah saat meminjam.
  </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Gratis dan Aman</h3>
            <p className="text-gray-700">
              Semua anggota mendapatkan akses gratis dan data pribadi dijaga dengan aman.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistik Singkat */}
      <section className="py-20 px-8 md:px-20 bg-blue-100/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
          Statistik Perpustakaan
        </h2>
        <div className="flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold text-blue-700">5000+</h3>
            <p className="text-gray-700">Buku Tersedia</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold text-blue-700">1200+</h3>
            <p className="text-gray-700">Anggota Terdaftar</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold text-blue-700">99%</h3>
            <p className="text-gray-700">Kepuasan Pengguna</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Tambahan */}
      <section className="py-20 px-8 md:px-20 bg-blue-600 text-white text-center rounded-2xl mx-8 md:mx-20 my-16 shadow-lg">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Bergabung dan Mulai Membaca Sekarang!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 max-w-xl mx-auto"
        >
          Daftar sekarang dan nikmati akses penuh ke koleksi buku kami. Tidak perlu tunggu lagi!
        </motion.p>
        <Link
          href="/anggota"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow hover:bg-gray-100 transition"
        >
          Daftar Sekarang
        </Link>
      </section>

 {/* Footer*/}
<Footer />

    </main>
  );
}
