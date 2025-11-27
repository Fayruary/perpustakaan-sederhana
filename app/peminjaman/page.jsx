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
  Heart,
  MessageSquare,
} from "lucide-react";

export default function PeminjamanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [nama, setNama] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  const DENDA_PER_HARI = 500;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;


  const handleBayar = async (denda) => {
  try {
    const res = await fetch("/api/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_denda: denda.id_denda,
        total_denda: denda.total_denda,
      }),
    });

    const data = await res.json();

    if (data?.data?.qr_url) {
      window.open(data.data.qr_url, "_blank");
    } else {
      alert("Gagal membuat QRIS");
    }
  } catch (err) {
    console.error(err);
    alert("Error saat membuat QRIS");
  }
};

  useEffect(() => {
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("nama");
    const id_anggota = localStorage.getItem("id_anggota");

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
        r === "siswa" ? `/api/peminjaman?id_anggota=${id_anggota}` : `/api/peminjaman`;

      const res = await fetch(url);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : [];

      // compute keterlambatan & denda for each record (client-side)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const computed = arr.map((p) => {
        let terlambat_hari = 0;
        let total_denda = 0;

        if (p.tanggal_kembali && p.status === "Dipinjam") {
          const due = new Date(p.tanggal_kembali);
          due.setHours(0, 0, 0, 0);
          const diff = Math.floor((today - due) / MS_PER_DAY);
          if (diff > 0) {
            terlambat_hari = diff;
            total_denda = diff * DENDA_PER_HARI;
          }
        }

        return {
          ...p,
          terlambat_hari,
          total_denda,
        };
      });

      setData(computed);
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

  // Admin SETUJUI / TOLAK
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

  // Siswa KEMBALIKAN BUKU
  const handleKembalikan = async (id_pinjam) => {
    // Optional: sebelum panggil API 'kembalikan', kamu bisa cek & insert denda lewat endpoint /api/denda/cek
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
      role === "siswa" ? `/api/peminjaman?id_anggota=${id_anggota}` : `/api/peminjaman`;

    const res = await fetch(url);
    const json = await res.json();
    const arr = Array.isArray(json) ? json : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const computed = arr.map((p) => {
      let terlambat_hari = 0;
      let total_denda = 0;
      if (p.tanggal_kembali && p.status === "Dipinjam") {
        const due = new Date(p.tanggal_kembali);
        due.setHours(0, 0, 0, 0);
        const diff = Math.floor((today - due) / MS_PER_DAY);
        if (diff > 0) {
          terlambat_hari = diff;
          total_denda = diff * DENDA_PER_HARI;
        }
      }
      return {
        ...p,
        terlambat_hari,
        total_denda,
      };
    });

    setData(computed);
  };

  // Status warna
  const statusColors = {
    Pending: "text-yellow-600",
    Dipinjam: "text-green-600",
    Ditolak: "text-red-600",
    Dikembalikan: "text-blue-600",
  };

  // Format rupiah helper
  const formatRupiah = (v) => {
    if (!v || v === 0) return "Rp 0";
    return "Rp " + Number(v).toLocaleString("id-ID");
  };

  // Prepare denda list for siswa: only records where status Dipinjam and terlambat_hari > 0
  const dendaList = role === "siswa" ? data.filter((p) => p.status === "Dipinjam" && p.terlambat_hari > 0) : [];

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-start">JendelaDunia</h1>
        <nav className="flex flex-col">
          <Link href="/home" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <Home className="w-5 h-5" /> Beranda
          </Link>
          <Link href="/buku" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
            <BookOpen className="w-5 h-5" /> Buku
          </Link>
          <Link href="/peminjaman" className="flex items-center gap-3 py-3 px-4 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 transition">
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
        <p className="text-blue-900 font-semibold mb-3 text-center">{nama} ({role})</p>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 font-medium transition">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">{SidebarContent}</aside>

      {!sidebarOpen && (
        <button className="md:hidden fixed top-5 left-5 z-60 bg-blue-600 text-white p-3 rounded-xl shadow-lg" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      )}

      <aside className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-blue-200/70 backdrop-blur-md shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-5 right-5 bg-white rounded-full p-1 shadow" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5 text-blue-800" />
        </button>
        {SidebarContent}
      </aside>

      <main className="flex-1 md:ml-64 p-10 pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">Daftar Peminjaman</h1>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            {loading ? (
              <p className="text-center text-gray-500 font-medium">Sedang memuat data...</p>
            ) : data.length === 0 ? (
              <p className="text-center text-gray-500 font-medium">Belum ada peminjaman.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 min-w-[700px]">
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
                      <tr key={p.id_pinjam} className="text-center border-t text-gray-700 hover:bg-white/40 transition-all">
                        <td className="p-3">{p.id_pinjam}</td>
                        <td className="p-3">{p.nama}</td>
                        <td className="p-3 font-medium text-blue-800">{p.judul}</td>
                        <td className="p-3">{new Date(p.tanggal_pinjam).toLocaleDateString("id-ID")}</td>
                        <td className="p-3">{new Date(p.tanggal_kembali).toLocaleDateString("id-ID")}</td>
                        <td className={`p-3 font-semibold ${statusColors[p.status] || "text-gray-700"}`}>{p.status}</td>

                      

                        <td className="p-3 space-x-2">
                          {role === "admin" && p.status === "Pending" && (
                            <>
                              <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleAction(p.id_pinjam, "Dipinjam")}>Setujui</button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleAction(p.id_pinjam, "Ditolak")}>Tolak</button>
                            </>
                          )}

                          {role === "siswa" && p.status === "Dipinjam" && (
                            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => handleKembalikan(p.id_pinjam)}>Kembalikan</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Denda table - only show for siswa */}
          {role === "siswa" && (
            <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Daftar Denda</h2>
              {dendaList.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada denda untuk akun ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 min-w-[700px]">
                    <thead className="bg-blue-200 text-blue-800">
                      <tr>
                        <th className="p-3">ID Pinjam</th>
                        <th className="p-3">Judul Buku</th>
                        <th className="p-3">Tgl Pinjam</th>
                        <th className="p-3">Tgl Kembali</th>
                        <th className="p-3">Telat (hari)</th>
                        <th className="p-3">Total Denda</th>
                        <th className="p-3">Aksi</th>
                      </tr>
                    </thead>

                   <tbody>
  {dendaList.map((d) => (
    <tr key={d.id_pinjam} className="text-center border-t text-gray-700 hover:bg-white/40">
      <td className="p-3">{d.id_pinjam}</td>
      <td className="p-3 font-medium text-blue-800">{d.judul}</td>
      <td className="p-3">{new Date(d.tanggal_pinjam).toLocaleDateString("id-ID")}</td>
      <td className="p-3">{new Date(d.tanggal_kembali).toLocaleDateString("id-ID")}</td>
      <td className="p-3 font-semibold">{d.terlambat_hari} hari</td>
      <td className="p-3 font-bold text-red-700">{formatRupiah(d.total_denda)}</td>

      {/* Tombol Bayar */}
      <td className="p-3">
        {d.status === "lunas" ? (
          <span className="text-green-700 font-semibold">Lunas</span>
        ) : (
          <button
            onClick={() => handleBayar(d)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Bayar QRIS
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
          )}
        </div>
      </main>
    </div>
  );
}
