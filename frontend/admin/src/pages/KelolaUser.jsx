import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

export default function KelolaUser() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Menarik data user asli dari Backend secara Real-Time
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    axios.get('http://127.0.0.1:8000/api/users')
      .then(res => {
        setUsers(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Gagal menarik data user:", err)
        setError("Gagal memuat data dari server")
        setLoading(false)
      })
  }

  // Fungsi Hapus User Secara Permanen
  function handleDeleteUser(id, nama) {
    if (!window.confirm(`PERINGATAN: Menghapus akun ${nama} juga akan menghapus seluruh laporan pengaduan miliknya secara permanen. Lanjutkan?`)) return

    axios.delete(`http://127.0.0.1:8000/api/users/${id}`)
      .then(() => {
        // Hapus user dari layar tanpa perlu refresh halaman
        setUsers(prev => prev.filter(user => user.id !== id))
        alert(`Akun ${nama} beserta laporannya berhasil dihapus dari sistem.`)
      })
      .catch(err => {
        console.error("Gagal menghapus user:", err)
        alert('Gagal menghapus akun. Pastikan server backend menyala.')
      })
  }

  if (loading) return <div className="dashboard"><p>Memuat daftar pengguna...</p></div>
  if (error) return <div className="dashboard"><p className="error-alert">{error}</p></div>

  return (
    <div className="dashboard">
      <div className="dashboard__table-header">
        <div className="dashboard__header-left">
          <h2 className="dashboard__section-title">Kelola User Terdaftar</h2>
        </div>
      </div>

      <div role="region" aria-label="Daftar pengguna">
        <table className="dashboard__table">
          <thead>
            <tr>
              <th scope="col">Nama Lengkap</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Belum ada masyarakat yang mendaftar</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.nama}</strong></td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <button 
                      className="aduin-btn aduin-btn--bad" 
                      style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white' }}
                      onClick={() => handleDeleteUser(u.id, u.nama)}
                    >
                      Hapus Akun
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}