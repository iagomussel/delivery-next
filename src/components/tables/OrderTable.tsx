import DataTable, { Column } from '@/components/tables/DataTable'

type OrderRow = { id: string; customer: string; status: string; total: number }

const columns: Column<OrderRow>[] = [
  { header: 'ID', accessor: (r) => r.id },
  { header: 'Cliente', accessor: (r) => r.customer },
  { header: 'Status', accessor: (r) => r.status },
  { header: 'Total', accessor: (r) => `R$ ${r.total.toFixed(2)}` },
]

export default function OrderTable() {
  // TODO: fetch from /api/orders
  const data: OrderRow[] = []
  return <DataTable columns={columns} data={data} />
}

