"use client"
import { useEffect, useState } from 'react'
import DataTable, { Column } from '@/components/tables/DataTable'
import { apiFetch } from '@/lib/api'

type OrderRow = { id: string; customer: string; status: string; total: number }

const columns: Column<OrderRow>[] = [
  { header: 'ID', accessor: (r) => r.id.slice(0, 8).toUpperCase() },
  { header: 'Cliente', accessor: (r) => r.customer },
  { header: 'Status', accessor: (r) => r.status },
  { header: 'Total', accessor: (r) => `R$ ${r.total.toFixed(2)}` },
]

export default function OrderTable() {
  const [data, setData] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<any[]>(`/api/orders`)
        const rows: OrderRow[] = res.map((o) => ({ id: o.id, customer: o.customerName, status: o.status, total: o.total }))
        setData(rows)
      } catch (e) {
        console.error('Failed to load orders', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>
  return <DataTable columns={columns} data={data} />
}
