"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function PeminjamanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
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
      <header className="flex items-center justify-between px-8 md:px-16 py-5 bg-blue-200/70 backdrop-blur-md shadow-md fixed w-full z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
          <span className="text-lg font-semibold text-blue-700">Perpustakaan</span>
        </div>

        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
          <Link href="/buku" className="hover:text-blue-600 transition">Buku</Link>
          <Link href="/peminjaman" className="hover:text-blue-600 transition">Peminjaman</Link>
        </nav>

        <div className="hidden md:flex gap-3">
          <Link
            href="/profil"
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 text-sm md:text-base"
          >
            Profil
          </Link>
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
                    <tr key={p.id_pinjam} className="text-center border-t text-gray-700 hover:bg-white/40 transition-all">
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
