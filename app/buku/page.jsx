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
  Plus,
  Trash2,
  Search,
} from "lucide-react";

export default function BukuPage() {
  const [buku, setBuku] = useState([]);
  const [pesan, setPesan] = useState("");
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  const [formTambah, setFormTambah] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahun_terbit: "",
    kategori: "",
    stok: 1,
  });

  const [stokTambah, setStokTambah] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    const idAnggota = localStorage.getItem("id_anggota");
    const wl = JSON.parse(localStorage.getItem(`wishlist_${idAnggota}`) || "[]");

    setRole(r);
    setNama(n);
    setWishlist(wl);

    async function fetchBuku() {
      const res = await fetch("/api/buku");
      setBuku(await res.json());
    }
    fetchBuku();
  }, []);

  const handleToggleWishlist = (id_buku) => {
    if (role === "admin") return;

    const idAnggota = localStorage.getItem("id_anggota");
    let updatedWishlist;

    if (wishlist.includes(id_buku)) {
      updatedWishlist = wishlist.filter((id) => id !== id_buku);
    } else {
      updatedWishlist = [...wishlist, id_buku];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${idAnggota}`, JSON.stringify(updatedWishlist));
  };

  const handlePinjam = async (id_buku) => {
    const id_anggota = Number(localStorage.getItem("id_anggota"));
    if (!id_anggota) {
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
        body: JSON.stringify({ id_anggota, id_buku }),
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

      setFormTambah({
        judul: "",
        pengarang: "",
        penerbit: "",
        tahun_terbit: "",
        kategori: "",
        stok: 1,
      });

      const resBuku = await fetch("/api/buku");
      setBuku(await resBuku.json());
    } catch {
      setPesan("Gagal menambahkan buku.");
    }
  };

  const handleTambahStok = async (id_buku) => {
    const jumlah = Number(stokTambah[id_buku]);
    if (!jumlah || jumlah <= 0) return;

    try {
      const res = await fetch(`/api/buku`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_buku, stok: jumlah }),
      });

      const result = await res.json();
      setPesan(result.message);

      const resBuku = await fetch("/api/buku");
      setBuku(await resBuku.json());
    } catch {
      setPesan("Gagal menambahkan stok.");
    }
  };

  const handleHapusBuku = async (id_buku) => {
    const konfirmasi = await Swal.fire({
      icon: "warning",
      title: "Hapus Buku?",
      text: "Buku yang dihapus tidak dapat dikembalikan.",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!konfirmasi.isConfirmed) return;

    try {
      const res = await fetch(`/api/buku`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_buku }),
      });

      const result = await res.json();
      setPesan(result.message);

      const resBuku = await fetch("/api/buku");
      setBuku(await resBuku.json());
    } catch {
      setPesan("Gagal menghapus buku.");
    }
  };

  const kategoriList = [...new Set(buku.map((b) => b.kategori))];
  const filteredBooks = buku.filter((b) => {
    const cocokSearch = b.judul.toLowerCase().includes(search.toLowerCase());
    const cocokKategori = kategoriFilter ? b.kategori === kategoriFilter : true;
    return cocokSearch && cocokKategori;
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleTambahBuku(e);
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-900 mb-8 text-start">
          JendelaDunia
        </h1>
        <nav className="flex flex-col">
          <Link href="/home" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <Home className="w-5 h-5" /> Beranda
          </Link>

          {/* UPDATE WARNA TEKS */}
          <Link href="/buku" className="flex items-center gap-3 py-3 px-4 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 transition">
            <BookOpen className="w-5 h-5" /> Buku
          </Link>

          <Link href="/peminjaman" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <ClipboardList className="w-5 h-5" /> Peminjaman
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <Heart className="w-5 h-5" /> Wishlist
          </Link>
          <Link href="/forum" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <MessageSquare className="w-5 h-5" /> Forum
          </Link>
          <Link href="/profile" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
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

      {/* Mobile Menu */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-4 left-4 bg-blue-600 text-white p-3 rounded-xl shadow-lg z-50 hover:bg-blue-700 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl p-6 transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {SidebarContent}
      </aside>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Koleksi Buku Perpustakaan
          </h1>
          <p className="text-blue-700">Jelajahi dan pinjam buku favorit Anda</p>
        </div>

        {pesan && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <p className="font-medium">{pesan}</p>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari judul buku..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FORM ADMIN */}
        {role === "admin" && (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 rounded-lg p-2">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Tambah Buku Baru</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Judul Buku"
                  value={formTambah.judul}
                  onChange={(e) => setFormTambah({ ...formTambah, judul: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Pengarang"
                  value={formTambah.pengarang}
                  onChange={(e) => setFormTambah({ ...formTambah, pengarang: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Penerbit"
                  value={formTambah.penerbit}
                  onChange={(e) => setFormTambah({ ...formTambah, penerbit: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />

                <input
                  type="number"
                  placeholder="Tahun Terbit"
                  value={formTambah.tahun_terbit}
                  onChange={(e) => setFormTambah({ ...formTambah, tahun_terbit: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Kategori"
                  value={formTambah.kategori}
                  onChange={(e) => setFormTambah({ ...formTambah, kategori: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />

                <input
                  type="number"
                  placeholder="Stok"
                  min="1"
                  value={formTambah.stok}
                  onChange={(e) => setFormTambah({ ...formTambah, stok: e.target.value })}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <button
                onClick={handleTambahBuku}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow"
              >
                <Plus className="w-5 h-5 inline-block mr-2" />
                Tambah Buku
              </button>
            </div>
          </div>
        )}

        {/* LIST BUKU */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((item) => (
            <div
              key={item.id_buku}
              className="bg-white rounded-xl shadow border border-blue-100 hover:shadow-lg transition overflow-hidden"
            >
              {/* HEADER CARD */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-block bg-white/25 text-yellow-100 text-xs px-3 py-1 rounded-full mb-2">
                      {item.kategori}
                    </span>

                    {/* UPDATE WARNA */}
                    <h3 className="text-lg font-bold text-white/95 line-clamp-2">
                      {item.judul}
                    </h3>
                  </div>

                  {role !== "admin" && (
                    <button
                      onClick={() => handleToggleWishlist(item.id_buku)}
                      className="ml-2 bg-white/20 hover:bg-white/40 rounded-full p-2"
                    >
                      <Heart
                        fill={wishlist.includes(item.id_buku) ? "#ef4444" : "none"}
                        stroke={wishlist.includes(item.id_buku) ? "#ef4444" : "white"}
                        className="w-5 h-5"
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-blue-700 font-semibold w-24">Pengarang:</span>
                    <span className="text-gray-800">{item.pengarang}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-blue-700 font-semibold w-24">Penerbit:</span>
                    <span className="text-gray-800">{item.penerbit}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-blue-700 font-semibold w-24">Tahun:</span>
                    <span className="text-gray-800">{item.tahun_terbit}</span>
                  </div>
                </div>

                {/* STATUS */}
                <div className="pt-3 border-t border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 font-semibold">Ketersediaan:</span>

                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${
                        item.stok > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.stok > 0 ? `${item.stok} Buku` : "Habis"}
                    </span>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="pt-3">
                  {role === "admin" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Tambah"
                          value={stokTambah[item.id_buku] || ""}
                          onChange={(e) =>
                            setStokTambah({
                              ...stokTambah,
                              [item.id_buku]: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleTambahStok(item.id_buku)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          + Stok
                        </button>
                      </div>

                      <button
                        onClick={() => handleHapusBuku(item.id_buku)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Buku
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePinjam(item.id_buku)}
                      disabled={item.stok === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition ${
                        item.stok === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {item.stok === 0 ? "Stok Habis" : "Pinjam Sekarang"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Tidak ada buku ditemukan
            </h3>
            <p className="text-blue-600">Coba ubah pencarian atau filter kategori</p>
          </div>
        )}
      </main>
    </div>
  );
}
