type Listener = (payload: unknown) => void

const channels: Record<string, Set<Listener>> = {}

export function subscribe(channel: string, listener: Listener) {
  channels[channel] ||= new Set()
  channels[channel].add(listener)
  return () => channels[channel].delete(listener)
}

export function publish(channel: string, payload: unknown) {
  channels[channel]?.forEach((l) => l(payload))
}

export const ORDER_CHANNEL = 'orders'

