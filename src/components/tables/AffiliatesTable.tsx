"use client"
import { useEffect, useState } from 'react'
import DataTable, { Column } from '@/components/tables/DataTable'
import { apiFetch } from '@/lib/api'

type Affiliate = {
  id: string
  code: string
  commissionRate: number
  active: boolean
  createdAt: string
}

const columns: Column<Affiliate>[] = [
  { header: 'Código', accessor: (r) => r.code },
  { header: 'Comissão', accessor: (r) => `${(r.commissionRate * 100).toFixed(0)}%` },
  { header: 'Ativo', accessor: (r) => (r.active ? 'Sim' : 'Não') },
  { header: 'Criado em', accessor: (r) => new Date(r.createdAt).toLocaleString('pt-BR') },
]

export default function AffiliatesTable() {
  const [data, setData] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<Affiliate[]>(`/api/affiliates`)
        setData(res)
      } catch (e) {
        console.error('Failed to load affiliates', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>
  return <DataTable columns={columns} data={data} />
}

