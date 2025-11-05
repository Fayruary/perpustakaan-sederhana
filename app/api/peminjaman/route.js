import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// GET → ambil peminjaman
export async function GET(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Fairuz07",
      database: "db_perpus",
    });

    const url = new URL(req.url);
    const id_anggota = url.searchParams.get("id_anggota");

    let query = `
      SELECT 
        p.id_pinjam,
        p.id_anggota,
        p.id_buku,
        a.nama,
        b.judul,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status
      FROM peminjaman p
      JOIN anggota a ON p.id_anggota = a.id_anggota
      JOIN buku b ON p.id_buku = b.id_buku
    `;
    const params = [];
    if (id_anggota) {
      query += " WHERE p.id_anggota = ?";
      params.push(id_anggota);
    }
    query += " ORDER BY p.id_pinjam DESC";

    const [rows] = await db.query(query, params);
    await db.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error GET /peminjaman:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST → siswa meminjam buku (status Pending)
export async function POST(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Fairuz07",
      database: "db_perpus",
    });

    const { id_anggota, id_buku } = await req.json();
    if (!id_anggota || !id_buku) {
      return NextResponse.json({ message: "ID anggota & ID buku wajib diisi" }, { status: 400 });
    }

    const [bukuRows] = await db.query("SELECT stok FROM buku WHERE id_buku = ?", [id_buku]);
    if (bukuRows.length === 0) return NextResponse.json({ message: "Buku tidak ditemukan" }, { status: 404 });
    if (bukuRows[0].stok <= 0) return NextResponse.json({ message: "Stok buku habis" }, { status: 400 });

    const tanggal_pinjam = new Date().toISOString().slice(0, 10);
    const tanggal_kembali = new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0, 10);

    await db.query(
      `INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [id_anggota, id_buku, tanggal_pinjam, tanggal_kembali]
    );

    await db.end();
    return NextResponse.json({ message: "✅ Permintaan pinjam terkirim (Pending)" });
  } catch (error) {
    console.error("❌ Error POST /peminjaman:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// PATCH → admin setujui/tolak peminjaman
export async function PATCH(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Fairuz07",
      database: "db_perpus",
    });

    const { id_pinjam, action } = await req.json();
    if (!id_pinjam || !["Dipinjam", "Ditolak"].includes(action)) {
      return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
    }

    // Ambil id_buku
    const [rows] = await db.query("SELECT id_buku, status FROM peminjaman WHERE id_pinjam = ?", [id_pinjam]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan" }, { status: 404 });
    const id_buku = rows[0].id_buku;

    if (action === "Dipinjam") {
      // cek stok buku
      const [bukuRows] = await db.query("SELECT stok FROM buku WHERE id_buku = ?", [id_buku]);
      if (bukuRows[0].stok <= 0) {
        await db.query("UPDATE peminjaman SET status='Ditolak' WHERE id_pinjam = ?", [id_pinjam]);
        await db.end();
        return NextResponse.json({ message: "Stok habis → peminjaman ditolak" });
      }

      // kurangi stok & setujui
      await db.query("UPDATE buku SET stok = stok - 1 WHERE id_buku = ?", [id_buku]);
    }

    // update status
    await db.query("UPDATE peminjaman SET status=? WHERE id_pinjam=?", [action, id_pinjam]);

    await db.end();
    return NextResponse.json({ message: `Peminjaman ${action}` });
  } catch (error) {
    console.error("❌ Error PATCH /peminjaman:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
