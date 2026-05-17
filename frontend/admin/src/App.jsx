import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout.jsx'
import { RequireAuth } from './components/RequireAuth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import ReportDetail from './pages/ReportDetail.jsx'
import Splash from './pages/Splash.jsx'
import KelolaUser from './pages/KelolaUser.jsx'

export default function App() {
  return (
    <Routes>
      {/* Rute Publik Sisi Admin */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      
      {/* CATATAN: Rute /register telah Dihapus Secara Permanen demi Keamanan */}

      {/* Rute yang Dilindungi (Wajib Login Admin) */}
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          {/* Halaman Dashboard Utama */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Halaman Detail Laporan (Ubah Status & Tanggapan) */}
          <Route path="/laporan/:id" element={<ReportDetail />} />
          
          {/* Halaman Manajemen Kelola Pengguna */}
          <Route path="/kelola-user" element={<KelolaUser />} />
          
          {/* Halaman Profil & Pengaturan Admin */}
          <Route path="/profil" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallback Route: Jika rute tidak ditemukan (termasuk jika ada yang mencoba mengetik /register), lempar ke halaman Splash */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}