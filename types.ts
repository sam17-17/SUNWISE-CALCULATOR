
export type UserRole = 'CEO' | 'COO' | 'Accountant' | 'Engineer' | 'Marketing' | 'Sales' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string; // Changed from email
  pin?: string;     // Changed from password (numerical/text pin)
  avatar?: string;
}

export interface UserInput {
  clientName: string;
  clientContact: string;
  clientAddress: string;
  monthlyBill: number;
  electricityRate: number;
  roofArea: number;
  location: string;
  sunlightHours: number;
  panelEfficiency: number;
  panelWattage: number;
  batteryCapacity: number;
  batterySizeDescription?: string;
  inverterCapacity: number;
  panelPricePerUnit: number;
  batteryPricePerUnit: number;
  inverterPrice: number;
  installationLaborCost: number;
  mountingHardwareCostPerPanel: number;
  cablingAndProtectionCost: number;
  transportAndLogisticsCost: number;
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
