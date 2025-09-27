import OptionGroup from '@/components/menu/OptionGroup'
import { Checkbox } from '@/components/ui/checkbox'

type Option = { id: string; label: string; priceDelta?: number }

export default function ProductOptions({ groups }: { groups: { name: string; required?: boolean; options: Option[] }[] }) {
  return (
    <div className="space-y-3">
      {groups.map((g, gi) => (
        <OptionGroup key={gi} name={g.name} required={g.required}>
          {g.options.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox />
              <span>{o.label}</span>
              {o.priceDelta ? (
                <span className="text-xs text-muted-foreground">+ R$ {o.priceDelta.toFixed(2)}</span>
              ) : null}
            </label>
          ))}
        </OptionGroup>
      ))}
    </div>
  )
}

