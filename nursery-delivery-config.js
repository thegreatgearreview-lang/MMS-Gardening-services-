/* MMS nursery delivery plan */
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
  weightBands: [
    { id: 'PF_0_5KG', maxWeightKg: 5, label: 'Up to 5kg' },
    { id: 'PF_5_10KG', maxWeightKg: 10, label: '5kg to 10kg' },
    { id: 'PF_10_20KG', maxWeightKg: 20, label: '10kg to 20kg' },
    { id: 'PF_20_30KG', maxWeightKg: 30, label: '20kg to 30kg' }
  ],
  categoryDefaults: {
    defaultPlant: 'PF_0_5KG',
    shrubs: 'PF_0_5KG',
    grasses: 'PF_0_5KG',
    roses: 'PF_0_5KG',
    trees: 'PF_5_10KG'
  },
  // Planning rules only. These are OFF from live checkout until packed
  // weights/dimensions, packaging tests and business-account rates are confirmed.
  customerParcelRules: {
    smallPlants: {
      deliveryClass: 'PF_0_5KG',
      parcelPricePence: 1250,
      maxPlantsPerParcel: 5,
      description: 'Up to 5 compatible small plants per £12.50 parcel'
    },
    bareRootHedging4to5ft: {
      deliveryClass: 'PF_0_5KG',
      parcelPricePence: 1750,
      maxPlantsPerParcel: 5,
      description: 'Up to 5 compatible 4–5ft bare-root hedging plants per £17.50 parcel'
    }
  },
  planningRetailReference: {
    service: 'express24',
    effectiveFrom: '2026-10-05',
    currency: 'GBP',
    ratesIncVat: {
      PF_0_5KG: 12.50,
      PF_5_10KG: 16.15,
      PF_10_20KG: 20.20,
      PF_20_30KG: 24.85
    },
    note: 'Planning reference only. Replace with MMS business-account rates before go-live.'
  },
  classes: {
    PLANT_2L: { description: 'Small established plant / 2L pot', packedWeightKg: null, packedLengthCm: null, packedWidthCm: null, packedHeightCm: null, plannedWeightBand: 'PF_0_5KG', status: 'measure-and-test' },
    PLANT_10_15L: { description: 'Shrub / grass / plant in 10–15L pot', packedWeightKg: null, packedLengthCm: null, packedWidthCm: null, packedHeightCm: null, plannedWeightBand: 'PF_0_5KG', status: 'measure-and-test' },
    PLANT_15_25L: { description: 'Larger shrub / tree / plant in 15–25L pot', packedWeightKg: null, packedLengthCm: null, packedWidthCm: null, packedHeightCm: null, plannedWeightBand: 'PF_5_10KG', status: 'measure-and-test' },
    BULKY_PLANT: { description: 'Tall / bulky plant requiring special packing', packedWeightKg: null, packedLengthCm: null, packedWidthCm: null, packedHeightCm: null, plannedWeightBand: 'PF_10_20KG', status: 'measure-and-test' },
    LOGS_OR_HEAVY: { description: 'Heavy/bulky nursery item', packedWeightKg: null, packedLengthCm: null, packedWidthCm: null, packedHeightCm: null, plannedWeightBand: 'PF_20_30KG', status: 'measure-and-test' }
  },
  products: {
    'Laurel 2ft': { page: 'laurel.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
    'Laurel 4ft': { page: 'laurel.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L', plannedWeightBand: 'PF_0_5KG' },
    'Laurel 5ft': { page: 'laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Privet 2ft': { page: 'privet.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
    'Privet 4ft': { page: 'privet.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L', plannedWeightBand: 'PF_0_5KG' },
    'Privet 5ft': { page: 'privet.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Portuguese Laurel 2ft': { page: 'portuguese-laurel.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
    'Portuguese Laurel 4ft': { page: 'portuguese-laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Portuguese Laurel 5ft': { page: 'portuguese-laurel.html', pot: '20–25L', deliveryClass: 'PLANT_15_25L', plannedWeightBand: 'PF_5_10KG' },
    'Carex Japanese Sedge': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
    'Black Mondo Grass': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
    'Carex Frosted Curls': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L', plannedWeightBand: 'PF_0_5KG' },
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
    doNotGoLiveUntilAccountRatesConfirmed: true,
    protectMarginWithDeliveryContingency: true,
    doNotAssumeFivePlantsFitEveryFiveKgClass: true,
    heavyOrBulkyPlantsUseSeparateRule: true
  }
};
