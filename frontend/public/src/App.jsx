import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ReportPage from './pages/ReportPage'
import SignUpPage from './pages/SignUpPage'
import { INITIAL_USER, INITIAL_REPORTS } from './constants/mockData'
import './App.css'

function App() {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('aduin_public_users')
    return savedUsers ? JSON.parse(savedUsers) : []
  })

  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem('aduin_public_session')
    return savedSession ? JSON.parse(savedSession) : {
      ...INITIAL_USER,
      name: '', username: '', password: '', email: '', address: '', phone: '', photo: ''
    }
  })

  const [screen, setScreen] = useState(() => {
    const savedSession = localStorage.getItem('aduin_public_session')
    return savedSession && JSON.parse(savedSession).username ? 'home' : 'landing'
  })

  const [reports, setReports] = useState([]) 

  const greeting = useMemo(() => {
    if (!user.username) return 'Halo'
    return `Halo, ${user.username}`
  }, [user.username])

  useEffect(() => {
    if (screen === 'home') {
      const fetchReports = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/pengaduan/")
          
          const formattedReports = response.data.map(item => ({
            ...item,
            tanggal: new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            }),
            tanggalLabel: new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            }),
            catatan: item.catatan || '',
            tanggapan: item.catatan || '', 
            catatanAdmin: item.catatan || '' 
          }))
          
          setReports(formattedReports)
        } catch (error) {
          console.error("Gagal terhubung ke backend...", error)
          if (reports.length === 0) setReports(INITIAL_REPORTS || [])
        }
      }
      fetchReports()
    }
  }, [screen])

  const handleLogin = ({ username, password }) => {
    let foundUser = registeredUsers.find(
      (item) => item.username === username.trim() && item.password === password
    )

    if (!foundUser) {
      foundUser = {
        fullName: username.trim(),
        username: username.trim(),
        password: password,
        email: `${username.trim()}@aduin.com`,
        address: '',
        phone: '',
        photo: '',
      }
      
      const updatedUsers = [...registeredUsers, foundUser]
      setRegisteredUsers(updatedUsers)
      localStorage.setItem('aduin_public_users', JSON.stringify(updatedUsers))
    }

    const sessionData = {
      ...INITIAL_USER,
      name: foundUser.fullName,
      username: foundUser.username,
      password: foundUser.password,
      email: foundUser.email,
      address: foundUser.address || '',
      phone: foundUser.phone || '',
      photo: foundUser.photo || '',
      role: 'Pelapor',
    }

    setUser(sessionData)
    localStorage.setItem('aduin_public_session', JSON.stringify(sessionData))
    
    alert(`Selamat datang, ${foundUser.username}!`)
    setScreen('home')
  }

  const handleSignUp = ({ fullName, username, email, password }) => {
    const cleanUsername = username.trim()
    const isUsernameExist = registeredUsers.some((item) => item.username === cleanUsername)

    if (isUsernameExist) {
      alert('Username sudah digunakan. Coba username lain.')
      return
    }

    const cleanEmail = email.includes('@gmail.com') ? email.trim() : `${email.trim()}@gmail.com`

    const newUser = {
      fullName: fullName?.trim() || cleanUsername,
      username: cleanUsername,
      email: cleanEmail,
      password,
      address: '',
      phone: '',
      photo: '',
    }

    const updatedUsers = [...registeredUsers, newUser]
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('aduin_public_users', JSON.stringify(updatedUsers))

    alert('Pendaftaran berhasil! Silakan login.')
    setScreen('login')
  }

  // =================================================================
  // FITUR BARU: Mengirim Laporan Baru ke Database MySQL (Backend)
  // =================================================================
  const handleCreateReport = async (formData) => {
    try {
      const payload = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        kategori: formData.kategori || 'Lainnya',
        alamat: formData.alamat || user.address || 'Lokasi tidak disebutkan',
        foto: formData.foto || null,
        pelapor_nama: user.name || user.fullName || user.username,
        pelapor_username: user.username
      };

      const response = await axios.post("http://127.0.0.1:8000/api/pengaduan", payload);
      
      if (response.status === 201) {
        alert('🚀 Laporan berhasil dikirim dan masuk ke server desa!');
        setScreen('home'); 
      }
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      alert("Terjadi kesalahan saat mengirim laporan ke server. Silakan coba lagi.");
    }
  }

  const handleDeleteReport = (id) => {
    const confirmDelete = window.confirm('Hapus laporan ini?')
    if (!confirmDelete) return
    setReports((prev) => prev.filter((item) => item.id !== id))
  }

  const handlePhotoChange = (imageUrl) => {
    const updatedUser = { ...user, photo: imageUrl }
    setUser(updatedUser)
    localStorage.setItem('aduin_public_session', JSON.stringify(updatedUser))

    const updatedUsers = registeredUsers.map((item) =>
      item.username === user.username ? { ...item, photo: imageUrl } : item
    )
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('aduin_public_users', JSON.stringify(updatedUsers))
  }

  const handleUpdateProfile = ({ address, phone }) => {
    const updatedUser = { ...user, address, phone }
    setUser(updatedUser)
    localStorage.setItem('aduin_public_session', JSON.stringify(updatedUser))

    const updatedUsers = registeredUsers.map((item) =>
      item.username === user.username ? { ...item, address, phone } : item
    )
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('aduin_public_users', JSON.stringify(updatedUsers))
    alert('Profil berhasil diperbarui!')
  }

  const handleLogout = () => {
    localStorage.removeItem('aduin_public_session')
    setScreen('landing')
    setUser({ ...INITIAL_USER, name: '', username: '', password: '', email: '', address: '', phone: '' })
  }

  const myReports = reports || []

  const stats = [
    { label: 'Total Laporan', value: myReports.length },
    { label: 'Diproses', value: myReports.filter((item) => (item.status || '').toLowerCase() === 'diproses').length },
    { label: 'Selesai', value: myReports.filter((item) => (item.status || '').toLowerCase() === 'selesai').length },
    { label: 'Ditolak', value: myReports.filter((item) => (item.status || '').toLowerCase() === 'ditolak').length },
  ]

  const screens = {
    landing: <LandingPage onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />,
    login: <LoginPage onSubmit={handleLogin} onSignup={() => setScreen('signup')} />,
    signup: <SignUpPage onSubmit={handleSignUp} onLogin={() => setScreen('login')} />,
    home: (
      <HomePage
        greeting={greeting}
        user={user}
        stats={stats}
        reports={myReports}
        onDeleteReport={handleDeleteReport}
        onOpenProfile={() => setScreen('profile')}
      />
    ),
    report: (
      // Menyuntikkan fungsi handleCreateReport ke komponen ReportPage
      <ReportPage
        user={user}
        onSubmit={handleCreateReport} 
        onBack={() => setScreen('home')}
      />
    ),
    profile: (
      <ProfilePage
        user={user}
        onBack={() => setScreen('home')}
        onPhotoChange={handlePhotoChange}
        onUpdateProfile={handleUpdateProfile}
      />
    ),
  }

  const showNav = ['home', 'report', 'profile'].includes(screen)

  return (
    <div className={`public-app${showNav ? ' public-app--with-nav' : ''}`}>
      <main className="public-main">{screens[screen]}</main>
      {showNav && <BottomNav screen={screen} onNavigate={setScreen} onLogout={handleLogout} />}
    </div>
  )
}

export default App