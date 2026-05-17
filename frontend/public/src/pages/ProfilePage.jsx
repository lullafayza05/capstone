import { useState, useRef, useEffect } from 'react'
import defaultAvatar from '../assets/default-avatar.png'

export default function ProfilePage({ user, onBack, onPhotoChange, onUpdateProfile }) {
  // State untuk menyimpan data isian yang diketik user
  const [address, setAddress] = useState(user?.address || '')
  const [phone, setPhone] = useState(user?.phone || '')
  
  const fileInputRef = useRef(null)

  // ====================================================================
  // PERBAIKAN 1: Sinkronisasi Otomatis Saat Refresh (Anti-Blank)
  // Memaksa input form terisi ulang ketika data dari App.jsx sudah siap
  // ====================================================================
  useEffect(() => {
    if (user) {
      setAddress(user.address || '')
      setPhone(user.phone || '')
    }
  }, [user])

  // Fungsi saat tombol Simpan ditekan
  const handleSave = () => {
    // Cegah penyimpanan jika kosong
    if (!address.trim() || !phone.trim()) {
      alert('⚠️ Alamat dan Nomor Telepon wajib diisi dengan lengkap!')
      return
    }

    onUpdateProfile({
      address: address,
      phone: phone
    })
    // Notifikasi berhasil
    alert('✅ Profil berhasil diperbarui dan dikunci ke sistem!')
  }

  // Fungsi untuk menangani file foto
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ====================================================================
      // PERBAIKAN 2: Batasi Ukuran Foto Maksimal 2MB (Anti-Error LocalStorage)
      // ====================================================================
      if (file.size > 2 * 1024 * 1024) {
        alert('❌ Gagal! Ukuran foto terlalu besar. Maksimal ukuran foto adalah 2MB.')
        e.target.value = '' // Reset input agar tidak nyangkut
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        onPhotoChange(reader.result)
        alert('📷 Foto profil siap! Jangan lupa klik "Simpan Perubahan" di bawah.')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section className="public-screen profile-user-page" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <header className="profile-user-page__header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={onBack} 
          className="aduin-btn" 
          style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Kembali
        </button>
        <div>
          <h2 style={{ fontSize: '24px', margin: 0, color: '#2c3e50' }}>Profil</h2>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Kelola informasi akun Anda</p>
        </div>
      </header>

      <div className="profile-user-page__content" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* KOLOM KIRI: Foto & Identitas Singkat */}
        <div className="profile-user-page__sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}>
          <div 
            className="profile-user-page__avatar-wrapper" 
            style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #ecf0f1', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          >
            <img src={user?.photo || defaultAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Tombol Khusus Upload Foto */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', color: '#87b8b4', background: 'transparent', border: '2px solid #87b8b4', borderRadius: '20px', cursor: 'pointer', marginBottom: '15px', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.target.style.background = '#87b8b4'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#87b8b4'; }}
          >
            📷 Unggah Foto
          </button>
          
          {/* Input file tersembunyi */}
          <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handlePhotoUpload} hidden />
          
          <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{user?.username}</h3>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>{user?.email}</p>
        </div>

        {/* KOLOM KANAN: Formulir Data Diri Langsung */}
        <div className="profile-user-page__main" style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          
          <div className="profile-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Field: Nama Pengguna (Terkunci) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '150px' }}>
                <span style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>👤</span>
                <span style={{ color: '#7f8c8d', fontWeight: '500' }}>Nama Pengguna</span>
              </div>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>{user?.fullName || user?.username}</span>
            </div>

            {/* Field: Alamat (Input Bebas) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '150px' }}>
                <span style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>📍</span>
                <span style={{ color: '#7f8c8d', fontWeight: '500' }}>Alamat</span>
              </div>
              <input 
                type="text" 
                placeholder="Ketik alamat Anda..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', maxWidth: '55%', textAlign: 'right', outlineColor: '#87b8b4', fontWeight: '500', color: '#2c3e50' }}
              />
            </div>

            {/* Field: Nomor Telepon (Input Bebas) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '150px' }}>
                <span style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>📞</span>
                <span style={{ color: '#7f8c8d', fontWeight: '500' }}>Nomor Telepon</span>
              </div>
              <input 
                type="tel" 
                placeholder="Ketik no telepon..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', maxWidth: '55%', textAlign: 'right', outlineColor: '#87b8b4', fontWeight: '500', color: '#2c3e50' }}
              />
            </div>

            {/* Field: Status (Terkunci) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '150px' }}>
                <span style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>🛡️</span>
                <span style={{ color: '#7f8c8d', fontWeight: '500' }}>Status</span>
              </div>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>{user?.role || 'Pelapor'}</span>
            </div>

            {/* Tombol Simpan Perubahan */}
            <button 
              onClick={handleSave}
              className="aduin-btn"
              style={{ marginTop: '10px', width: '100%', padding: '14px', backgroundColor: '#87b8b4', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background 0.3s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#6d9c98'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#87b8b4'}
            >
              💾 Simpan Perubahan
            </button>

          </div>

        </div>
      </div>
    </section>
  )
}