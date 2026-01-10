
import { UserInput, SolarResult, Component } from '../types';

export const getEstimatedSunlight = (latitude: number): number => {
  const absLat = Math.abs(latitude);
  if (absLat < 5) return 5.8;
  if (absLat < 15) return 5.4;
  if (absLat < 25) return 5.0;
  if (absLat < 35) return 4.6;
  return 4.2;
};

export const calculateSolarPotential = (input: UserInput): SolarResult => {
  const { 
    monthlyBill = 0, 
    electricityRate = 1, 
    sunlightHours = 4.5,
    panelWattage = 400,
    batteryCapacity = 5,
    batterySizeDescription = '',
    inverterCapacity = 5,
    panelPricePerUnit = 0,
    batteryPricePerUnit = 0,
    inverterPrice = 0,
    installationLaborCost = 0,
    mountingHardwareCostPerPanel = 0,
    cablingAndProtectionCost = 0,
    transportAndLogisticsCost = 0,
    markupPercentage = 15
  } = input;
  
  const safeRate = electricityRate > 0 ? electricityRate : 1;
  const safeSun = sunlightHours > 0 ? sunlightHours : 4.5;
  const safePanelWattage = panelWattage > 0 ? panelWattage : 400;
  const safeInverterCap = inverterCapacity > 0 ? inverterCapacity : 5;
  const safeBatteryCap = batteryCapacity > 0 ? batteryCapacity : 5;

  const monthlyKwh = monthlyBill / safeRate;
  const dailyKwh = monthlyKwh / 30;
  const designSafetyFactor = 1.2;
  const dailyEnergyTarget = dailyKwh * designSafetyFactor;

  const efficiencyLossFactor = 0.8;
  const requiredSystemSizeKw = dailyEnergyTarget / (safeSun * efficiencyLossFactor);

  const panelCount = Math.ceil((requiredSystemSizeKw * 1000) / safePanelWattage);
  const actualSystemSizeKw = (panelCount * safePanelWattage) / 1000;
  const batteryCount = Math.ceil(dailyEnergyTarget / safeBatteryCap);
  const inverterCount = Math.ceil(actualSystemSizeKw / safeInverterCap);

  const annualProduction = actualSystemSizeKw * safeSun * 365 * efficiencyLossFactor;

  const components: Component[] = [
    {
      name: 'Solar Panels',
      size: `${safePanelWattage}W`,
      quantity: panelCount,
      unit: 'Units',
      unitPrice: panelPricePerUnit,
      estimatedCost: panelCount * panelPricePerUnit
    },
    {
      name: 'Battery Storage',
      size: batterySizeDescription || `${safeBatteryCap}kWh`,
      quantity: batteryCount,
      unit: 'Units',
      unitPrice: batteryPricePerUnit,
      estimatedCost: batteryCount * batteryPricePerUnit
    },
    {
      name: 'Hybrid Inverter',
      size: `${safeInverterCap}kW`,
      quantity: inverterCount,
      unit: 'Units',
      unitPrice: inverterPrice,
      estimatedCost: inverterCount * inverterPrice
    },
    {
      name: 'Mounting Structure',
      size: 'Aluminium/Steel',
      quantity: panelCount,
      unit: 'Units',
      unitPrice: mountingHardwareCostPerPanel,
      estimatedCost: panelCount * mountingHardwareCostPerPanel
    },
    {
      name: 'Cabling & Protection',
      size: 'DC/AC Kits',
      quantity: 1,
      unit: 'Lot',
      unitPrice: cablingAndProtectionCost,
      estimatedCost: cablingAndProtectionCost
    },
    {
      name: 'Labor & Installation',
      size: 'Expert Team',
      quantity: 1,
      unit: 'Service',
      unitPrice: installationLaborCost,
      estimatedCost: installationLaborCost
    },
    {
      name: 'Transport & Logistics',
      size: 'Site Delivery',
      quantity: 1,
      unit: 'Lot',
      unitPrice: transportAndLogisticsCost,
      estimatedCost: transportAndLogisticsCost
    }
  ];

  const estimatedTotalCost = components.reduce((sum, c) => sum + c.estimatedCost, 0);
  const retailPrice = estimatedTotalCost * (1 + (markupPercentage / 100));
  const profit = retailPrice - estimatedTotalCost;

  const monthlySavingsValue = monthlyKwh * safeRate;
  const annualSavings = monthlySavingsValue * 12;
  const paybackYears = annualSavings > 0 ? retailPrice / annualSavings : 0;
  const carbonOffsetTons = (annualProduction * 0.4) / 1000;

  return {
    dailyEnergyTargetKwh: Number(dailyEnergyTarget.toFixed(2)),
    systemSizeKw: Number(actualSystemSizeKw.toFixed(2)),
    annualProductionKwh: Math.round(annualProduction),
    estimatedTotalCost: Math.round(estimatedTotalCost),
    estimatedRetailPrice: Math.round(retailPrice),
    projectedProfit: Math.round(profit),
    monthlySavings: Math.round(monthlySavingsValue),
    paybackYears: Number(paybackYears.toFixed(1)),
    carbonOffsetTons: Number(carbonOffsetTons.toFixed(2)),
    components,
    panelCount
  };
};
