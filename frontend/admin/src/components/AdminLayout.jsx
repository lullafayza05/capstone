import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext.jsx'
import logo from '../assets/logo.png'
import '../App.css'

function IconReports() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.758 1.098 1.4 1.2h.09a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconDots() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}

export default function AdminLayout() {
  const { logout } = useSession()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Navigasi utama">
        <div className="admin-shell__sidebar-brand">
          <img src={logo} alt="ADUIN" className="admin-shell__sidebar-logo" />
          <h1 className="admin-shell__sidebar-title">ADUIN</h1>
          <p className="admin-shell__sidebar-subtitle">Pusat Pengaduan<br />Masyarakat Desa Canden</p>
        </div>

        <nav className="admin-shell__nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}>
            <IconReports /> Data Laporan
          </NavLink>
          
          {/* MENU BARU: KELOLA USER */}
          <NavLink to="/kelola-user" className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}>
            <IconUsers /> Kelola User
          </NavLink>

          <NavLink to="/profil" className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}>
            <IconSettings /> Profil
          </NavLink>
        </nav>

        <button type="button" className="admin-shell__logout" onClick={handleLogout}>Keluar</button>
      </aside>

      <div className="admin-shell__main-col">
        <header className="admin-shell__topbar">
          <div className="admin-shell__topbar-inner">
            <div className="admin-shell__menu-wrap">
              <button type="button" className="admin-shell__icon-btn" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
                <IconDots />
              </button>
              {menuOpen && (
                <div className="admin-shell__popover" role="menu">
                  <NavLink to="/profil" role="menuitem" className="admin-shell__popover-item" onClick={() => setMenuOpen(false)}>Profil</NavLink>
                  <button type="button" role="menuitem" className="admin-shell__popover-item" onClick={handleLogout}>Keluar</button>
                </div>
              )}
            </div>
            <img src={logo} alt="ADUIN" className="admin-shell__mobile-logo" />
          </div>
        </header>

        <main className="admin-shell__content">
          <Outlet />
        </main>

        <nav className="admin-shell__bottom" aria-label="Navigasi bawah">
          <NavLink to="/dashboard" end className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}>
            <IconReports /> <span>Laporan</span>
          </NavLink>
          <NavLink to="/kelola-user" className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}>
            <IconUsers /> <span>User</span>
          </NavLink>
          <NavLink to="/profil" className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}>
            <IconSettings /> <span>Pengaturan</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}