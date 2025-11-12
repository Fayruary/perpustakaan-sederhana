"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Menu, X } from "lucide-react";


export default function BukuPage() {
  const [buku, setBuku] = useState([]);
  const [pesan, setPesan] = useState("");
  const [role, setRole] = useState("");
  const [formTambah, setFormTambah] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahun_terbit: "",
    kategori: "",
    stok: 1,
  });
  const [stokTambah, setStokTambah] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // state burger menu
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);

    async function fetchBuku() {
      const res = await fetch("/api/buku");
      const data = await res.json();
      setBuku(data);
    }
    fetchBuku();
  }, []);

  const handlePinjam = async (id_buku) => {
    const id_anggota = Number(localStorage.getItem("id_anggota"));

    if (!id_anggota) {
      await Swal.fire({
        icon: "warning",
        title: "Harap Login",
        text: "Anda harus login terlebih dahulu untuk meminjam buku.",
        confirmButtonColor: "#2563eb",
        background: "rgba(255,255,255,0.85)",
        color: "#1e3a8a",
        backdrop: `
          rgba(0,0,0,0.3)
          url("/clouds.svg")
          center top
          no-repeat
        `,
        customClass: {
          popup: "rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30",
        },
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
      setPesan("❌ Terjadi kesalahan saat meminjam buku.");
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
      const dataBuku = await resBuku.json();
      setBuku(dataBuku);
    } catch {
      setPesan("❌ Gagal menambahkan stok.");
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
      const dataBuku = await resBuku.json();
      setBuku(dataBuku);
    } catch {
      setPesan("❌ Gagal menambahkan buku baru.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 relative overflow-hidden">
      {/* Background awan lembut */}
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>

      {/* Navbar */}
      <header className="fixed w-full z-50 flex justify-center mt-4">
        <div className="bg-blue-200/70 backdrop-blur-md shadow-md rounded-xl max-w-4xl w-full px-4 md:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
            <span className="text-base md:text-lg font-semibold text-blue-700">JendelaDunia</span>
          </div>

        <div className="hidden md:flex items-center justify-between w-full">
  {/* Kosong di kiri agar tombol tetap di tengah */}
  <div className="w-1/6"></div>

  {/* Navigasi tengah */}
  <nav className="flex gap-10 font-medium text-gray-700 justify-center w-1/3">
    <button onClick={() => router.push("/home")} className="hover:text-blue-600 transition">Beranda</button>
    <button onClick={() => router.push("/buku")} className="hover:text-blue-600 transition">Buku</button>
    <button onClick={() => router.push("/peminjaman")} className="hover:text-blue-600 transition">Peminjaman</button>
  </nav>

  {/* Tombol Profil di kanan */}
  <div className="flex justify-end w-1/3">
    <button
      onClick={() => router.push("/profil")}
      className="px-4 py-2 bg-white text-blue-600 rounded-2xl font-medium transition"
    >
      Profil
    </button>
  </div>
</div>


          {/* Mobile Burger */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md focus:outline-none bg-white/40 hover:bg-white/60 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col p-4 gap-2">
                <button onClick={() => { router.push("/home"); setMobileMenuOpen(false); }} className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left">Beranda</button>
                <button onClick={() => { router.push("/buku"); setMobileMenuOpen(false); }} className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left">Buku</button>
                <button onClick={() => { router.push("/peminjaman"); setMobileMenuOpen(false); }} className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left">Peminjaman</button>
                <button onClick={() => { router.push("/profil"); setMobileMenuOpen(false); }} className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left">Profil</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <div className="max-w-6xl mx-auto relative z-10 pt-32 px-4 md:px-6 pb-16">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-10 drop-shadow">
          Daftar Buku Perpustakaan 
        </h1>

        {pesan && (
          <p className="text-center text-green-700 font-semibold mb-8">
            {pesan}
          </p>
        )}

        {/* Form Tambah Buku (Admin) */}
        {role === "admin" && (
          <div className="bg-white/30 backdrop-blur-2xl border border-white/40 shadow-xl rounded-2xl p-8 mb-12 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">
              ➕ Tambah Buku Baru
            </h2>
            <form
              onSubmit={handleTambahBuku}
              className="grid gap-4 md:grid-cols-2"
            >
              {["judul", "pengarang", "penerbit", "tahun_terbit", "kategori", "stok"].map(
                (field, i) => (
                  <input
                    key={i}
                    type={field === "tahun_terbit" || field === "stok" ? "number" : "text"}
                    placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    className="p-3 border border-white/40 rounded-xl bg-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 placeholder-gray-600"
                    value={formTambah[field]}
                    onChange={(e) =>
                      setFormTambah({ ...formTambah, [field]: e.target.value })
                    }
                    required
                  />
                )
              )}
              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
              >
                Tambah Buku
              </button>
            </form>
          </div>
        )}

        {/* Daftar Buku */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buku.map((item) => (
            <div
              key={item.id_buku}
              className="bg-white/30 backdrop-blur-2xl shadow-lg hover:shadow-2xl border border-white/40 rounded-2xl p-6 transition-all text-gray-800"
            >
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                {item.judul}
              </h2>
              <p>Pengarang: {item.pengarang}</p>
              <p>Penerbit: {item.penerbit}</p>
              <p>Tahun: {item.tahun_terbit}</p>
              <p>Kategori: {item.kategori}</p>
              <p className="mb-4">
                Stok:{" "}
                <span
                  className={`font-semibold ${
                    item.stok > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {item.stok > 0 ? `${item.stok} tersedia` : "Habis"}
                </span>
              </p>

              {role === "admin" ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    placeholder="0"
                    className="border border-white/40 rounded-lg p-2 w-20 bg-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={stokTambah[item.id_buku] || ""}
                    onChange={(e) =>
                      setStokTambah({
                        ...stokTambah,
                        [item.id_buku]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleTambahStok(item.id_buku)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Tambah
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePinjam(item.id_buku)}
                  disabled={item.stok === 0}
                  className={`w-full mt-2 py-3 rounded-xl font-semibold text-white transition-all ${
                    item.stok === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {item.stok === 0 ? "Stok Habis" : "Pinjam Buku"}
                </button>
              )}
            </div>
          ))}
        </div>

        {buku.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            Tidak ada data buku 😢
          </p>
        )}
      </div>
    </main>
  );
}
