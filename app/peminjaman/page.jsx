"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function PeminjamanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // untuk burger menu
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    const id_anggota = localStorage.getItem("id_anggota");

    // Proteksi halaman
    if (!r || (r === "siswa" && !id_anggota)) {
      Swal.fire({
        icon: "warning",
        title: "Harap Login",
        text: "Anda harus login terlebih dahulu untuk mengakses halaman ini.",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    setRole(r);

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

  const handleAction = async (id, action) => {
    const res = await fetch("/api/peminjaman", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pinjam: id, action }),
    });
    await res.json();

    const id_anggota = localStorage.getItem("id_anggota");
    const url =
      role === "siswa"
        ? `/api/peminjaman?id_anggota=${id_anggota}`
        : `/api/peminjaman`;
    const res2 = await fetch(url);
    const json2 = await res2.json();
    setData(Array.isArray(json2) ? json2 : []);
  };

  const statusColors = {
    Pending: "text-yellow-600",
    Dipinjam: "text-green-600",
    Ditolak: "text-red-600",
  };
  const statusText = {
    Pending: "⏳ Pending",
    Dipinjam: "✅ Disetujui",
    Ditolak: "❌ Ditolak",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 relative overflow-hidden">
      {/* Navbar */}
      <header className="fixed w-full z-50 flex justify-center mt-4">
        <div className="bg-blue-200/70 backdrop-blur-md shadow-md rounded-xl max-w-4xl w-full px-4 md:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
            <span className="text-base md:text-lg font-semibold text-blue-700">
              Perpustakaan
            </span>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex gap-2">
            <Link
              href="/buku"
              className="px-4 py-2 bg-white text-blue-600 rounded-2xl font-medium transition-all duration-300 text-sm md:text-base"
            >
              Buku
            </Link>
            <Link
              href="/peminjaman"
              className="px-4 py-2 bg-white text-blue-600 rounded-2xl font-medium transition-all duration-300 text-sm md:text-base"
            >
              Peminjaman
            </Link>
            <Link
              href="/profil"
              className="px-4 py-2 bg-white text-blue-600 rounded-2xl font-medium transition-all duration-300 text-sm md:text-base"
            >
              Profil
            </Link>
          </div>

          {/* Navigasi Mobile (Burger) */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md focus:outline-none bg-white/40 hover:bg-white/60 transition"
            >
              {/* Icon burger */}
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Menu dropdown */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col">
                <Link
                  href="/buku"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Buku
                </Link>
                <Link
                  href="/peminjaman"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Peminjaman
                </Link>
                <Link
                  href="/profil"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profil
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Konten */}
      <div className="max-w-6xl mx-auto pt-32 px-4 md:px-6 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          {role === "admin" ? "Dashboard Admin" : "Daftar Peminjaman"} 📚
        </h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          {loading ? (
            <p className="text-center text-gray-500 font-medium">Sedang memuat data...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500 font-medium">Belum ada peminjaman.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-sky-100 text-sky-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Anggota</th>
                    <th className="p-3">Judul Buku</th>
                    <th className="p-3">Tgl Pinjam</th>
                    <th className="p-3">Tgl Kembali</th>
                    <th className="p-3">Status</th>
                    {role === "admin" && <th className="p-3">Aksi</th>}
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
                      <td className="p-3 font-medium text-blue-800">{p.judul}</td>
                      <td className="p-3">{new Date(p.tanggal_pinjam).toLocaleDateString("id-ID")}</td>
                      <td className="p-3">{new Date(p.tanggal_kembali).toLocaleDateString("id-ID")}</td>
                      <td className={`p-3 font-semibold ${statusColors[p.status] || "text-gray-700"}`}>
                        {statusText[p.status] || p.status}
                      </td>
                      {role === "admin" && (
                        <td className="p-3 space-x-2">
                          {p.status === "Pending" && (
                            <>
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => handleAction(p.id_pinjam, "Dipinjam")}
                              >
                                Setujui
                              </button>
                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => handleAction(p.id_pinjam, "Ditolak")}
                              >
                                Tolak
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
