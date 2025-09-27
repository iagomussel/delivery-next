"use client"
import { useEffect, useState } from 'react'
import DataTable, { Column } from '@/components/tables/DataTable'
import { apiFetch } from '@/lib/api'

type ProductRow = { id: string; name: string; price: number; active: boolean }

const columns: Column<ProductRow>[] = [
  { header: 'Nome', accessor: (r) => r.name },
  { header: 'Preço', accessor: (r) => `R$ ${r.price.toFixed(2)}` },
  { header: 'Ativo', accessor: (r) => (r.active ? 'Sim' : 'Não') },
]

export default function ProductTable() {
  const [data, setData] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<any[]>(`/api/products`)
        const rows = res.map((p) => ({ id: p.id, name: p.name, price: p.basePrice, active: p.isActive }))
        setData(rows)
      } catch (e) {
        console.error('Failed to load products', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>
  return <DataTable columns={columns} data={data} />
}
