import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import defaultAvatar from '../assets/default-avatar.png'
import riwayatIcon from '../assets/riwayat.png'
import insightIcon from '../assets/insight.png'
import kategoriTerbanyakIcon from '../assets/kategori-terbanyak.png'
import dusunIcon from '../assets/dusun.png'
import editIcon from '../assets/edit.png'
import { useSession } from '../context/SessionContext.jsx'
import '../App.css'

// Data Dummy Diperlengkap Kembali
const DUMMY_AKTIVITAS = [
  { id: 1, aksi: 'Laporan #128 diverifikasi', waktu: '5 menit lalu' },
  { id: 2, aksi: 'Laporan #127 ditandai selesai', waktu: '1 jam lalu' },
  { id: 3, aksi: 'Laporan #125 diperbarui statusnya', waktu: '3 jam lalu' },
  { id: 4, aksi: 'Laporan #120 diteruskan ke dinas', waktu: 'Kemarin, 14:22' },
  { id: 5, aksi: 'Akun admin login dari perangkat baru', waktu: 'Kemarin, 09:05' },
]

const DUMMY_INSIGHT = {
  kategoriTerbanyak: 'Infrastruktur',
  dusunTertinggi: 'Dusun Karanglo',
}

export default function Profile() {
  const { user, login } = useSession()

  // State Data Tersimpan
  const [photo, setPhoto] = useState(() => localStorage.getItem('adminProfilePhoto') || null)
  const [nama, setNama] = useState(user?.username || 'Admin')

  // State Pratinjau
  const [tempPhoto, setTempPhoto] = useState(photo)
  const [tempNama, setTempNama] = useState(nama)
  
  const [isEditingNama, setIsEditingNama] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const fileInputRef = useRef(null)
  const menuRef = useRef(null)
  const namaInputRef = useRef(null)

  // Ganti Foto dengan Pembatas Ukuran (Maksimal 2MB)
  const handleChangePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi: Tolak file yang lebih besar dari 2MB agar LocalStorage tidak jebol
      if (file.size > 2 * 1024 * 1024) {
        alert('❌ Gagal! Ukuran foto terlalu besar. Maksimal ukuran foto adalah 2MB agar dapat tersimpan.')
        e.target.value = '' // Reset input
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setTempPhoto(reader.result)
        setMenuOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // Tombol Simpan Global dengan Proteksi Error (Try-Catch)
  const handleSaveAll = () => {
    try {
      if (tempPhoto) {
        localStorage.setItem('adminProfilePhoto', tempPhoto)
        setPhoto(tempPhoto)
      } else {
        localStorage.removeItem('adminProfilePhoto')
        setPhoto(null)
      }

      const finalNama = tempNama.trim() || 'Admin'
      setNama(finalNama)
      const updatedUser = { ...user, username: finalNama }
      login(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      alert('✅ Profil berhasil diperbarui secara permanen!')
    } catch (error) {
      console.error('Gagal menyimpan ke LocalStorage:', error)
      alert('❌ Memori browser penuh! Penyimpanan gagal. Cobalah menggunakan foto dengan ukuran/resolusi yang lebih kecil (di bawah 1MB).')
    }
  }

  const handleRemovePhoto = () => {
    setTempPhoto(null)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (isEditingNama) namaInputRef.current?.focus()
  }, [isEditingNama])

  return (
    <div className="profile-page">
      {/* ── BAGIAN HEADER: PROFIL & TOMBOL SIMPAN ── */}
      <div className="profile-page__header" style={{ paddingBottom: '30px' }}>
        
        <div className="profile-page__avatar-wrap">
          <div className="profile-page__avatar" onClick={() => tempPhoto ? setMenuOpen(!menuOpen) : fileInputRef.current.click()}>
            <img src={tempPhoto || defaultAvatar} alt="avatar" className="profile-page__img" style={{ objectFit: 'cover' }} />
            <div className="profile-page__avatar-overlay">
              <img src={editIcon} alt="Edit" className="profile-page__avatar-edit-icon" />
            </div>
          </div>
          
          {menuOpen && (
            <div className="profile-page__menu" ref={menuRef}>
              <button onClick={() => { fileInputRef.current.click(); setMenuOpen(false); }}>Ganti Foto</button>
              <button onClick={handleRemovePhoto} style={{ color: 'red' }}>Hapus Foto</button>
            </div>
          )}
        </div>

        <div className="profile-page__identity">
          {isEditingNama ? (
            <div className="profile-page__nama-edit">
              <input 
                ref={namaInputRef} 
                className="profile-page__nama-input" 
                value={tempNama} 
                onChange={(e) => setTempNama(e.target.value)} 
                onBlur={() => setIsEditingNama(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingNama(false)}
              />
            </div>
          ) : (
            <div className="profile-page__nama-display">
              <h1 className="profile-page__name">{tempNama}</h1>
              <button className="profile-page__edit-btn" onClick={() => setIsEditingNama(true)}>
                <img src={editIcon} alt="Edit" className="profile-page__edit-icon" />
              </button>
            </div>
          )}
          
          <p className="profile-page__email">{user?.email ?? 'admin@aduin.desa.id'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
            <span className="profile-page__badge">Administrator</span>
            <button 
              onClick={handleSaveAll}
              className="aduin-btn"
              style={{ 
                padding: '8px 20px', 
                fontSize: '14px', 
                backgroundColor: '#2d6a4f', 
                color: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span>💾 Simpan Profil</span>
            </button>
          </div>
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleChangePhoto} hidden />

      {/* ── BAGIAN BAWAH: KARTU RIWAYAT & KARTU INSIGHT ── */}
      <div className="profile-page__bottom">
        
        {/* KARTU 1: RIWAYAT AKTIVITAS */}
        <section className="profile-page__activity">
          <h2 className="section-title profile-page__section-with-icon">
            <img src={riwayatIcon} alt="Riwayat" className="section-icon" />
            Riwayat Aktivitas Terbaru
          </h2>
          <ul className="activity-list">
            {DUMMY_AKTIVITAS.map((item) => (
              <li key={item.id} className="activity-list__item">
                <span className="activity-list__dot" />
                <div className="activity-list__content">
                  <p className="activity-list__aksi">{item.aksi}</p>
                  <span className="activity-list__waktu">{item.waktu}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* KARTU 2: INSIGHT LAPORAN (DIKEMBALIKAN) */}
        <section className="profile-page__insight">
          <h2 className="section-title profile-page__section-with-icon">
            <img src={insightIcon} alt="Insight" className="section-icon" />
            Insight Laporan
          </h2>

          <div className="insight-card">
            <div className="insight-card__icon">
              <img src={kategoriTerbanyakIcon} alt="Kategori Terbanyak" />
            </div>
            <div className="insight-card__body">
              <span className="insight-card__label">
                Laporan terbanyak{' '}
              </span>
              <span className="insight-card__value">
                {DUMMY_INSIGHT.kategoriTerbanyak}
              </span>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-card__icon">
              <img src={dusunIcon} alt="Dusun Tertinggi" />
            </div>
            <div className="insight-card__body">
              <span className="insight-card__label">
                Dusun aduan tertinggi{' '}
              </span>
              <span className="insight-card__value">
                {DUMMY_INSIGHT.dusunTertinggi}
              </span>
            </div>
          </div>

          <Link to="/dashboard" className="profile-page__nav-link insight-card__link">
            Lihat semua laporan →
          </Link>
        </section>

      </div>
    </div>
  )
}