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
  category_id: string | null
  name: string
  description: string | null
  sku: string | null
  barcode: string | null
  cost_price: number
  sale_price: number
  stock_quantity: number
  min_stock: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ProductCategory
}

export interface Sale {
  id: string
  customer_id: string | null
  total_amount: number
  discount_amount: number
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'other'
  status: 'pending' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  customer?: Customer
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string | null
  service_id: string | null
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
  service?: Service
}

export interface AccountPayable {
  id: string
  description: string
  supplier: string | null
  amount: number
  due_date: string
  paid_date: string | null
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  category: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AccountReceivable {
  id: string
  customer_id: string | null
  description: string
  amount: number
  due_date: string
  received_date: string | null
  status: 'pending' | 'received' | 'overdue' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer
}

export interface CashFlow {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  reference_type: 'sale' | 'account_payable' | 'account_receivable' | 'manual' | null
  reference_id: string | null
  created_at: string
}

// Dashboard Stats
export interface DashboardStats {
  todayAppointments: number
  todayRevenue: number
  lowStockProducts: number
  pendingPayables: number
  monthlyRevenue: number
  monthlyExpenses: number
  totalCustomers: number
  totalPets: number
}
