"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  BookOpen,
  ClipboardList,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Heart,
  MessageSquare,
} from "lucide-react";

export default function WishlistPage() {
  const [buku, setBuku] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [pesan, setPesan] = useState("");
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [idAnggota, setIdAnggota] = useState(null);

  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    const id = localStorage.getItem("id_anggota");
    setRole(r);
    setNama(n);
    setIdAnggota(id);

    // ambil wishlist per user
    const wl = JSON.parse(localStorage.getItem(`wishlist_${id}`) || "[]");
    setWishlist(wl);

    // ambil semua buku
    async function fetchBuku() {
      const res = await fetch("/api/buku");
      const data = await res.json();
      setBuku(data);
    }
    fetchBuku();
  }, []);

  const handleToggleWishlist = (id_buku) => {
    let updated;
    if (wishlist.includes(id_buku)) {
      updated = wishlist.filter((i) => i !== id_buku);
    } else {
      updated = [...wishlist, id_buku];
    }
    setWishlist(updated);
    localStorage.setItem(`wishlist_${idAnggota}`, JSON.stringify(updated));
  };

  const handlePinjam = async (id_buku) => {
    if (!idAnggota) {
      await Swal.fire({
        icon: "warning",
        title: "Harap Login",
        text: "Anda harus login untuk meminjam buku.",
      });
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_anggota: Number(idAnggota), id_buku }),
      });
      const result = await res.json();
      setPesan(result.message);
      setTimeout(() => {
        setPesan("");
        router.push("/peminjaman");
      }, 1500);
    } catch {
      setPesan("Terjadi kesalahan.");
    }
  };

  const wishlistBooks = buku.filter((b) =>
    wishlist.includes(Number(b.id_buku))
  );

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-start">
          JendelaDunia
        </h1>
        <nav className="flex flex-col">
          <Link
            href="/home"
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <Home className="w-5 h-5" /> Beranda
          </Link>
          <Link
            href="/buku"
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <BookOpen className="w-5 h-5" /> Buku
          </Link>
          <Link
            href="/peminjaman"
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <ClipboardList className="w-5 h-5" /> Peminjaman
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-3 py-3 px-4 text-white bg-blue-600 rounded-r-full hover:bg-blue-700  transition"
          >
            <Heart className="w-5 h-5" /> Wishlist
          </Link>
          <Link
            href="/forum"
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <MessageSquare className="w-5 h-5" /> Forum
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>
      </div>
      <div>
        <p className="text-blue-900 font-semibold mb-3 text-center">
          {nama} ({role})
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 shadow"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">
        {SidebarContent}
      </aside>
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-5 left-5 bg-blue-700 text-white p-3 rounded-xl shadow-lg z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white/20 backdrop-blur-xl border-r border-white/30 shadow-xl p-6 transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 bg-white/60 rounded-full p-1 shadow-lg backdrop-blur hover:bg-white/80"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5 text-blue-900" />
        </button>
        {SidebarContent}
      </aside>

      <main className="flex-1 md:ml-64 p-10">
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-10 drop-shadow">
          Wishlist Buku
        </h1>

        {pesan && (
          <p className="text-center text-green-700 font-semibold mb-8">
            {pesan}
          </p>
        )}

        {wishlistBooks.length === 0 ? (
          <p className="text-center text-gray-700 font-semibold">
            Belum ada buku di wishlist
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistBooks.map((item) => (
              <div
                key={item.id_buku}
                className="relative bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <h2 className="text-xl font-bold text-blue-900 drop-shadow mb-2">
                  {item.judul}
                </h2>
                <p className="text-blue-900/90">Pengarang: {item.pengarang}</p>
                <p className="text-blue-900/90">Penerbit: {item.penerbit}</p>
                <p className="text-blue-900/90">Tahun: {item.tahun_terbit}</p>
                <p className="text-blue-900/90">Kategori: {item.kategori}</p>
                <p className="mt-2 mb-4 text-blue-900 font-semibold">
                  Stok:
                  <span
                    className={
                      item.stok > 0 ? "text-green-700" : "text-red-700"
                    }
                  >
                    {item.stok > 0 ? ` ${item.stok} tersedia` : " Habis"}
                  </span>
                </p>

                <button
                  onClick={() => handleToggleWishlist(Number(item.id_buku))}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  <Heart
                    fill={
                      wishlist.includes(Number(item.id_buku)) ? "red" : "none"
                    }
                    stroke="currentColor"
                    className="w-6 h-6"
                  />
                </button>

                <button
                  onClick={() => handlePinjam(Number(item.id_buku))}
                  disabled={item.stok === 0}
                  className={`w-full mt-3 py-3 rounded-xl font-semibold text-white shadow-lg ${
                    item.stok === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {item.stok === 0 ? "Stok Habis" : "Pinjam Buku"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
