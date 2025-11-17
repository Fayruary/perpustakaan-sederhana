"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { BookOpen, ClipboardList, FileText, LogOut, Home, Menu, X, User } from "lucide-react";
import SearchFilter from "../components/Seacrh"

export default function BukuPage() {
  const [buku, setBuku] = useState([]);
  const [pesan, setPesan] = useState("");
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search + Filter
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
  const router = useRouter();

  // Ambil role + nama + data buku
  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    setRole(r);
    setNama(n);

    async function fetchBuku() {
      const res = await fetch("/api/buku");
      setBuku(await res.json());
    }
    fetchBuku();
  }, []);

  // --------------------------
  // PINJAM
  // --------------------------
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

  // --------------------------
  // TAMBAH STOK
  // --------------------------
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

  // --------------------------
  // TAMBAH BUKU
  // --------------------------
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

  // --------------------------
  // HAPUS
  // --------------------------
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

  // --------------------------
  // SEARCH + FILTER
  // --------------------------
  const kategoriList = [...new Set(buku.map((b) => b.kategori))];

  const filteredBooks = buku.filter((b) => {
    const cocokSearch = b.judul.toLowerCase().includes(search.toLowerCase());
    const cocokKategori = kategoriFilter ? b.kategori === kategoriFilter : true;
    return cocokSearch && cocokKategori;
  });

  // --------------------------
  // SIDEBAR
  // --------------------------
  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8">JendelaDunia</h1>

        <nav className="space-y-3">
          <Link href="/home" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 shadow hover:bg-white">
            <Home className="w-5 h-5" /> Beranda
          </Link>

          <Link href="/buku" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600 text-white shadow">
            <BookOpen className="w-5 h-5" /> Buku
          </Link>

          <Link href="/peminjaman" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 shadow hover:bg-white">
            <ClipboardList className="w-5 h-5" /> Peminjaman
          </Link>

          <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 shadow hover:bg-white">
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>
      </div>

      <div>
        <p className="text-blue-900 font-semibold mb-3 text-center">{nama} ({role})</p>
        <button
          onClick={() => { localStorage.clear(); router.push("/login"); }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 shadow"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">
        {SidebarContent}
      </aside>

      {/* Tombol Hamburger */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-5 left-5 bg-blue-700 text-white p-3 rounded-xl shadow-lg z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Mobile */}
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

      {/* KONTEN */}
      <main className="flex-1 md:ml-64 p-10">

        <h1 className="text-4xl font-bold text-blue-900 text-center mb-10 drop-shadow">
          Daftar Buku Perpustakaan
        </h1>

        {pesan && (
          <p className="text-center text-green-700 font-semibold mb-8">{pesan}</p>
        )}

        {/* SEARCH + FILTER COMPONENT */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          kategoriFilter={kategoriFilter}
          setKategoriFilter={setKategoriFilter}
          kategoriList={kategoriList}
        />

        {/* FORM TAMBAH BUKU (ADMIN) */}
        {role === "admin" && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Tambah Buku Baru</h2>

            <form onSubmit={handleTambahBuku} className="grid md:grid-cols-2 gap-4">
              {["judul","pengarang","penerbit","tahun_terbit","kategori","stok"].map((field, i) => (
                <input
                  key={i}
                  type={["tahun_terbit","stok"].includes(field) ? "number" : "text"}
                  placeholder={field.replace("_"," ").toUpperCase()}
                  value={formTambah[field]}
                  onChange={(e) => setFormTambah({ ...formTambah, [field]: e.target.value })}
                  className="p-3 border border-white/50 rounded-xl bg-white/40 text-blue-900 placeholder-blue-700/60"
                  required
                />
              ))}

              <button type="submit" className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg">
                Tambah Buku
              </button>
            </form>
          </div>
        )}

        {/* LIST BUKU */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((item) => (
            <div
              key={item.id_buku}
              className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-bold text-blue-900 drop-shadow mb-2">{item.judul}</h2>

              <p className="text-blue-900/90">Pengarang: {item.pengarang}</p>
              <p className="text-blue-900/90">Penerbit: {item.penerbit}</p>
              <p className="text-blue-900/90">Tahun: {item.tahun_terbit}</p>
              <p className="text-blue-900/90">Kategori: {item.kategori}</p>

              <p className="mt-2 mb-4 text-blue-900 font-semibold">
                Stok:
                <span className={item.stok > 0 ? "text-green-700" : "text-red-700"}>
                  {item.stok > 0 ? ` ${item.stok} tersedia` : " Habis"}
                </span>
              </p>

              {role === "admin" ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={stokTambah[item.id_buku] || ""}
                    onChange={(e) => setStokTambah({ ...stokTambah, [item.id_buku]: e.target.value })}
                    className="border border-white/50 rounded-lg p-2 w-20 bg-white/40 text-blue-900"
                  />
                  <button
                    onClick={() => handleTambahStok(item.id_buku)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Tambah
                  </button>
                  <button
                    onClick={() => handleHapusBuku(item.id_buku)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Hapus
                  </button>
                </div>

              ) : (
                <button
                  onClick={() => handlePinjam(item.id_buku)}
                  disabled={item.stok === 0}
                  className={`w-full mt-3 py-3 rounded-xl font-semibold text-white shadow-lg ${
                    item.stok === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {item.stok === 0 ? "Stok Habis" : "Pinjam Buku"}
                </button>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
