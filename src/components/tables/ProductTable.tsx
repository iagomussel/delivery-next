import DataTable, { Column } from '@/components/tables/DataTable'

type ProductRow = { id: string; name: string; price: number; active: boolean }

const columns: Column<ProductRow>[] = [
  { header: 'Nome', accessor: (r) => r.name },
  { header: 'Preço', accessor: (r) => `R$ ${r.price.toFixed(2)}` },
  { header: 'Ativo', accessor: (r) => (r.active ? 'Sim' : 'Não') },
]

export default function ProductTable() {
  // TODO: fetch from /api/products
  const data: ProductRow[] = []
  return <DataTable columns={columns} data={data} />
}

