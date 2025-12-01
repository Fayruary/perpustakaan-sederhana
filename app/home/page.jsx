"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  BookOpen,
  ClipboardList,
  FileText,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Heart,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
        confirmButtonColor: "#3b82f6",
      }).then(() => router.push("/login"));
      return;
    }

    setNama(namaUser);
    setRole(roleUser);

    async function fetchData() {
      setLoading(true);
      const url =
        roleUser === "siswa"
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
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#64748b",
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
    { name: "Pending", jumlah: totalPending, fill: "#f59e0b" },
    { name: "Dipinjam", jumlah: totalDipinjam, fill: "#10b981" },
    { name: "Ditolak", jumlah: totalDitolak, fill: "#ef4444" },
  ];

  const NavLink = ({ href, icon: Icon, children, active = false }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
          : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );

   const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-start">
          JendelaDunia
        </h1>
        <nav className="flex flex-col">
          <Link href="/home" className="flex items-center gap-3 py-3 px-4 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 transition">
            <Home className="w-5 h-5" /> Beranda
          </Link>
          <Link href="/buku" className="flex items-center gap-3 py-3 px-4 text-blue-700 hover:text-blue-900 border-b border-blue-300 transition">
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

  const StatCard = ({ icon: Icon, title, value, color, bgColor, iconBg }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className={`${color} w-6 h-6`} />
        </div>
        <TrendingUp className="text-green-500 w-5 h-5" />
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
     <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <aside className="hidden md:flex w-64 fixed h-full bg-blue-200/70 backdrop-blur-md shadow-lg p-6">
        {SidebarContent}
      </aside>

      {/* Hamburger mobile */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-5 left-5 z-50 bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 rounded-lg p-2 shadow transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>
        {SidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 md:p-10 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Selamat Datang, {nama}! 
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            {role === "admin"
              ? "Berikut ringkasan aktivitas perpustakaan hari ini."
              : "Lihat daftar buku dan status peminjaman Anda di bawah ini."}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Peminjaman"
            value={totalPeminjaman}
            color="text-blue-600"
            bgColor="bg-blue-50"
            iconBg="bg-blue-50"
          />
          <StatCard
            icon={Clock}
            title="Menunggu Persetujuan"
            value={totalPending}
            color="text-amber-600"
            bgColor="bg-amber-50"
            iconBg="bg-amber-50"
          />
          <StatCard
            icon={CheckCircle}
            title="Sedang Dipinjam"
            value={totalDipinjam}
            color="text-green-600"
            bgColor="bg-green-50"
            iconBg="bg-green-50"
          />
          <StatCard
            icon={FileText}
            title="Ditolak"
            value={totalDitolak}
            color="text-red-600"
            bgColor="bg-red-50"
            iconBg="bg-red-50"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Statistik Peminjaman
              </h2>
              <p className="text-sm text-slate-500">
                Grafik status peminjaman buku
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-slate-500 font-medium">Memuat data grafik...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="jumlah"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <BookOpen className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Jelajahi Koleksi</h3>
            <p className="text-blue-100 text-sm mb-4">
              Temukan ribuan buku menarik dalam koleksi perpustakaan kami
            </p>
            <Link
              href="/buku"
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Lihat Buku
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <ClipboardList className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Status Peminjaman</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Pantau status peminjaman dan riwayat transaksi Anda
            </p>
            <Link
              href="/peminjaman"
              className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Cek Status
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}