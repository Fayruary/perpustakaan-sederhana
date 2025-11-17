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

export default function ForumPage() {
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kritik, setKritik] = useState("");
  const [forumList, setForumList] = useState([]);
  const [idAnggota, setIdAnggota] = useState(null);
  const [pesan, setPesan] = useState("");
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    const id = localStorage.getItem("id_anggota");
    setRole(r);
    setNama(n);
    setIdAnggota(id);

    // ambil forum dari localStorage
    const forumData = JSON.parse(localStorage.getItem("forum") || "[]");
    setForumList(forumData);
  }, []);

  const handleSubmit = () => {
    if (!kritik.trim()) {
      Swal.fire({ icon: "warning", title: "Isi kritik/saran dulu!" });
      return;
    }

    const newEntry = {
      id: Date.now(),
      nama,
      idAnggota,
      kritik,
    };

    const updatedForum = [...forumList, newEntry];
    setForumList(updatedForum);
    localStorage.setItem("forum", JSON.stringify(updatedForum));
    setKritik("");
    setPesan("Kritik/Saran berhasil dikirim!");
    setTimeout(() => setPesan(""), 2000);
  };

  // Sidebar content (sama seperti sebelumnya, ditambah menu Forum)
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
            className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition"
          >
            <Heart className="w-5 h-5" /> Wishlist
          </Link>
          <Link
            href="/forum"
            className="flex items-center gap-3 py-3 px-4 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 transition"
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
          Forum Kritik & Saran
        </h1>

        {pesan && (
          <p className="text-center text-green-700 font-semibold mb-6">
            {pesan}
          </p>
        )}

        {/* Jika siswa */}
        {/* Jika siswa */}
        {role === "siswa" && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 mb-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-3 drop-shadow">
              Kami Siap Menerima Masukan Anda
            </h2>
            <p className="text-blue-900/90 mb-4">
              Kami selalu berupaya meningkatkan layanan perpustakaan digital{" "}
              <span className="font-semibold">JendelaDunia</span>. Jika Anda
              memiliki kritik, saran, atau ide, silakan tuliskan di bawah ini.
              Masukan Anda sangat berarti bagi kami.
            </p>
            <textarea
              value={kritik}
              onChange={(e) => setKritik(e.target.value)}
              placeholder="Tuliskan kritik atau saran Anda..."
              className="w-full p-4 border border-white/50 rounded-xl bg-white/40 text-blue-900 placeholder-blue-700/60 mb-4"
              rows={5}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
            >
              Kirim Masukan
            </button>
          </div>
        )}

        {/* Daftar forum (hanya admin) */}
        {role === "admin" && forumList.length === 0 && (
          <p className="text-center text-gray-700 font-semibold">
            Belum ada kritik atau saran dari siswa.
          </p>
        )}

        {role === "admin" && forumList.length > 0 && (
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
            {forumList.map((f) => (
              <div
                key={f.id}
                className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <p className="text-blue-900 font-semibold mb-2">
                  Siswa: {f.nama}
                </p>
                <p className="text-blue-900/90">Pesan: {f.kritik}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
