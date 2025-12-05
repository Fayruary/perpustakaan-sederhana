import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function migratePasswords() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Fairuz07",
      database: "db_perpus",
    });

    console.log("Terhubung ke database");

    const [users] = await db.query("SELECT id_anggota, nama, password FROM anggota");
    let count = 0;

    for (const user of users) {
      // Cek apakah password sudah di-hash
      if (!user.password.startsWith("$2a$")) {
        const hashed = await bcrypt.hash(user.password, 10);

        // Update password di database
        await db.query("UPDATE anggota SET password = ? WHERE id_anggota = ?", [hashed, user.id_anggota]);
        console.log(`Password untuk "${user.nama}" (ID: ${user.id_anggota}) berhasil di-hash`);
        count++;
      } else {
        console.log(`Password untuk "${user.nama}" (ID: ${user.id_anggota}) sudah di-hash, dilewati`);
      }
    }

    await db.end();
    console.log(`Selesai! Total password yang di-hash: ${count}`);
  } catch (error) {
    console.error("Terjadi error saat migrate password:", error);
  }
}

// Jalankan migrate
migratePasswords();
