import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fairuz07",
    database: "db_perpus",
  });
}

export async function POST(req) {
  try {
    const { id_pinjam } = await req.json();
    const db = await connectDB();

    // 1. Ambil peminjaman
    const [rows] = await db.execute(
      `SELECT * FROM peminjaman WHERE id_pinjam = ?`,
      [id_pinjam]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    const p = rows[0];

    // 2. Hitung keterlambatan dari tanggal_kembali
    const today = new Date();
    const jatuhTempo = new Date(p.tanggal_kembali);

    let terlambatHari = Math.floor(
      (today - jatuhTempo) / (1000 * 60 * 60 * 24)
    );

    // Jika belum lewat tempo
    if (terlambatHari <= 0) {
      return NextResponse.json({
        message: "Tidak telat",
        terlambatHari: 0,
        totalDenda: 0,
      });
    }

    // 3. Jika sudah ada denda — jangan buat lagi
    const [dendaCheck] = await db.execute(
      `SELECT * FROM denda WHERE id_pinjam = ?`,
      [id_pinjam]
    );

    if (dendaCheck.length > 0) {
      return NextResponse.json({
        message: "Denda sudah dibuat sebelumnya",
        data: dendaCheck[0],
      });
    }

    // 4. Hitung total denda
    const totalDenda = terlambatHari * 1000;

    // 5. Insert denda
    await db.execute(
      `INSERT INTO denda (id_pinjam, terlambat_hari, total_denda, keterangan)
       VALUES (?, ?, ?, ?)`,
      [
        id_pinjam,
        terlambatHari,
        totalDenda,
        `Terlambat ${terlambatHari} hari`,
      ]
    );

    return NextResponse.json({
      message: "Denda berhasil dibuat!",
      terlambatHari,
      totalDenda,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
