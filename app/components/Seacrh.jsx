"use client";
import { Search } from "lucide-react";

export default function SearchFilter({
  search,
  setSearch,
  kategoriFilter,
  setKategoriFilter,
  kategoriList,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">

      {/* Search Bar */}
      <div className="flex items-center bg-white/60 backdrop-blur border border-white/40 rounded-xl px-4 py-2 shadow w-full">
        <Search className="w-5 h-5 text-blue-700" />
        <input
          type="text"
          placeholder="Cari buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none ml-2 text-blue-900 placeholder-blue-700/60"
        />
      </div>

      {/* Dropdown Filter Kategori */}
      <select
        value={kategoriFilter}
        onChange={(e) => setKategoriFilter(e.target.value)}
        className="p-3 rounded-xl bg-white/60 backdrop-blur border border-white/40 text-blue-900 shadow w-full md:w-52"
      >
        <option value="">Semua Kategori</option>
        {kategoriList.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

    </div>
  );
}
