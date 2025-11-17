// app/components/Footer.jsx
"use client";

export default function Footer() {
  return (
    <footer className="bg-blue-400/30 backdrop-blur-xl border-t border-white/30 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Info Perpustakaan */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-semibold text-blue-900 mb-4">JendelaDunia</h3>
          <p className="text-sm md:text-base text-blue-900/70 mb-4">
            © {new Date().getFullYear()} JendelaDunia. Semua hak dilindungi.
          </p>
          <p className="text-sm md:text-base text-blue-900/70">
            Temukan buku favoritmu, akses koleksi kami, dan nikmati pengalaman peminjaman buku terbaik.
          </p>
        </div>

        {/* Link Sosial */}
        <div className="flex flex-col md:flex-row gap-4 text-center md:text-right">
          <a href="#" className="text-blue-900/70 hover:text-blue-900 transition">Facebook</a>
          <a href="#" className="text-blue-900/70 hover:text-blue-900 transition">Twitter</a>
          <a href="#" className="text-blue-900/70 hover:text-blue-900 transition">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
