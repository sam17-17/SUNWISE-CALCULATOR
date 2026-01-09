
export type UserRole = 'CEO' | 'COO' | 'Accountant' | 'Engineer' | 'Marketing' | 'Sales' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string; // Only used for internal auth simulation
  avatar?: string;
}

export interface UserInput {
  // Client Info
  clientName: string;
  clientContact: string;
  clientAddress: string;

  monthlyBill: number;
  electricityRate: number; // KES per kWh
  roofArea: number; // sq meters
  location: string;
  sunlightHours: number;
  panelEfficiency: number;
  
  // Component Sizes
  panelWattage: number; // Watts per panel
  batteryCapacity: number; // kWh per battery
  batterySizeDescription?: string; // e.g. "100Ah x 50V"
  inverterCapacity: number; // kW per inverter
  
  // Pricing & Expenses
  panelPricePerUnit: number;
  batteryPricePerUnit: number;
  inverterPrice: number;
  
  // Labor & Logistics Module
  installationLaborCost: number;
  mountingHardwareCostPerPanel: number;
  cablingAndProtectionCost: number;
  transportAndLogisticsCost: number;

  // Business Margins (Admin/Accountant only)
  markupPercentage: number;
}

export interface Component {
  name: string;
  size: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  estimatedCost: number;
  imageUrl?: string;
}

export interface SolarResult {
  dailyEnergyTargetKwh: number;
  systemSizeKw: number;
  annualProductionKwh: number;
  estimatedTotalCost: number;
  estimatedRetailPrice: number;
  projectedProfit: number;
  monthlySavings: number;
  paybackYears: number;
  carbonOffsetTons: number;
  components: Component[];
  panelCount: number;
}

export interface AIAdvice {
  summary: string;
  panelTypeRecommendation: string;
  maintenanceTips: string[];
  financialInsights: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  interval: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  icon: string;
  lastDone?: Date;
  reminderDate?: string;
}
