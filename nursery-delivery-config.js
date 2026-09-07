/*
 * MMS NURSERY DELIVERY PLAN
 *
 * This file is deliberately NOT loaded by the live basket yet.
 * It is the single source of truth we can wire into basket-quantity.js
 * once the physical packed weights/dimensions and final carrier are confirmed.
 *
 * IMPORTANT: Never price postage from plant height or pot volume alone.
 * We need the ACTUAL packed parcel weight + dimensions for each delivery class.
 */
window.MMS_NURSERY_DELIVERY = {
  live: false,
  currency: 'GBP',
  market: 'UK-mainland',

  // Royal Mail explicitly supports plants, seeds and bulbs in its gardening/DIY
  // delivery guidance. Current public online prices are only benchmarks;
  // business/account rates must be confirmed before publishing checkout prices.
  preferredCarrier: 'royal-mail',
  alternativeCarriers: ['royal-mail-business', 'local-courier'],
  evriStatus: 'not-preferred-for-plants',

  // These are INTERNAL delivery classes, not customer-facing postage prices.
  // Each class stays blocked until packed measurements have been recorded.
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

  // Current plant data audit. Product pages should reference one of the
  // internal classes above; no postage price is assigned here yet.
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

  // These are deliberately blank until the physical packing test is done.
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
    recheckCarrierRatesBeforeGoLive: true
  }
};
