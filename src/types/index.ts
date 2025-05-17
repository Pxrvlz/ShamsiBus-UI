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
  busModelName: string // Added busModelName
  capacity: number
  driver: string
  status?: 'active' | 'maintenance' | 'inactive'
  wifi: boolean
  vipSeats: boolean
  powerOutlets: boolean
  entertainmentSystem: boolean
  snacks: boolean
  blanket: boolean
  pillow: boolean
  restroom: boolean
}

export interface User {
  id: number
  username: string
  role: 'admin' | 'operator'
  lastLogin: string
  firstName: string
  lastName: string
  nationalCode: string
  employeeId: string
  email: string
}
