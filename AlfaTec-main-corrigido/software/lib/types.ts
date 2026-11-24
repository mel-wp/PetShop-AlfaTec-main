// Database Types for PetShop System

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  cpf: string | null
  created_at: string
  updated_at: string
  pets?: Pet[]
}

export interface Pet {
  id: string
  customer_id: string
  name: string
  species: 'dog' | 'cat'
  breed: string | null
  birth_date: string | null
  weight: number | null
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  created_at: string
}

export interface Appointment {
  id: string
  pet_id: string
  service_id: string
  scheduled_date: string
  scheduled_time: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes: string | null
  total_price: number
  created_at: string
  updated_at: string
  pet?: Pet
  service?: Service
}

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  sku: string | null
  barcode: string | null
  cost_price: number
  sale_price: number
  stock_quantity: number
  min_stock: number
  unit: string
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ProductCategory
}

export interface Sale {
  id: string
  customer_id: string | null
  user_id: string
  total_amount?: number
  total?: number
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'other'
  status: 'completed' | 'pending' | 'cancelled'
  notes: string | null
  created_at: string
  customer?: Customer
  items?: SaleItem[]
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product
}

export interface DashboardStats {
  totalCustomers: number
  totalPets: number
  totalProducts: number
  lowStockProducts: number
  todayAppointments: number
  todayRevenue: number
}
