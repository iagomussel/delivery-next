import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function HoursSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Horários</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Horários de funcionamento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Map weekdays */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Segunda</label>
            <div className="flex gap-2">
              <Input placeholder="08:00" />
              <Input placeholder="22:00" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Terça</label>
            <div className="flex gap-2">
              <Input placeholder="08:00" />
              <Input placeholder="22:00" />
            </div>
          </div>
          <Button className="col-span-full mt-2">Salvar</Button>
        </CardContent>
      </Card>
    </div>
  )
}

