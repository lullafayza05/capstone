const prisma = require('../../config/database');

// Mengambil semua user dengan role MASYARAKAT untuk halaman Kelola User
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'MASYARAKAT' },
      select: {
        id: true,
        nama: true,
        username: true,
        email: true,
        telepon: true,
        createdAt: true // Berguna jika UI ingin menampilkan tanggal daftar
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error di getAllUsers:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data user" });
  }
};

// Menghapus user secara permanen beserta SELURUH laporannya (Manual Cascade & Transaction)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // FITUR ENTERPRISE: Prisma Transaction
    // Menjamin jika proses pertama berhasil tapi proses kedua gagal, 
    // maka proses pertama akan dibatalkan agar database tidak cacat.
    await prisma.$transaction([
      // 1. Hapus semua pengaduan milik user ini terlebih dahulu (Mencegah Constraint Error)
      prisma.pengaduan.deleteMany({
        where: { userId: String(id) }
      }),
      
      // 2. Baru hapus akun usernya
      prisma.user.delete({
        where: { id: String(id) }
      })
    ]);

    res.status(200).json({ message: "User dan seluruh laporannya berhasil dihapus tanpa sisa" });
  } catch (error) {
    console.error("Error di deleteUser:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus user" });
  }
};

module.exports = { getAllUsers, deleteUser };