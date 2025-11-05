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

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT id_anggota, nama, password, status FROM anggota WHERE email = ?",
      [email]
    );

    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
    }

    const user = rows[0];

    if (password !== user.password) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login berhasil",
      id_anggota: user.id_anggota,
      nama: user.nama,
      status: user.status, // penting untuk redirect
    });
  } catch (error) {
    console.error("❌ Error login:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
