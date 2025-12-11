export enum UserRole {
  ADMIN = 'Admin/Management',
  ACCOUNTS = 'Accounts Officer',
  SALES = 'Sales Rep',
  WAREHOUSE = 'Warehouse Manager',
  DRIVER = 'Logistics/Driver',
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  quantity: number;
  minLevel: number;
  unitCost: number;
  sellingPrice: number;
  profit?: number; // Calculated: SellingPrice - UnitCost
  stockValue?: number; // Calculated: Quantity * UnitCost
  lowStockFlag?: number; // Calculated: IF(Quantity < MinLevel, 1, 0)
  supplier: string;
  lastMovement: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Overdue';
}

export interface SalesOrder {
  id: string;
  clientName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'SO' | 'DO' | 'Invoiced' | 'Delivered';
  signature?: string; // Data URL for signature
  date: string;
}

export interface DeliveryRoute {
  id: string;
  address: string;
  clientName: string;
  lat: number;
  lng: number;
  status: 'Pending' | 'In Transit' | 'Delivered';
  orderId: string;
}

export interface CashFlowData {
  month: string;
  revenue: number;
  expenses: number;
}
