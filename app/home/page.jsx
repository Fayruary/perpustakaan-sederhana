  "use client";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import Swal from "sweetalert2";
  import { BookOpen, ClipboardList, FileText, LogOut, Home, Menu, X, User} from "lucide-react";
  import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

  export default function HomePage() {
    const [nama, setNama] = useState("");
    const [role, setRole] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const namaUser = localStorage.getItem("nama");
      const roleUser = localStorage.getItem("role");
      const id_anggota = localStorage.getItem("id_anggota");

      if (!namaUser || !roleUser) {
        Swal.fire({
          icon: "warning",
          title: "Harap Login",
          text: "Anda harus login terlebih dahulu.",
          confirmButtonColor: "#2563eb",
        }).then(() => router.push("/login"));
        return;
      }

      setNama(namaUser);
      setRole(roleUser);

      async function fetchData() {
        setLoading(true);
        const url = roleUser === "siswa" ? `/api/peminjaman?id_anggota=${id_anggota}` : `/api/peminjaman`;
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

    const totalPeminjaman = data.length;
    const totalPending = data.filter((p) => p.status === "Pending").length;
    const totalDipinjam = data.filter((p) => p.status === "Dipinjam").length;
    const totalDitolak = data.filter((p) => p.status === "Ditolak").length;

    const chartData = [
      { name: "Pending", jumlah: totalPending },
      { name: "Dipinjam", jumlah: totalDipinjam },
      { name: "Ditolak", jumlah: totalDitolak },
    ];

    const SidebarContent = (
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="text-2xl font-bold text-blue-800 mb-8 text-start">JendelaDunia</h1>
          <nav className="space-y-3">
            <Link href="/home" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition">
              <Home className="w-5 h-5" /> Beranda
            </Link>
            <Link href="/buku" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition">
              <BookOpen className="w-5 h-5" /> Buku
            </Link>
            <Link href="/peminjaman" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition">
              <ClipboardList className="w-5 h-5" /> Peminjaman
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white text-blue-700 font-medium shadow hover:bg-blue-100 transition">
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
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">
          {SidebarContent}
        </aside>

        {/* Hamburger mobile, hanya muncul saat sidebar tertutup */}
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
          {/* Tombol close */}
          <button
            className="absolute top-5 right-5 bg-white rounded-full p-1 shadow"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-blue-800" />
          </button>

          {SidebarContent}
        </aside>

        {/* Konten */}
        <main className="flex-1 md:ml-64 p-10">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Selamat Datang, {nama}! 👋</h1>
            <p className="text-blue-700/80 font-medium">
              {role === "admin"
                ? "Berikut ringkasan aktivitas perpustakaan hari ini."
                : "Lihat daftar buku dan status peminjaman Anda di bawah ini."}
            </p>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-blue-700 w-6 h-6" />
                <h2 className="text-blue-700 font-semibold">Total Peminjaman</h2>
              </div>
              <p className="text-3xl font-bold text-blue-900">{totalPeminjaman}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="text-yellow-600 w-6 h-6" />
                <h2 className="text-yellow-700 font-semibold">Menunggu Persetujuan</h2>
              </div>
              <p className="text-3xl font-bold text-yellow-700">{totalPending}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-green-600 w-6 h-6" />
                <h2 className="text-green-700 font-semibold">Sedang Dipinjam</h2>
              </div>
              <p className="text-3xl font-bold text-green-700">{totalDipinjam}</p>
            </div>
          </div>

          {/* Grafik */}
          <div className="mt-10 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/50">
            <h2 className="text-blue-800 font-bold mb-4">Statistik Peminjaman</h2>
            {loading ? (
              <p className="text-center text-gray-500 font-medium">Memuat data grafik...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#2563eb" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#2563eb" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>

    );
  }
