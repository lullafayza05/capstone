const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === MENGIMPOR CONTROLLER YANG SUDAH KITA BUAT ===
const { getAllPengaduan, updatePengaduan, deletePengaduan } = require('./controllers/admin/pengaduanController');
const { getAllUsers, deleteUser } = require('./controllers/admin/userController');
const { createPengaduan } = require('./controllers/public/pengaduanController');

// ==========================================
// 1. URL API UNTUK ADMIN (Dikelompokkan)
// ==========================================
const adminRouter = express.Router();

// URL untuk manajemen laporan
adminRouter.get('/pengaduan', getAllPengaduan);           // GET: Ambil semua data
adminRouter.put('/pengaduan/:id', updatePengaduan);       // PUT: Edit/Tanggapi laporan (butuh ID)
adminRouter.delete('/pengaduan/:id', deletePengaduan);    // DELETE: Hapus laporan (butuh ID)

// URL untuk manajemen user
adminRouter.get('/users', getAllUsers);                   // GET: Ambil semua warga
adminRouter.delete('/users/:id', deleteUser);             // DELETE: Hapus warga (butuh ID)

app.use('/api', adminRouter);


// ==========================================
// 2. URL API UNTUK MASYARAKAT (PUBLIC)
// ==========================================
const publicRouter = express.Router();

// URL untuk membuat laporan baru
publicRouter.post('/pengaduan', createPengaduan);         // POST: Kirim data baru

app.use('/api', publicRouter);

module.exports = app;