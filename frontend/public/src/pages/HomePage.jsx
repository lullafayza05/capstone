import { useState } from 'react'
import searchIcon from '../assets/logo-search.png'
import clearSearchIcon from '../assets/logo-kembali-search.png'
import defaultAvatar from '../assets/default-avatar.png'
import totalLaporanIcon from '../assets/total-laporan.png'
import diprosesIcon from '../assets/diproses.png'
import selesaiIcon from '../assets/selesai.png'
import ditolakIcon from '../assets/ditolak.png'
import alamatIcon from '../assets/alamat.png'
import tanggalIcon from '../assets/tanggal.png'
import detailIcon from '../assets/detail.png'
import hapusIcon from '../assets/hapus.png'
import ituSajaIcon from '../assets/itu-saja.png'

const STAT_META = {
  'Total Laporan': {
    icon: totalLaporanIcon,
  },
  Diproses: {
    icon: diprosesIcon,
  },
  Selesai: {
    icon: selesaiIcon,
  },
  Ditolak: {
    icon: ditolakIcon,
  },
}

function statusToClass(status) {
  const s = (status || '').toLowerCase()

  if (s.includes('selesai')) return 'selesai'
  if (s.includes('ditolak')) return 'ditolak'
  if (s.includes('diterima') || s.includes('menunggu')) return 'diterima'

  return 'diproses'
}

function splitGreeting(greeting) {
  const i = (greeting || '').indexOf(',')
  if (i < 0) {
    return { lead: greeting || 'Halo', name: '' }
  }
  return {
    lead: greeting.slice(0, i).trim(),
    name: greeting.slice(i + 1).trim(),
  }
}

// =========================================================
// PERBAIKAN LOGIKA: Menggunakan variabel 'catatan' dari API
// =========================================================
function getAdminNote(report) {
  const status = (report.status || '').toLowerCase()

  // MENGGUNAKAN report.catatan (BUKAN report.note)
  if (report.catatan && report.catatan.trim() !== '') {
    return report.catatan
  }

  // Jika status diterima/menunggu dan belum ada catatan
  if (status.includes('diterima') || status.includes('menunggu')) {
    return 'Belum ada catatan yang diberikan oleh pihak desa.'
  }

  // Default untuk status lain jika belum ada catatan
  return 'Belum ada catatan.'
}

