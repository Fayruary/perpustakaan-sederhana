"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  LogOut,
  Home,
  Menu,
  X,
  User,
} from "lucide-react";

export default function PeminjamanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    const id_anggota = localStorage.getItem("id_anggota");

    // Proteksi halaman
    if (!r || (r === "siswa" && !id_anggota)) {
      Swal.fire({
        icon: "warning",
        title: "Harap Login",
        text: "Anda harus login terlebih dahulu untuk mengakses halaman ini.",
        confirmButtonColor: "#2563eb",
      }).then(() => router.push("/login"));
      return;
    }

    setRole(r);
    setNama(n);

    async function fetchData() {
      setLoading(true);
      const url =
        r === "siswa"
          ? `/api/peminjaman?id_anggota=${id_anggota}`
          : `/api/peminjaman`;

      const res = await fetch(url);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
      setLoading(false);
    }

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        router.push("/login");
      }
    });
  };

  // -------------------------
  // Admin SETUJUI / TOLAK
  // -------------------------
  const handleAction = async (id, action) => {
    const res = await fetch("/api/peminjaman", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pinjam: id, action }),
    });

    const json = await res.json();
    Swal.fire({
      icon: action === "Ditolak" ? "error" : "success",
      title: json.message,
      timer: 1500,
      showConfirmButton: false,
    });

    refreshData();
  };

  // -------------------------
  // Siswa KEMBALIKAN BUKU
  // -------------------------
  const handleKembalikan = async (id_pinjam) => {
    const res = await fetch("/api/peminjaman", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pinjam }),
    });

    const json = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: json.message,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: json.message,
      timer: 1500,
      showConfirmButton: false,
    });

    refreshData();
  };

  const refreshData = async () => {
    const id_anggota = localStorage.getItem("id_anggota");
    const url =
      role === "siswa"
        ? `/api/peminjaman?id_anggota=${id_anggota}`
        : `/api/peminjaman`;

    const res = await fetch(url);
    const json = await res.json();
    setData(Array.isArray(json) ? json : []);
  };

  // Status warna
  const statusColors = {
    Pending: "text-yellow-600",
    Dipinjam: "text-green-600",
    Ditolak: "text-red-600",
    Dikembalikan: "text-blue-600",
  };

  const statusText = {
    Pending: "Pending",
    Dipinjam: "Dipinjam",
    Ditolak: "Ditolak",
    Dikembalikan: "Dikembalikan",
  };

  // -------------------------
  // SIDEBAR
  // -------------------------

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-start">
          JendelaDunia
        </h1>

        <nav className="space-y-3">
          <Link
            href="/home"
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition"
          >
            <Home className="w-5 h-5" /> Beranda
          </Link>

          <Link
            href="/buku"
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition"
          >
            <BookOpen className="w-5 h-5" /> Buku
          </Link>

          <Link
            href="/peminjaman"
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            <ClipboardList className="w-5 h-5" /> Peminjaman
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition"
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
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 font-medium transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">
        {SidebarContent}
      </aside>

      {/* Hamburger mobile */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-5 left-5 z-60 bg-blue-600 text-white p-3 rounded-xl shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar mobile */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-blue-200/70 backdrop-blur-md shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 bg-white rounded-full p-1 shadow"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5 text-blue-800" />
        </button>

        {SidebarContent}
      </aside>

      {/* Konten */}
      <main className="flex-1 md:ml-64 p-10 pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
            {role === "admin" ? "Daftar Peminjaman" : "Daftar Peminjaman"}
          </h1>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            {loading ? (
              <p className="text-center text-gray-500 font-medium">
                Sedang memuat data...
              </p>
            ) : data.length === 0 ? (
              <p className="text-center text-gray-500 font-medium">
                Belum ada peminjaman.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 min-w-[600px]">
                  <thead className="bg-sky-100 text-sky-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nama Anggota</th>
                      <th className="p-3">Judul Buku</th>
                      <th className="p-3">Tgl Pinjam</th>
                      <th className="p-3">Tgl Kembali</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((p) => (
                      <tr
                        key={p.id_pinjam}
                        className="text-center border-t text-gray-700 hover:bg-white/40 transition-all"
                      >
                        <td className="p-3">{p.id_pinjam}</td>
                        <td className="p-3">{p.nama}</td>
                        <td className="p-3 font-medium text-blue-800">
                          {p.judul}
                        </td>
                        <td className="p-3">
                          {new Date(p.tanggal_pinjam).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="p-3">
                          {new Date(p.tanggal_kembali).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>

                        <td
                          className={`p-3 font-semibold ${
                            statusColors[p.status] || "text-gray-700"
                          }`}
                        >
                          {statusText[p.status] || p.status}
                        </td>

                        <td className="p-3 space-x-2">
                          {/* ADMIN */}
                          {role === "admin" && p.status === "Pending" && (
                            <>
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() =>
                                  handleAction(p.id_pinjam, "Dipinjam")
                                }
                              >
                                Setujui
                              </button>

                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() =>
                                  handleAction(p.id_pinjam, "Ditolak")
                                }
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {/* SISWA → Tombol Kembalikan */}
                          {role === "siswa" && p.status === "Dipinjam" && (
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => handleKembalikan(p.id_pinjam)}
                            >
                              Kembalikan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
