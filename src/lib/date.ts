export function formatDate(d: Date | string, locale = 'pt-BR') {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: undefined }).format(date)
}

export function formatDateTime(d: Date | string, locale = 'pt-BR') {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function inBusinessHours(now: Date, open: string, close: string): boolean {
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  const start = new Date(now)
  start.setHours(oh, om, 0, 0)
  const end = new Date(now)
  end.setHours(ch, cm, 0, 0)
  return now >= start && now <= end
}

