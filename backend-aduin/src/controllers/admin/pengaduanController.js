const prisma = require('../../config/database');

// Mengambil semua laporan untuk ditampilkan di Dashboard Admin
const getAllPengaduan = async (req, res) => {
  try {
    const data = await prisma.pengaduan.findMany({
      include: { pelapor: true },
      orderBy: { createdAt: 'desc' } // Urutkan dari laporan yang paling baru
    });
    
    // Format data agar sesuai persis dengan kebutuhan tabel Dashboard Frontend
    const formatted = data.map(item => ({
      id: item.id,
      judul: item.judul,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      alamat: item.alamat,
      foto: item.foto,
      status: item.status,
      catatan: item.catatan, 
      createdAt: item.createdAt, 
      // Proteksi aman jika suatu saat user terhapus tapi laporannya masih ada
      pelapor: item.pelapor ? item.pelapor.nama : 'Pengguna Anonim' 
    }));
    
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error di getAllPengaduan:", error);
    res.status(500).json({ message: "Gagal mengambil data laporan" });
  }
};

// Mengupdate status dan menyimpan catatan tanggapan Admin
const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, kategori, catatan } = req.body;

    const updated = await prisma.pengaduan.update({
      where: { id: String(id) },
      data: { status, kategori, catatan }
    });

    res.status(200).json({ message: "Laporan berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Error di updatePengaduan:", error);
    res.status(500).json({ message: "Gagal mengupdate laporan" });
  }
};

// Menghapus laporan secara permanen
const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pengaduan.delete({ 
      where: { id: String(id) } 
    });
    res.status(200).json({ message: "Laporan berhasil dihapus permanen" });
  } catch (error) {
    console.error("Error di deletePengaduan:", error);
    res.status(500).json({ message: "Gagal menghapus laporan" });
  }
};

module.exports = { getAllPengaduan, updatePengaduan, deletePengaduan };