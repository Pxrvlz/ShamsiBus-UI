export interface Trip {
  id: number
  origin: string
  destination: string
  departureTime: string
  status: 'on_time' | 'delayed' | 'canceled'
  busId: number
  busInfo: string
  intermediateStops: string[]
  driver: string
}

export interface Bus {
  id: number
  licensePlate: string
  capacity: number
  driver: string
  status?: 'active' | 'maintenance' | 'inactive'
}

export interface User {
  id: number
  username: string
  role: 'admin' | 'operator'
  lastLogin: string
}
