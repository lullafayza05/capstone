import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { REPORT_CATEGORIES } from '../data/categories.js'
import { REPORT_STATUSES } from '../data/statuses.js'
import '../App.css'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // State baru untuk mengontrol modal mana yang terbuka ('status' atau 'tanggapan')
  const [activeModal, setActiveModal] = useState(null) 
  
  const [draftStatus, setDraftStatus] = useState('')
  const [draftKategori, setDraftKategori] = useState('')
  const [draftTanggapan, setDraftTanggapan] = useState('')

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/pengaduan/")
      .then(res => {
        const found = res.data.find(r => String(r.id) === String(id))
        if (found) {
          setReport(found)
        } else {
          navigate('/dashboard', { replace: true })
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <p>Memuat data...</p>
  if (!report) return null

  // Handler Buka Modal Status
  function openStatusDialog() {
    setDraftStatus(report.status || 'Belum diterima')
    setDraftKategori(report.kategori || '')
    setActiveModal('status')
  }

  // Handler Buka Modal Tanggapan
  function openTanggapanDialog() {
    setDraftTanggapan(report.catatan || '')
    setActiveModal('tanggapan')
  }

  // Menyimpan perubahan (Otomatis mendeteksi modal mana yang sedang aktif)
  function saveDialog() {
    const updatedData = {
      // Jika modal status aktif, simpan status baru. Jika tidak, gunakan data lama.
      status: activeModal === 'status' ? draftStatus : report.status,
      kategori: activeModal === 'status' ? draftKategori : report.kategori,
      // Jika modal tanggapan aktif, simpan catatan baru. Jika tidak, gunakan catatan lama.
      catatan: activeModal === 'tanggapan' ? draftTanggapan : (report.catatan || '')
    }

    axios.put(`http://127.0.0.1:8000/api/pengaduan/${id}`, updatedData)
      .then(() => {
        setReport({ ...report, ...updatedData })
        setActiveModal(null)
        alert(`${activeModal === 'status' ? 'Status' : 'Tanggapan'} berhasil diperbarui!`)
      })
      .catch(err => {
        console.error(err)
        setReport({ ...report, ...updatedData }) 
        setActiveModal(null)
        alert('Disimulasikan berhasil (Buat rute PUT di backend untuk simpan permanen)')
      })
  }

  function handleDelete() {
    if (!window.confirm("Apakah Anda yakin ingin menghapus laporan ini secara permanen?")) return;

    axios.delete(`http://127.0.0.1:8000/api/pengaduan/${id}`)
      .then(() => {
        alert('Laporan berhasil dihapus')
        navigate('/dashboard', { replace: true })
      })
      .catch(err => {
        console.error(err)
        alert('Disimulasikan terhapus (Buat rute DELETE di backend)')
        navigate('/dashboard', { replace: true })
      })
  }

  // Logika Pengunci: Admin tidak bisa memberi tanggapan jika status masih "Belum diterima" atau "MENUNGGU"
  const isTanggapanLocked = 
    (report.status || '').toLowerCase() === 'belum diterima' || 
    (report.status || '').toLowerCase() === 'menunggu';

  return (
    <div className="report-detail">
      <div className="report-detail__topbar">
        <button type="button" className="report-detail__close" onClick={() => navigate(-1)} aria-label="Kembali">Close</button>
        <div className="report-detail__pill">Detail Laporan</div>
      </div>

      <article className="report-detail__card">
        <dl className="report-detail__list">
          <div className="report-detail__row"><dt>Pelapor</dt><dd>{report.pelapor}</dd></div>
          <div className="report-detail__row"><dt>Alamat</dt><dd>{report.alamat}</dd></div>
          <div className="report-detail__row"><dt>Tanggal</dt><dd>{report.tanggal}</dd></div>
          <div className="report-detail__row"><dt>Judul</dt><dd>{report.judul}</dd></div>
          <div className="report-detail__row"><dt>Kategori</dt><dd>{report.kategori}</dd></div>
          <div className="report-detail__row"><dt>Deskripsi</dt><dd>{report.deskripsi}</dd></div>
          <div className="report-detail__row">
            <dt>Status</dt>
            <dd><span className={`report-detail__status-pill report-detail__status-pill--${badgeKind(report.status)}`}>{report.status}</span></dd>
          </div>
          <div className="report-detail__row report-detail__row--block">
            <dt>Tanggapan Admin</dt>
            <dd><strong>{report.catatan || 'Belum ada tanggapan'}</strong></dd>
          </div>
          <div className="report-detail__row report-detail__row--block">
            <dt>Foto</dt>
            <dd className="report-detail__foto">{report.fotoLabel || '-'}</dd>
          </div>
        </dl>

        {/* Pemisahan Tombol Aksi */}
        <div className="report-card__actions--row" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="aduin-btn aduin-btn--tan" onClick={openStatusDialog}>
            Ubah Status
          </button>
          
          <button 
            type="button" 
            className="aduin-btn aduin-btn--primary" 
            style={{ 
              backgroundColor: isTanggapanLocked ? '#cccccc' : '#17a2b8', 
              cursor: isTanggapanLocked ? 'not-allowed' : 'pointer',
              color: isTanggapanLocked ? '#666666' : 'white'
            }} 
            onClick={openTanggapanDialog}
            disabled={isTanggapanLocked}
            title={isTanggapanLocked ? "Ubah status terlebih dahulu untuk memberi tanggapan" : "Beri tanggapan"}
          >
            Beri Tanggapan
          </button>

          <button type="button" className="aduin-btn aduin-btn--bad" style={{ backgroundColor: 'red', color: 'white', marginLeft: 'auto' }} onClick={handleDelete}>
            Hapus Laporan
          </button>
        </div>
      </article>

      {/* RENDER MODAL DINAMIS */}
      {activeModal !== null && (
        <div className="report-detail__backdrop" role="presentation">
          <button type="button" className="report-detail__backdrop-hit" onClick={() => setActiveModal(null)} />
          <div className="report-detail__modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="report-detail__modal-title">
              {activeModal === 'status' ? 'Ubah Status Laporan' : 'Kirim Tanggapan ke Pelapor'}
            </h2>
            
            {/* Form Modal Status */}
            {activeModal === 'status' && (
              <>
                <label className="aduin-field">
                  <span className="report-detail__label">Ubah Status</span>
                  <select className="aduin-input report-detail__select" value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)}>
                    {REPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="aduin-field">
                  <span className="report-detail__label">Kategori (Opsional)</span>
                  <select className="aduin-input report-detail__select" value={draftKategori} onChange={(e) => setDraftKategori(e.target.value)}>
                    {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </>
            )}

            {/* Form Modal Tanggapan */}
            {activeModal === 'tanggapan' && (
              <label className="aduin-field">
                <span className="report-detail__label">Isi Tanggapan</span>
                <textarea 
                  className="aduin-input" 
                  rows="4" 
                  style={{ width: '100%', padding: '10px', resize: 'vertical' }}
                  placeholder="Contoh: Tim desa sudah menuju ke lokasi untuk melakukan perbaikan..."
                  value={draftTanggapan} 
                  onChange={(e) => setDraftTanggapan(e.target.value)}
                />
              </label>
            )}

            <div className="report-detail__modal-actions">
              <button type="button" className="aduin-btn aduin-btn--tan" onClick={() => setActiveModal(null)}>Batal</button>
              <button type="button" className="aduin-btn aduin-btn--primary" onClick={saveDialog}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function badgeKind(status) {
  switch (status) {
    case 'Belum diterima': return 'new'       
    case 'Diterima': return 'accepted'   
    case 'Diproses': return 'progress'   
    case 'Selesai': return 'done'       
    case 'Ditolak': return 'bad'
    default: return 'new'
  }
}