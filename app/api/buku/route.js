import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔹 Tambahkan ini supaya route bersifat dynamic
export const dynamic = "force-dynamic";

async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fairuz07",
    database: "db_perpus",
  });
}

// GET → Ambil semua buku
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query(`
      SELECT 
        id_buku,
        judul,
        pengarang,
        penerbit,
        tahun_terbit,
        kategori,
        stok
      FROM buku
      ORDER BY id_buku DESC
    `);
    await db.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error di API GET /buku:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

// POST → Tambah buku baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { judul, pengarang, penerbit, tahun_terbit, kategori, stok } = body;

    if (!judul || !pengarang || !penerbit || !tahun_terbit || stok === undefined) {
      return NextResponse.json(
        { message: "Data buku tidak lengkap" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    await db.query(
      `INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, kategori, stok)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [judul, pengarang, penerbit, tahun_terbit, kategori, stok]
    );
    await db.end();

    return NextResponse.json({ message: "✅ Buku berhasil ditambahkan!" });
  } catch (error) {
    console.error("❌ Error di API POST /buku:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH → Tambah stok buku
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id_buku, stok } = body;

    if (!id_buku || stok === undefined || stok <= 0) {
      return NextResponse.json(
        { message: "ID buku atau jumlah stok tidak valid" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    await db.query(`UPDATE buku SET stok = stok + ? WHERE id_buku = ?`, [stok, id_buku]);
    await db.end();

    return NextResponse.json({ message: `✅ Stok berhasil ditambahkan +${stok}` });
  } catch (error) {
    console.error("❌ Error di API PATCH /buku:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
