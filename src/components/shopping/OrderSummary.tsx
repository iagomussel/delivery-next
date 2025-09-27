export default function OrderSummary({ subtotal, deliveryFee = 0, discount = 0 }: { subtotal: number; deliveryFee?: number; discount?: number }) {
  const total = subtotal + deliveryFee - discount
  return (
    <div className="text-sm space-y-1 border border-border rounded p-4 bg-card">
      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">R$ {subtotal.toFixed(2)}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Entrega</span><span className="text-foreground">R$ {deliveryFee.toFixed(2)}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Desconto</span><span className="text-foreground">R$ {discount.toFixed(2)}</span></div>
      <div className="flex justify-between pt-2 border-t border-border"><span className="text-foreground font-medium">Total</span><span className="text-foreground font-medium">R$ {total.toFixed(2)}</span></div>
    </div>
  )
}

