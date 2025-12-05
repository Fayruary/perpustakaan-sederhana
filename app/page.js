"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Footer from "../src/components/Footer";
import {
  BookOpen,
  Users,
  Shield,
  TrendingUp,
  Star,
  Library,
} from "lucide-react";


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

  const features = [
  {
    icon: Library,
    title: "Ribuan Koleksi",
    description: "Akses ribuan buku dari berbagai genre, mulai dari fiksi, non-fiksi, hingga buku akademik.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Informasi Lengkap",
    description: "Lihat detail buku, termasuk penulis, kategori, penerbit, tahun dan stok nya, sehingga lebih mudah saat meminjam.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Gratis dan Aman",
    description: "Semua anggota mendapatkan akses gratis dan data pribadi dijaga dengan aman.",
    gradient: "from-blue-600 to-indigo-600",
  },
];

const stats = [
  { value: "5000+", label: "Buku Tersedia", icon: BookOpen },
  { value: "1200+", label: "Anggota Terdaftar", icon: Users },
  { value: "99%", label: "Kepuasan Pengguna", icon: Star },
];
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
     
{/* Features Section */}
<section id="features" className="py-16 px-6 bg-white/50 backdrop-blur-sm">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
        <Star className="w-3.5 h-3.5" />
        Fitur Unggulan
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
        Mengapa Memilih <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">JendelaDunia</span>
      </h2>
      <p className="text-gray-600 text-sm max-w-2xl mx-auto">
        Platform perpustakaan digital yang dirancang untuk memberikan pengalaman terbaik
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
          
          <div className="relative">
            <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Stats Section */}
<section className="py-16 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-3">
        <TrendingUp className="w-3.5 h-3.5" />
        Statistik Perpustakaan
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
        Dipercaya oleh <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ribuan Pengguna</span>
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600 font-medium text-sm">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
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