function HomePage({
  greeting,
  user,
  stats = [],
  reports = [],
  onDeleteReport,
  onOpenProfile,
}) {
  const [search, setSearch] = useState('')
  const [openDetail, setOpenDetail] = useState(null)

  const normalizedReports = reports.map((report) => ({
    ...report,
    status:
      report.status && report.status.trim() !== ''
        ? report.status
        : 'Diproses',
  }))

  const filteredReports = normalizedReports.filter((r) => {
    const keyword = search.trim().toLowerCase()

    return (
      (r.judul || '').toLowerCase().includes(keyword) ||
      (r.status || '').toLowerCase().includes(keyword) ||
      (r.alamat || '').toLowerCase().includes(keyword) ||
      (r.tanggal || '').toLowerCase().includes(keyword)
    )
  })

  const { lead, name } = splitGreeting(greeting)
  const displayName = name || user?.username || ''

  return (
    <section className="public-screen public-screen--home dashboard-home">
      <header className="dashboard-home__header">
        <div className="dashboard-home__greet">
          <h2 className="dashboard-home__title">
            {lead}
            {displayName ? (
              <>
                ,{' '}
                <span className="dashboard-home__name">{displayName}</span>
              </>
            ) : null}
          </h2>
          <p className="dashboard-home__sub">
            Selamat datang kembali di ADUIN
          </p>
        </div>

        <button
          type="button"
          className="dashboard-home__user-chip"
          onClick={onOpenProfile}
        >
          <img
            src={user?.photo || defaultAvatar}
            alt=""
            className="dashboard-home__avatar"
          />
          <span className="dashboard-home__chip-name">
            {user?.username || 'Pengguna'}
          </span>
          <span className="dashboard-home__chevron" aria-hidden>
            ▾
          </span>
        </button>
      </header>

      <div className="dashboard__stats dashboard__stats--cards">
        {stats.map((item) => {
          const meta = STAT_META[item.label] || {
            icon: totalLaporanIcon,
            foot: '',
          }

          return (
            <article
              key={item.label}
              className="dashboard__stat-card dashboard__stat-card--light"
            >
              <div className="dashboard__stat-card__row">
                <span className="dashboard__stat-icon-wrap">
                  <img
                    src={meta.icon}
                    alt=""
                    className="dashboard__stat-icon"
                  />
                </span>

                <p className="dashboard__stat-label">{item.label}</p>
              </div>

              <p className="dashboard__stat-value">{item.value ?? 0}</p>

              {meta.foot ? (
                <p className="dashboard__stat-foot">{meta.foot}</p>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="report-header-card">
        <div className="report-header-card__title report-header-card__title--left">
          <h3>Riwayat Laporan</h3>
        </div>

        <div className="report-header-card__search">
          <img
            src={searchIcon}
            alt=""
            className="report-search-icon"
            aria-hidden
          />

          <input
            type="search"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search ? (
            <button
              type="button"
              className="report-search-clear"
              onClick={() => setSearch('')}
              aria-label="Hapus pencarian"
            >
              <img
                src={clearSearchIcon}
                alt=""
                className="report-clear-icon"
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="report-list report-list--dashboard">
        {filteredReports.length > 0 ? (
          <>
            {filteredReports.map((r) => (
              <article key={r.id} className="card report report--row">
                <div className="report__thumb-wrap">
                  {r.foto ? (
                    <img
                      src={r.foto}
                      alt=""
                      className="report__thumb"
                    />
                  ) : (
                    <div
                      className="report__thumb report__thumb--placeholder"
                      aria-hidden
                    />
                  )}
                </div>

                <div className="report__body">
                  <strong className="report__title">{r.judul}</strong>

                  <p className="report__line">
                    <img
                      src={alamatIcon}
                      alt=""
                      className="report__inline-icon"
                    />
                    <span>{r.alamat || 'Belum ada lokasi'}</span>
                  </p>

                  <p className="report__line">
                    <img
                      src={tanggalIcon}
                      alt=""
                      className="report__inline-icon"
                    />
                    <span>{r.tanggal || 'Belum ada tanggal'}</span>
                  </p>

                  {r.deskripsi ? (
                    <p className="report__desc">{r.deskripsi}</p>
                  ) : (
                    <p className="report__desc report__desc--muted">
                      Belum ada deskripsi
                    </p>
                  )}

                  {openDetail === r.id ? (
                    <div className="report-detail-inline report-detail-inline--light">
                      <p>
                        <strong>Status:</strong> {r.status || 'Diproses'}
                      </p>

                      <p className="report-detail-inline__note">
                        <strong>Catatan:</strong> {getAdminNote(r)}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="report__side">
                  <span
                    className={`status-pill status-pill--light ${statusToClass(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>

                  <div className="report-card__actions report-card__actions--row">
                    <button
                      type="button"
                      className="report-btn report-btn--detail"
                      onClick={() =>
                        setOpenDetail(openDetail === r.id ? null : r.id)
                      }
                    >
                      <img
                        src={detailIcon}
                        alt=""
                        className="report-btn__icon"
                      />
                      Detail
                    </button>

                    <button
                      type="button"
                      className="report-btn report-btn--hapus"
                      onClick={() => onDeleteReport(r.id)}
                    >
                      <img
                        src={hapusIcon}
                        alt=""
                        className="report-btn__icon"
                      />
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <footer className="report-list-footer">
              <div className="report-list-footer__icon-wrap">
                <img
                  src={ituSajaIcon}
                  alt=""
                  className="report-list-footer__icon"
                />
              </div>

              <p className="report-list-footer__title">
                Itu saja laporan Anda
              </p>

              <p className="report-list-footer__sub">
                Terus sampaikan keluhan Anda untuk desa yang lebih baik.
              </p>
            </footer>
          </>
        ) : (
          <p className="report-empty">
            Belum ada laporan yang cocok dengan pencarian.
          </p>
        )}
      </div>
    </section>
  )
}

export default HomePage