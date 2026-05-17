const prisma = require('../../config/database');

const createPengaduan = async (req, res) => {
  try {
    // 1. Menangkap data yang dikirim dari Frontend Masyarakat
    const { 
      judul, 
      deskripsi, 
      kategori, 
      alamat, 
      foto, 
      pelapor_nama, 
      pelapor_username 
    } = req.body;

    // 2. LOGIKA CERDAS: Sinkronisasi User Otomatis
    // Cari apakah user ini sudah pernah masuk ke database MySQL
    let userDb = await prisma.user.findUnique({
      where: { username: pelapor_username }
    });

    // Jika belum ada di MySQL (karena daftarnya cuma lewat LocalStorage UI), buatkan otomatis!
    if (!userDb) {
      userDb = await prisma.user.create({
        data: {
          username: pelapor_username,
          nama: pelapor_nama || pelapor_username,
          email: `${pelapor_username}@aduin.desa.id`,
          password: "password_otomatis", 
          role: "MASYARAKAT"
        }
      });
    }

    // 3. Simpan Laporan ke MySQL dan ikatkan dengan ID user tersebut
    const laporanBaru = await prisma.pengaduan.create({
      data: {
        judul,
        deskripsi,
        kategori,
        alamat,
        foto: foto || null,
        status: "Belum diterima", // Status standar saat pertama kali dikirim
        userId: userDb.id         // Relasi Prisma (Foreign Key)
      }
    });

    res.status(201).json({ 
      message: "Laporan berhasil meluncur ke server desa!", 
      data: laporanBaru 
    });

  } catch (error) {
    console.error("Gagal membuat laporan:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server saat mengirim laporan" });
  }
};

module.exports = { createPengaduan };