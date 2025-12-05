export async function POST(req) {
  try {
    const body = await req.json();

    // (Opsional) data yang kamu kirim dari frontend
    const { id_denda, total_denda } = body;

    // Buat data QR (bisa diganti dengan QRIS asli kalau nanti punya API)
    const qrData = `PEMBAYARAN | DENDA: ${total_denda} | ID: ${id_denda}`;

    // URL generator QR (free)
    const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    return Response.json({
      success: true,
      data: {
        qr_url,
        info: {
          id_denda,
          total_denda,
        },
      },
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json(
      { success: false, message: "Gagal membuat QR" },
      { status: 500 }
    );
  }
}
