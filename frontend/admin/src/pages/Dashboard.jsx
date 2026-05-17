import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../context/ReportsContext.jsx'
import { REPORT_CATEGORIES } from '../data/categories.js'
import * as XLSX from 'xlsx'
import '../App.css'

function IconSearch() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    belumDiterima: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  })

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/pengaduan/")
      .then(res => res.json())
      .then(data => {
const formatted = data.map((item) => ({
  ...item,
  tanggalLabel: new Date(
    item.createdAt // <--- UBAH DI SINI (sebelumnya item.created_at)
  ).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
}))

  setReports(formatted)

  setStats({
    total: formatted.length,

    belumDiterima: formatted.filter(
      r => r.status === "Belum diterima"
    ).length,

    diproses: formatted.filter(
      r => r.status === "Diproses"
    ).length,

    selesai: formatted.filter(
      r => r.status === "Selesai"
    ).length,

    ditolak: formatted.filter(
      r => r.status === "Ditolak"
    ).length,
  })
})
      .catch(err => console.log(err))
  }, [])

  const [query, setQuery] = useState('')
  const [kategori, setKategori] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return reports.filter((r) => {
      if (kategori && r.kategori !== kategori) {
        return false
      }

      if (!q) return true

     return (
  (r.judul || '').toLowerCase().includes(q) ||
  (r.alamat || '').toLowerCase().includes(q) ||
  (r.pelapor || '').toLowerCase().includes(q) ||
  (r.kategori || '').toLowerCase().includes(q)
)
    })
  }, [reports, query, kategori])

  // DOWNLOAD EXCEL
  function handleDownloadExcel() {
    const data = filtered.map((r) => ({
      Tanggal: r.tanggalLabel,
      Pelapor: r.pelapor,
      Judul: r.judul,
      Kategori: r.kategori,
      Status: r.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Laporan'
    )

    XLSX.writeFile(
      workbook,
      `data-laporan-${Date.now()}.xlsx`
    )
  }

  return (
    <div className="dashboard">
      {/* STATISTIK */}
      <section
        className="dashboard__stats"
        aria-label="Ringkasan laporan"
      >
        <article className="dashboard__stat-card">
          <p className="dashboard__stat-label">
            Total Laporan
          </p>
          <p className="dashboard__stat-value">
            {stats.total}
          </p>
        </article>

        <article className="dashboard__stat-card">
          <p className="dashboard__stat-label">
            Belum diterima
          </p>
          <p className="dashboard__stat-value">
            {stats.belumDiterima ??
              stats.belum_diterima ??
              0}
          </p>
        </article>

        <article className="dashboard__stat-card">
          <p className="dashboard__stat-label">
            Diproses
          </p>
          <p className="dashboard__stat-value">
            {stats.diproses}
          </p>
        </article>

        <article className="dashboard__stat-card">
          <p className="dashboard__stat-label">
            Selesai
          </p>
          <p className="dashboard__stat-value">
            {stats.selesai}
          </p>
        </article>

        <article className="dashboard__stat-card">
          <p className="dashboard__stat-label">
            Ditolak
          </p>
          <p className="dashboard__stat-value">
            {stats.ditolak}
          </p>
        </article>
      </section>

      {/* TABLE WRAPPER + HEADER DI DALAM KOTAK */}
      <div
        role="region"
        aria-label="Daftar laporan"
      >
        {/* HEADER DI DALAM KOTAK TABLE */}
      
        <div className="dashboard__table-header">
          {/* KIRI */}
          <div className="dashboard__header-left">
            <h2 className="dashboard__section-title">
              Data Laporan
            </h2>
          </div>

          {/* KANAN */}
          <div className="dashboard__header-right">
            {/* SEARCH */}
            <label className="dashboard__search">
              <span className="visually-hidden">
                Cari laporan
              </span>

              <input
                type="search"
                className="aduin-input dashboard__search-input"
                placeholder="Cari laporan..."
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                autoComplete="off"
              />
            </label>

            {/* FILTER */}
            <button
              type="button"
              className="dashboard__action-btn"
              onClick={() =>
                setFilterOpen((v) => !v)
              }
              aria-expanded={filterOpen}
            >
              Filter
            </button>

            {/* DOWNLOAD */}
            <button
              type="button"
              className="dashboard__action-btn"
              onClick={handleDownloadExcel}
            >
              Unduh File
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        {filterOpen ? (
          <div
            className="dashboard__filter-panel"
            role="region"
            aria-label="Filter kategori"
          >
            <label className="dashboard__filter-field">
              <span>Kategori</span>

              <select
                className="aduin-input dashboard__select"
                value={kategori}
                onChange={(e) =>
                  setKategori(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Semua kategori
                </option>

                {REPORT_CATEGORIES.map(
                  (c) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>
                  )
                )}
              </select>
            </label>

            {kategori ? (
              <button
                type="button"
                className="aduin-link dashboard__filter-clear"
                onClick={() =>
                  setKategori('')
                }
              >
                Hapus filter kategori
              </button>
            ) : null}
          </div>
        ) : null}

        {/* TABLE */}
        <table className="dashboard__table">
          <thead>
            <tr>
              <th scope="col">
                Laporan
              </th>

              <th
                scope="col"
                className="dashboard__th-cat"
              >
                Kategori
              </th>

              <th
                scope="col"
                className="dashboard__th-status"
              >
                Status
              </th>

              <th scope="col">
                Keterangan
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                {/* LAPORAN */}
                <td>
                  <div className="dashboard__cell-main">
                    <span className="dashboard__date">
                      {r.tanggalLabel}
                    </span>

                    <span className="dashboard__name">
                      {r.pelapor}
                    </span>

                    <span className="dashboard__title">
                      {r.judul}
                    </span>

                    <span className="dashboard__cat-mobile">
                      {r.kategori}
                    </span>
                  </div>
                </td>

                {/* KATEGORI */}
                <td className="dashboard__td-cat">
                  {r.kategori}
                </td>

                {/* STATUS */}
                <td className="dashboard__td-status">
                  <span
                    className={`dashboard__badge dashboard__badge--${badgeKind(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* DETAIL */}
                <td>
                  <Link
                    to={`/laporan/${r.id}`}
                    className="dashboard__detail-btn"
                  >
                    Detail Laporan
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <p className="dashboard__empty">
          Tidak ada laporan yang cocok
        </p>
      ) : null}
    </div>
  )
}

function badgeKind(status) {
  switch (status) {
    case 'Belum diterima':
      return 'new'

    case 'Diterima':
      return 'accepted'

    case 'Diproses':
      return 'progress'

    case 'Selesai':
      return 'done'

    case 'Ditolak':
      return 'bad'

    default:
      return 'new'
  }
}