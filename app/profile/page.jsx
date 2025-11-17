"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, ClipboardList, User, LogOut, Menu, X, Edit2, Save } from "lucide-react";

export default function ProfilePage() {
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [peminjaman, setPeminjaman] = useState([]);
  const [editMode, setEditMode] = useState(false); 
  const [editNama, setEditNama] = useState("");
  const [foto, setFoto] = useState("/avatar.jpg");
  const [newFoto, setNewFoto] = useState(null);
  const router = useRouter();

  // ------------------ CEK LOGIN ------------------
  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");

    if (!r || !n) {
      router.push("/login"); 
      return;
    }

    setRole(r);
    setNama(n);
    setEditNama(n); 

    // Ambil data peminjaman user
    async function fetchPeminjaman() {
      try {
        const url = r === "siswa" ? `/api/peminjaman?id_anggota=${localStorage.getItem("id_anggota")}` : "/api/peminjaman";
        const res = await fetch(url);
        const data = await res.json();
        setPeminjaman(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Gagal fetch peminjaman:", err);
      }
    }

    fetchPeminjaman();
  }, []);

  // ------------------ HANDLE FOTO ------------------
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setNewFoto(URL.createObjectURL(file));
    }
  }

  // ------------------ UPDATE PROFILE ------------------
  async function handleSaveProfile() {
    try {
      const formData = new FormData();
      formData.append("nama", editNama);
      if (newFoto) formData.append("foto", newFoto);

      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setNama(editNama);
        localStorage.setItem("nama", editNama);
        if (newFoto) setFoto(newFoto);
        setNewFoto(null);
        setEditMode(false);
        alert("Profile berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profile");
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan!");
    }
  }

  // ------------------ SIDEBAR ------------------
  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8">JendelaDunia</h1>
        <nav className="space-y-3">
          <Link href="/home" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 font-medium shadow hover:bg-white">
            <Home className="w-5 h-5" /> Beranda
          </Link>
          <Link href="/buku" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 font-medium shadow hover:bg-white">
            <BookOpen className="w-5 h-5" /> Buku
          </Link>
          <Link href="/peminjaman" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 text-blue-700 font-medium shadow hover:bg-white">
            <ClipboardList className="w-5 h-5" /> Peminjaman
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700">
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>
      </div>

      <div>
        <p className="text-blue-900 font-semibold mb-3 text-center">{nama} ({role})</p>
        <button
          onClick={() => { localStorage.clear(); router.push("/login"); }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 font-medium shadow"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  // ------------------ STATISTIK ------------------
  const totalBuku = peminjaman.length;
  const statusDipinjam = peminjaman.filter(p => p.status.toLowerCase() === "dipinjam").length;
  const statusDikembalikan = peminjaman.filter(p => p.status.toLowerCase() === "dikembalikan").length;
  const statusDitolak = peminjaman.filter(p => p.status.toLowerCase() === "ditolak").length;
  const cardClass = "bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">{SidebarContent}</aside>

      {/* Hamburger */}
      {!sidebarOpen && (
        <button className="md:hidden fixed top-5 left-5 bg-blue-700 text-white p-3 rounded-xl shadow-lg z-50" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Mobile */}
      <aside className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white/20 backdrop-blur-xl border-r border-white/30 shadow-xl p-6 transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-5 right-5 bg-white/60 rounded-full p-1 shadow-lg backdrop-blur hover:bg-white/80" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5 text-blue-900" />
        </button>
        {SidebarContent}
      </aside>

      {/* Konten */}
      <main className="flex-1 md:ml-64 p-10 space-y-10">
        <h1 className="text-4xl font-bold text-blue-900 drop-shadow">Profile Pengguna</h1>

        {/* Profil Modern */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-md">
          {/* Foto */}
          <div className="flex-shrink-0 relative">
            <img
              src={newFoto || foto}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                <input type="file" className="hidden" onChange={handleFotoChange} />
                <Edit2 className="w-4 h-4" />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-3 w-full text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                  placeholder="Masukkan nama baru"
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-600 transition"
                    onClick={handleSaveProfile}
                  >
                    <Save className="w-5 h-5" /> Simpan
                  </button>
                  <button
                    className="flex items-center gap-2 bg-gray-300 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
                    onClick={() => setEditMode(false)}
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-blue-900">{nama}</h2>
                <p className="text-blue-700 text-lg font-medium">Role: {role}</p>
                <p className="text-blue-700 text-lg font-medium">Total Buku Dipinjam: {totalBuku}</p>
                <button
                  className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition self-start"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 className="w-5 h-5" /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cardClass + " text-center"}>
            <p className="text-xl font-semibold text-yellow-700">{statusDipinjam}</p>
            <p className="text-yellow-800">Dipinjam</p>
          </div>
          <div className={cardClass + " text-center"}>
            <p className="text-xl font-semibold text-green-700">{statusDikembalikan}</p>
            <p className="text-green-800">Dikembalikan</p>
          </div>
          <div className={cardClass + " text-center"}>
            <p className="text-xl font-semibold text-red-700">{statusDitolak}</p>
            <p className="text-red-800">Ditolak</p>
          </div>
        </div>

        {/* Daftar Buku */}
        <h3 className="text-2xl font-semibold text-blue-900">Daftar Buku</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {peminjaman.map((item, idx) => (
            <div key={idx} className="p-4 border-b border-gray-300">
              <h4 className="text-lg font-semibold text-blue-900">{item.judul}</h4>
              <p className="text-blue-900/90">Pengarang: {item.pengarang}</p>
              <p className="text-blue-900/90">
                Status:{" "}
                <span className={`font-semibold ${
                  item.status.toLowerCase() === "dipinjam" ? "text-yellow-700" :
                  item.status.toLowerCase() === "dikembalikan" ? "text-green-700" :
                  "text-red-700"
                }`}>
                  {item.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
