import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext.jsx'
import '../App.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useSession()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Logika validasi Login Admin
    if (username.trim() !== '' && password.trim() !== '') {
      // Simulasi autentikasi berhasil
      // (Di tahap produksi, ini bisa dihubungkan dengan axios.post ke Backend API)
      login({ 
        username: username, 
        email: 'admin@aduin.desa.id', 
        role: 'ADMIN' 
      })
      
      // Arahkan masuk ke Dashboard Admin
      navigate('/dashboard', { replace: true })
    } else {
      alert('Akses Ditolak: Harap masukkan Username dan Password yang valid.')
    }
  }

  return (
    <div 
      className="admin-login-wrapper" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#e9ecef',
        padding: '20px'
      }}
    >
      <form 
        onSubmit={handleLogin} 
        style={{ 
          background: 'white', 
          padding: '50px 40px', 
          borderRadius: '20px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
          width: '100%', 
          maxWidth: '420px', 
          textAlign: 'center' 
        }}
      >
        {/* Header Form */}
        <h2 style={{ fontSize: '28px', color: '#2c3e50', margin: '0 0 10px 0', fontWeight: '800' }}>
          Portal Admin
        </h2>
        <p style={{ color: '#7f8c8d', marginBottom: '40px', fontSize: '14px', lineHeight: '1.5' }}>
          Sistem Informasi Pengaduan<br/>Masyarakat Desa Canden
        </p>

        {/* Input Username */}
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '20px' }}>
          <span style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '600', fontSize: '14px' }}>
            Username
          </span>
          <input
            type="text"
            placeholder="Masukkan username admin..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px',
              fontSize: '15px',
              outlineColor: '#2d6a4f',
              backgroundColor: '#f8f9fa'
            }}
            required
          />
        </label>

        {/* Input Password */}
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '40px' }}>
          <span style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '600', fontSize: '14px' }}>
            Password
          </span>
          <input
            type="password"
            placeholder="Masukkan password rahasia..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px',
              fontSize: '15px',
              outlineColor: '#2d6a4f',
              backgroundColor: '#f8f9fa'
            }}
            required
          />
        </label>

        {/* Tombol Login */}
        <button
          type="submit"
          style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: '#2d6a4f', 
            color: 'white', 
            borderRadius: '10px', 
            border: 'none', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(45, 106, 79, 0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1b4332'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#2d6a4f'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          Masuk ke Sistem
        </button>

        {/* PERHATIAN: Teks dan Link Register Telah Sepenuhnya Dihapus Dari Sini */}
        
        <div style={{ marginTop: '30px', fontSize: '12px', color: '#bdc3c7' }}>
          &copy; {new Date().getFullYear()} ADUIN Dashboard Security
        </div>
      </form>
    </div>
  )
}