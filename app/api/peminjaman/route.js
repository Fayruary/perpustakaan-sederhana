import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { cookies } from "next/headers";

// CONNECT DB
async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fairuz07",
    database: "db_perpus",
  });
}

// GET → Ambil semua peminjaman
export async function GET(req) {
  try {
    const db = await connectDB();
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
    console.log("GET ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST → siswa mengajukan pinjam buku
export async function POST(req) {
  try {
    const db = await connectDB();
    const { id_anggota, id_buku } = await req.json();

    if (!id_anggota || !id_buku)
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });

    const [bukuRows] = await db.query(
      "SELECT stok FROM buku WHERE id_buku = ?",
      [id_buku]
    );

    if (bukuRows.length === 0)
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      );

    if (bukuRows[0].stok <= 0)
      return NextResponse.json({ error: "Stok habis" }, { status: 400 });

    const tgl_pinjam = new Date().toISOString().slice(0, 10);
    const tgl_kembali = new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .slice(0, 10);

    await db.query(
      `INSERT INTO peminjaman 
       (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [id_anggota, id_buku, tgl_pinjam, tgl_kembali]
    );

    await db.end();
    return NextResponse.json({ message: "Permintaan pinjam dikirim" });
  } catch (error) {
    console.log("POST ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH → admin menyetujui / menolak
export async function PATCH(req) {
  try {
    const db = await connectDB();
    const { id_pinjam, action } = await req.json();

    if (!id_pinjam || !["Dipinjam", "Ditolak"].includes(action))
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

    const [rows] = await db.query(
      "SELECT id_buku FROM peminjaman WHERE id_pinjam = ?",
      [id_pinjam]
    );

    if (rows.length === 0)
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );

    const id_buku = rows[0].id_buku;

    if (action === "Dipinjam") {
      await db.query("UPDATE buku SET stok = stok - 1 WHERE id_buku = ?", [
        id_buku,
      ]);
    }

    await db.query("UPDATE peminjaman SET status=? WHERE id_pinjam=?", [
      action,
      id_pinjam,
    ]);

    await db.end();
    return NextResponse.json({ message: `Peminjaman ${action}` });
  } catch (error) {
    console.log("PATCH ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT → siswa mengembalikan buku
export async function PUT(req) {
  try {
    // PERBAIKAN TERPENTING
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value;

    if (!role)
      return NextResponse.json({ error: "Login dulu" }, { status: 401 });

    if (role.toLowerCase() !== "siswa")
      return NextResponse.json({ error: "Hanya siswa" }, { status: 403 });

    const { id_pinjam } = await req.json();

    if (!id_pinjam)
      return NextResponse.json(
        { error: "ID peminjaman wajib" },
        { status: 400 }
      );

    const db = await connectDB();

    const [rows] = await db.query(
      "SELECT id_buku, status FROM peminjaman WHERE id_pinjam=?",
      [id_pinjam]
    );

    if (rows.length === 0)
      return NextResponse.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );

    const { id_buku, status } = rows[0];

    if (status !== "Dipinjam")
      return NextResponse.json(
        { error: `Tidak bisa dikembalikan, status: ${status}` },
        { status: 400 }
      );

    // Tambah stok
    await db.query("UPDATE buku SET stok = stok + 1 WHERE id_buku=?", [
      id_buku,
    ]);

    // Update status peminjaman
    await db.query(
      "UPDATE peminjaman SET status='Dikembalikan' WHERE id_pinjam=?",
      [id_pinjam]
    );

    await db.end();

    return NextResponse.json({ message: "Buku berhasil dikembalikan" });
  } catch (error) {
    console.log("PUT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
