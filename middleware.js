import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect ke login jika tidak login
  },
});

export const config = {
  matcher: ["/peminjaman", "/buku"], // daftar halaman yang diproteksi
};
