import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialReports } from '../data/mockReports.js'

const ReportsContext = createContext(null)

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(() =>
    initialReports.map((r) => ({ ...r })),
  )

  const updateReport = useCallback((id, patch) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    )
  }, [])

  const getById = useCallback(
    (id) => reports.find((r) => r.id === id) ?? null,
    [reports],
  )

  const stats = useMemo(() => {
    const total = reports.length
    const diproses = reports.filter((r) => r.status === 'Diproses').length
    const selesai = reports.filter((r) => r.status === 'Selesai').length
    const ditolak = reports.filter((r) => r.status === 'Ditolak').length
    return { total, diproses, selesai, ditolak }
  }, [reports])

  const value = useMemo(
    () => ({ reports, updateReport, getById, stats }),
    [reports, updateReport, getById, stats],
  )

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  )
}

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) throw new Error('useReports harus di dalam ReportsProvider')
  return ctx
}
