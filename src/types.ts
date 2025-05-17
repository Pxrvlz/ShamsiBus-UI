export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  employeeId: string;
  email: string;
  role: 'admin' | 'operator';
  // createdAt removed as requested
}

export interface Bus {
  id: number;
  licensePlate: string;
  busModelName: string; // Added busModelName
  capacity: number;
  driver: string;
  status: 'active' | 'maintenance' | 'inactive';
  // Optional features removed as requested
}

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  departureTime: string; // Consider using a Date type and handling formatting
  status: 'on_time' | 'delayed' | 'canceled';
  busId: number;
  busInfo: string; // License plate + capacity/driver info
  intermediateStops: string[]; // Array of city names
  driver: string; // Driver name from selected bus
}
