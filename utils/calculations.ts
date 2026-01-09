
import { UserInput, SolarResult, Component } from '../types';

/**
 * Estimates peak sunlight hours based on latitude for solar potential calculations.
 * Regions near the equator (like Kenya) typically average higher peak sun hours.
 */
export const getEstimatedSunlight = (latitude: number): number => {
  const absLat = Math.abs(latitude);
  // Kenya latitude range is approx -4 to +4
  if (absLat < 5) return 5.8;
  if (absLat < 15) return 5.4;
  if (absLat < 25) return 5.0;
  if (absLat < 35) return 4.6;
  return 4.2;
};

export const calculateSolarPotential = (input: UserInput): SolarResult => {
  const { 
    monthlyBill, 
    electricityRate, 
    sunlightHours,
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
    transportAndLogisticsCost = 0
  } = input;
  
  const monthlyKwh = monthlyBill / (electricityRate || 1);
  const dailyKwh = monthlyKwh / 30;
  const designSafetyFactor = 1.2;
  const dailyEnergyTarget = dailyKwh * designSafetyFactor;

  const efficiencyLossFactor = 0.8;
  const sunHrs = sunlightHours || 4.5;
  const requiredSystemSizeKw = dailyEnergyTarget / (sunHrs * efficiencyLossFactor);

  const panelCount = Math.ceil((requiredSystemSizeKw * 1000) / panelWattage);
  const actualSystemSizeKw = (panelCount * panelWattage) / 1000;
  const batteryCount = Math.ceil(dailyEnergyTarget / batteryCapacity);
  const inverterCount = Math.ceil(actualSystemSizeKw / inverterCapacity);

  const annualProduction = actualSystemSizeKw * sunHrs * 365 * efficiencyLossFactor;

  const components: Component[] = [
    {
      name: 'Solar Panels',
      size: `${panelWattage}W`,
      quantity: panelCount,
      unit: 'Units',
      unitPrice: panelPricePerUnit,
      estimatedCost: panelCount * panelPricePerUnit
    },
    {
      name: 'Battery Storage',
      size: batterySizeDescription || `${batteryCapacity}kWh`,
      quantity: batteryCount,
      unit: 'Units',
      unitPrice: batteryPricePerUnit,
      estimatedCost: batteryCount * batteryPricePerUnit
    },
    {
      name: 'Hybrid Inverter',
      size: `${inverterCapacity}kW`,
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

  const monthlySavings = monthlyKwh * electricityRate;
  const paybackYears = monthlySavings > 0 ? estimatedTotalCost / (monthlySavings * 12) : 0;
  const carbonOffsetTons = (annualProduction * 0.4) / 1000;

  return {
    dailyEnergyTargetKwh: Number(dailyEnergyTarget.toFixed(2)),
    systemSizeKw: Number(actualSystemSizeKw.toFixed(2)),
    annualProductionKwh: Math.round(annualProduction),
    estimatedTotalCost: Math.round(estimatedTotalCost),
    monthlySavings: Math.round(monthlySavings),
    paybackYears: Number(paybackYears.toFixed(1)),
    carbonOffsetTons: Number(carbonOffsetTons.toFixed(2)),
    components,
    panelCount
  };
};
