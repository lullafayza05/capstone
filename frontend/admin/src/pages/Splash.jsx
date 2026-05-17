import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo.jsx'
import '../App.css'
import logo from '../assets/logo.png'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="splash-wrapper">
      <div className="splash-page">

        <div className="splash-page__art">
          <img
            src={logo}
            alt="Logo"
            className="splash-illustration"
          />
        </div>

        <div className="splash-page__brand">
          <Logo size="large" />
          <p className="splash-page__tagline">
            Pusat pengaduan masyarakat Desa Canden
          </p>
        </div>

        <div className="splash-page__actions">
          {/* Tombol Login Tetap Dipertahankan */}
          <button
            type="button"
            className="aduin-btn aduin-btn--primary splash-page__login"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          {/* PERHATIAN: Tombol Sign Up telah dihapus sepenuhnya dari sini demi keamanan portal Admin */}
        </div>
      </div>
    </div>
  )
}