import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Fairuz07",
      database: "db_perpus",
    });

    const body = await req.json();
    const { nama, alamat, no_telp, email, password } = body;

    if (!nama || !alamat || !email || !password) {
      return NextResponse.json(
        { message: "Data anggota tidak lengkap" },
        { status: 400 }
      );
    }

    // Cek email sudah terdaftar
    const [existing] = await db.query("SELECT * FROM anggota WHERE email = ?", [email]);
    if (existing.length > 0) {
      await db.end();
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
    }

    const tanggal_daftar = new Date().toISOString().slice(0, 10);

    // Simpan anggota baru
    await db.query(
      `INSERT INTO anggota (nama, alamat, no_telp, email, tanggal_daftar, status, password)
       VALUES (?, ?, ?, ?, ?, 'siswa', ?)`,
      [nama, alamat, no_telp, email, tanggal_daftar, password]
    );

    await db.end();
    return NextResponse.json({ message: "✅ Anggota berhasil didaftarkan!" });
  } catch (error) {
    console.error("❌ Error POST /anggota:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server", error: error.message }, { status: 500 });
  }
}
