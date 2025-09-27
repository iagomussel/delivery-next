export default function OptionGroup({ name, children, required = false }: { name: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2 border border-border rounded p-3 bg-card">
      <div className="text-sm font-medium text-foreground">{name} {required && <span className="text-destructive">*</span>}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

