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
    preferred: 'royal-mail-tracked-24',
    heavyBulkyFallback: 'parcelforce-express24',
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
  classes: {
    PLANT_2L: {
      description: 'Small established plant / 2L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      status: 'measure-and-test'
    },
    PLANT_10_15L: {
      description: 'Medium plant / 10–15L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      status: 'measure-and-test'
    },
    PLANT_15_25L: {
      description: 'Large plant / 15–25L pot',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      status: 'measure-and-test'
    },
    BULKY_PLANT: {
      description: 'Tall / bulky plant requiring special packing or local delivery',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      status: 'measure-and-test'
    },
    LOGS_OR_HEAVY: {
      description: 'Heavy/bulky nursery item',
      packedWeightKg: null,
      packedLengthCm: null,
      packedWidthCm: null,
      packedHeightCm: null,
      status: 'measure-and-test'
    }
  },

  // Product mapping is deliberately kept separate from prices.
  // The basket can use this mapping to flag any unmapped product before go-live.
  products: {
    'Laurel 2ft': { page: 'laurel.html', pot: '2L', deliveryClass: 'PLANT_2L' },
    'Laurel 4ft': { page: 'laurel.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L' },
    'Laurel 5ft': { page: 'laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L' },
    'Privet 2ft': { page: 'privet.html', pot: '2L', deliveryClass: 'PLANT_2L' },
    'Privet 4ft': { page: 'privet.html', pot: '10–15L', deliveryClass: 'PLANT_10_15L' },
    'Privet 5ft': { page: 'privet.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L' },
    'Portuguese Laurel 2ft': { page: 'portuguese-laurel.html', pot: '2L', deliveryClass: 'PLANT_2L' },
    'Portuguese Laurel 4ft': { page: 'portuguese-laurel.html', pot: '15–25L', deliveryClass: 'PLANT_15_25L' },
    'Portuguese Laurel 5ft': { page: 'portuguese-laurel.html', pot: '20–25L', deliveryClass: 'PLANT_15_25L' },
    'Carex Japanese Sedge': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L' },
    'Black Mondo Grass': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L' },
    'Carex Frosted Curls': { page: 'grasses.html', pot: '2L', deliveryClass: 'PLANT_2L' }
  },

  // Deliberately blank until MMS has the actual packed measurements and account quote.
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
