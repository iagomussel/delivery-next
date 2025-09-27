export default function CartItem({ name, quantity, price, onRemove }: { name: string; quantity: number; price: number; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border">
      <div>
        <div className="text-sm text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">Qtd: {quantity}</div>
      </div>
      <div className="text-sm text-foreground">R$ {(price * quantity).toFixed(2)}</div>
      {onRemove && (
        <button className="text-xs text-destructive hover:underline" onClick={onRemove}>remover</button>
      )}
    </div>
  )
}

