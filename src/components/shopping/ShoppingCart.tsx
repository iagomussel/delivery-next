import CartItem from '@/components/shopping/CartItem'

type Item = { id: string; name: string; quantity: number; price: number }

export default function ShoppingCart({ items }: { items: Item[] }) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <div className="border border-border rounded p-4 space-y-2 bg-card">
      <h3 className="text-sm font-medium text-foreground">Seu carrinho</h3>
      <div className="divide-y divide-border">
        {items.length === 0 && <p className="text-sm text-muted-foreground py-2">Vazio</p>}
        {items.map((i) => (
          <CartItem key={i.id} name={i.name} quantity={i.quantity} price={i.price} />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm pt-2">
        <span className="text-muted-foreground">Total</span>
        <span className="text-foreground font-medium">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  )
}

