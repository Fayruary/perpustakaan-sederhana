"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed w-full z-50 flex justify-center mt-4">
      <div className="bg-blue-200/70 backdrop-blur-md shadow-md rounded-xl max-w-4xl w-full px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
          <span className="text-base md:text-lg font-semibold text-blue-700">
            JendelaDunia
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="w-1/6"></div>

          <nav className="flex gap-10 font-medium text-gray-700 justify-center w-1/3">
            <button
              onClick={() => router.push("/home")}
              className="hover:text-blue-600 transition"
            >
              Beranda
            </button>
            <button
              onClick={() => router.push("/buku")}
              className="hover:text-blue-600 transition"
            >
              Buku
            </button>
            <button
              onClick={() => router.push("/peminjaman")}
              className="hover:text-blue-600 transition"
            >
              Peminjaman
            </button>
          </nav>

          <div className="flex justify-end w-1/3">
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 bg-white text-blue-600 rounded-2xl font-medium transition"
            >
              Profile
            </button>
          </div>
        </div>

        {/* Mobile Burger */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md focus:outline-none bg-white/40 hover:bg-white/60 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-blue-600" />
            ) : (
              <Menu className="w-6 h-6 text-blue-600" />
            )}
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col p-4 gap-2">
              <button
                onClick={() => {
                  router.push("/home");
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left"
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  router.push("/buku");
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left"
              >
                Buku
              </button>
              <button
                onClick={() => {
                  router.push("/peminjaman");
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left"
              >
                Peminjaman
              </button>
              <button
                onClick={() => {
                  router.push("/profile");
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-left"
              >
                Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
