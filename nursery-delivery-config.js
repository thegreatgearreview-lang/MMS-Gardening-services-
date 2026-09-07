/*
 * MMS NURSERY DELIVERY PLAN
 *
 * Single source of truth for future nursery delivery pricing.
 * This remains OFF until MMS has confirmed packed weights/dimensions and
 * received the final carrier/account rates.
 *
 * IMPORTANT: Never price postage from plant height or pot volume alone.
 * We need the ACTUAL packed parcel weight + dimensions for each class.
 */
window.MMS_NURSERY_DELIVERY = {
  live: false,
  currency: 'GBP',
  market: 'UK-mainland',
  targetDeliveryHours: 48,

  carrier: {
    preferred: 'parcelforce-express24',
    heavyBulkyFallback: 'parcelforce-express48large',
    excluded: ['evri', 'dpd', 'dhl'],
    status: 'account-and-quote-required'
  },

  collection: {
    preferred: 'scheduled-business-collection',
    weekdayPreferred: true,
    launchDay: 'Friday',
    clickAndDropFallbackChargePencePerItem: 30,
    businessCollectionChargePence: null,
    royalMailBusinessFreeCollectionThresholdPencePerYear: 2000000,
    parcelforceFreeCollectionThresholdItemsPerYear: 750,
    status: 'confirm-business-account-terms'
  },

  account: {
    type: 'business-parcels-account',
    creditBilling: true,
    paymentFrequency: 'confirm-with-account',
    status: 'not-open-yet'
  },

  // INTERNAL delivery classes, not customer-facing postage prices.
  // Planning weight bands only; actual account rates replace them later.
  weightBands: [
    { id: 'PF_0_5KG', maxWeightKg: 5, label: 'Up to 5kg' },
    { id: 'PF_5_10KG', maxWeightKg: 10, label: '5kg to 10kg' },
    { id: 'PF_10_20KG', maxWeightKg: 20, label: '10kg to 20kg' },
    { id: 'PF_20_30KG', maxWeightKg: 30, label: '20kg to 30kg' }
  ],

  // Current planning defaults requested for MMS.
  // These are weight-band assignments, not live postage prices.
  categoryDefaults: {
    defaultPlant: 'PF_0_5KG',
    shrubs: 'PF_5_10KG',
    grasses: 'PF_5_10KG',
    trees: 'PF_5_10KG'
  },

  // Public Parcelforce retail guide reference effective 5 October 2026.
  // These are NOT live MMS customer prices and are NOT assumed to be the future
  // business-account rates. They give us the correct band structure now.
  planningRetailReference: {
    service: 'express24',
    effectiveFrom: '2026-10-05',
    currency: 'GBP',
    ratesIncVat: {
      'PF_0_5KG': 12.50,
      'PF_5_10KG': 16.15,
      'PF_10_20KG': 20.20,
      'PF_20_30KG': 24.85
    },
    note: 'Planning reference only. Replace with MMS business-account rates before go-live.'
  },

  classes: {
    PLANT_2L: {
      description: 'Small established plant / 2L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      plannedWeightBand: 'PF_0_5KG',
      status: 'measure-and-test'
    },
    PLANT_10_15L: {
      description: 'Shrub / grass / plant in 10–15L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      plannedWeightBand: 'PF_5_10KG',
      status: 'measure-and-test'
    },
    PLANT_15_25L: {
      description: 'Larger shrub / tree / plant in 15–25L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      plannedWeightBand: 'PF_5_10KG',
      status: 'measure-and-test'
    },
    BULKY_PLANT: {
      description: 'Tall / bulky plant requiring special packing',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      plannedWeightBand: 'PF_10_20KG',
      status: 'measure-and-test'
    },
    LOGS_OR_HEAVY: {
      description: 'Heavy/bulky nursery item',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      plannedWeightBand: 'PF_20_30KG',
      status: 'measure-and-test'
    }
  },

  products: {
    'Laurel 2ft': { page: 'laurel.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Laurel 4ft': { page: 'laurel.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L', plannedWeightBand: 'PF_5_10KG' },
    'Laurel 5ft': { page: 'laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Privet 2ft': { page: 'privet.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Privet 4ft': { page: 'privet.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L', plannedWeightBand: 'PF_5_10KG' },
    'Privet 5ft': { page: 'privet.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Portuguese Laurel 2ft': { page: 'portuguese-laurel.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Portuguese Laurel 4ft': { page: 'portuguese-laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Portuguese Laurel 5ft': { page: 'portuguese-laurel.html', pot: '20–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Carex Japanese Sedge': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Black Mondo Grass': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Carex Frosted Curls': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' },
    'Brown Turkey Fig Tree': { page: 'trees.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_5_10KG' }
  },

  carrierRates: {},
  postcodeSurcharges: {},
  packingCostPence: null,
  safetyMarginPence: null,

  rules: {
    calculateFromPackedParcel: true,
    combineCompatibleItemsWherePossible: true,
    neverUnderchargeKnownCarrierCost: true,
    keepPostageSeparateFromPlantPrice: true,
    showPostageBeforePayment: true,
    requireCustomerAddressBeforeFinalPostage: true,
    maximumCustomerDeliveryWindowHours: 48,
    recheckCarrierRatesBeforeGoLive: true,
    doNotGoLiveUntilAllProductsMapped: true,
    doNotGoLiveUntilAllDeliveryClassesMeasured: true,
    doNotGoLiveUntilAccountRatesConfirmed: true
  }
};
