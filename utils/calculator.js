export default (function() {

  var global = typeof self !== "undefined" && self != null && self.self === self && self
    || typeof global !== "undefined" && global != null && global.global === global && global
    || window;

  var normalizePrice = function(amount) {
    return parseFloat(parseFloat(amount).toFixed(2));
  };

  var pluralize = function(word, number) {
    return typeof number && (number).toString().substr(-1) === "1" ? word : word + "s";
  };

  var PROVIDE_SAMPLES_PRICE = 5;
  var PROGRESSIVE_DELIVERY_PERCENT = 10;
  var USED_SOURCES_MIN_PRICE = 14.95;
  var USED_SOURCES_PRICE_RATE = 0.1;
  var COUPONS_TYPES_IDS = {
    PERCENT: 1,
    FREE_UNIT: 5,
    CATEGORY_OF_WRITER: 7
  };
  var COMPLEX_ASSIGNMENT_PERCENT = 20;
  var SERVICES_IDS = {
    "WRITING_PAGES":        1,
    "WRITING_SLIDES":       2,
    "WRITING_CHARTS":       30,
    "CHOOSE_WRITER":        3,
    "PROVIDE_ME_SAMPLES":   4,
    "PROGRESSIVE_DELIVERY": 5,
    "DISCOUNT":             6,
    "USED_SOURCES":         21,
    "COMPLEX_ASSIGNMENT":   37,
    "COUPON_WRT_PAGES":     10
  };

  // for new architecture
  // ===============================================

  // var SERVICE_LIMIT = 5 // can get from API

  // var NEW_PRICE_PER_PAGE = 40 // can get from API

  var getPricePerServicePage = function(service, serviceValue, serviceLimit) {
    if (serviceValue > serviceLimit) {
      switch(service) {
        case 'pages': return NEW_PRICE_PER_PAGE
      }
    }
    return 0
  }

  // ===============================================

  /**
   * Calculate Raw Base Cost
   * @param {FormState} formState
   * @param {CostInfo} cost
   */
  var calculateBase = function(insertData, cost) {

    console.log(insertData.additionalServices)

    var formState = insertData.formState

    var additionalServices = insertData.additionalServices

    var basePagesCost = 0;
    var additionalPagesCost = 0;
    
    (function() {
      var spacing_factor = (formState.spacing == "single") ? 2 : 1;
      var pagesPrice = additionalServices.deadlinePricePerPage  // getPricePerServicePage('pages', additionalServices.pages + formState.pages, SERVICE_LIMIT) ||  to begin of if
      if (formState.pages && pagesPrice) {
        basePagesCost = normalizePrice(formState.deadlinePricePerPage * formState.pages * spacing_factor);
        additionalPagesCost = ((formState.pages + additionalServices.pages) * pagesPrice) - basePagesCost;
      }
    })();

    // slides, charts similarly

    cost.basePagesCost = basePagesCost || 0;
    cost.additionalPagesCost = additionalPagesCost > 0 ? additionalPagesCost : 0;
    cost.baseCost = normalizePrice(cost.basePagesCost);
    cost.additionalCost = normalizePrice(cost.additionalPagesCost);
    cost.allBaseCost = normalizePrice((cost.basePagesCost + cost.additionalPagesCost));
  };

  /**
   * Calculate Coupon for pages
   * @param {FormState} formState
   * @param {CostInfo} cost
   */
  var calculateBaseCoupons = function(insertData, cost) {
    var baseCouponPagesReduction = 0;
    var additionalCouponPagesReduction = 0;
    var couponPagesQuantity = 0;
    var formState = insertData.formState;
      var spacing_factor = (formState.spacing == "single") ? 2 : 1;
      for (var i = 0; i < formState.winbackCoupons.length; i++) {
        var coupon = formState.winbackCoupons[i];
        if (coupon.type_id === COUPONS_TYPES_IDS.FREE_UNIT) {
          if (coupon["service_type_id"] == SERVICES_IDS.WRITING_PAGES) {
            baseCouponPagesReduction = normalizePrice(formState.deadlinePricePerPage * coupon.quantity * spacing_factor); 
            additionalCouponPagesReduction = normalizePrice(insertData.additionalServices.deadlinePricePerPage * coupon.quantity * spacing_factor); // getPricePerServicePage('coupons', couponValue, SERVICE_LIMIT) || deadlinePricePerPage to begin of if
            couponPagesQuantity = coupon.quantity;
            break;
          }
          break;
        }
      }
    cost.baseCouponPagesReduction = normalizePrice(baseCouponPagesReduction);
    cost.additionalCouponPagesReduction = normalizePrice(additionalCouponPagesReduction);
    cost.couponPagesQuantity  = couponPagesQuantity;
    cost.baseCouponsReduction = normalizePrice(baseCouponPagesReduction);
    cost.additionalCouponsReduction = normalizePrice(additionalCouponPagesReduction);
  };

  /**
   * Calculate Raw Secondary Cost
   * @param {FormState} formState
   * @param {CostInfo} cost
   */
  var calculateSecondary = function(insertData, cost) {

    var formState = insertData.formState;

    var additionalServices = insertData.additionalServices;

    // base calculating ==========================

      var baseCostWithCoupons = cost.baseCost - cost.baseCouponsReduction;

      // Calculate Get Samples Cost
      var secondaryGetSamplesCost = formState.getSamplesOn == true ? PROVIDE_SAMPLES_PRICE : 0;

      // Calculate Progressive Delivery Price & Cost & availability;
      var pdDisabled =
          (cost.baseCost < 200 || formState.deadlineHrs < 120) && "Available for orders with a deadline of 5 days and longer, and with the value of $200 and more.";
      var pdForced =
          (cost.baseCost > 600 && formState.deadlineHrs >= 168) && "Mandatory for 7 days and longer, with the value of $600 and more.";

      var secondaryProgressiveDeliveryPrice = pdDisabled ? 0 : normalizePrice(baseCostWithCoupons * PROGRESSIVE_DELIVERY_PERCENT / 100);
      var secondaryProgressiveDeliveryCost = (pdForced || formState.getProgressiveDeliveryOn) ? secondaryProgressiveDeliveryPrice : 0;

      // Calculate Writer Category Cost
      var secondaryWriterCategoryCost = normalizePrice(baseCostWithCoupons * formState.writerPercent / 100);

      // Calculate Used Sourse Price & Cost
      var secondaryUsedSourcesPrice =  normalizePrice(
          Math.max(USED_SOURCES_MIN_PRICE, baseCostWithCoupons * USED_SOURCES_PRICE_RATE)
      );
      var secondaryUsedSourcesCost = formState.getUsedSourcesOn ? secondaryUsedSourcesPrice : 0;

      // Calculate Complex Assignment Price & Cost
      var secondaryComplexAssignmentPrice = normalizePrice(
          Math.max((baseCostWithCoupons * COMPLEX_ASSIGNMENT_PERCENT) / 100)
      );
      var secondaryComplexAssignmentCost = formState.complexAssignmentDiscipline ? secondaryComplexAssignmentPrice : 0;

      cost.secondaryGetSamplesPrice = PROVIDE_SAMPLES_PRICE;
      cost.secondaryGetSamplesCost = secondaryGetSamplesCost;
      cost.secondaryProgressiveDeliveryPrice = secondaryProgressiveDeliveryPrice;
      cost.secondaryProgressiveDeliveryPercent = PROGRESSIVE_DELIVERY_PERCENT;
      cost.secondaryProgressiveDeliveryCost = secondaryProgressiveDeliveryCost;
      cost.pdDisabled = pdDisabled;
      cost.pdForced = pdForced;
      cost.secondaryWriterCategoryCost = secondaryWriterCategoryCost;
      cost.secondaryUsedSourcesPrice = secondaryUsedSourcesPrice;
      cost.secondaryUsedSourcesCost = secondaryUsedSourcesCost;
      cost.secondaryComplexAssignmentPrice = secondaryComplexAssignmentPrice;
      cost.secondaryComplexAssignmentCost = secondaryComplexAssignmentCost;
      cost.secondaryCost = normalizePrice(
          secondaryUsedSourcesCost + secondaryGetSamplesCost +
          secondaryProgressiveDeliveryCost + secondaryWriterCategoryCost +
          secondaryComplexAssignmentCost
      );

    
    // additional calculating ==========================

      var additionalCostWithCoupons = cost.allBaseCost - cost.additionalCouponsReduction;

      var additionalSecondaryGetSamplesCost = additionalServices.getSamplesOn == true ? PROVIDE_SAMPLES_PRICE : 0;

      var additionalPdDisabled =
          (cost.allBaseCost < 200 || additionalServices.deadlineHrs < 120) && "Available for orders with a deadline of 5 days and longer, and with the value of $200 and more.";
      var additionalPdForced =
          (cost.allBaseCost > 600 && additionalServices.deadlineHrs >= 168) && "Mandatory for 7 days and longer, with the value of $600 and more.";
      
      var additionalSecondaryProgressiveDeliveryPrice = additionalPdDisabled ? 0 : normalizePrice(additionalCostWithCoupons * PROGRESSIVE_DELIVERY_PERCENT / 100);
      var additionalSecondaryProgressiveDeliveryCost = (additionalPdForced || additionalServices.getProgressiveDeliveryOn) ? additionalSecondaryProgressiveDeliveryPrice : 0;

      var additionalSecondaryWriterCategoryCost = normalizePrice(additionalCostWithCoupons * additionalServices.writerPercent / 100);

      var additionalSecondaryUsedSourcesPrice =  normalizePrice(
          Math.max(USED_SOURCES_MIN_PRICE, additionalCostWithCoupons * USED_SOURCES_PRICE_RATE)
      );

      var additionalSecondaryUsedSourcesCost = additionalServices.getUsedSourcesOn ? additionalSecondaryUsedSourcesPrice : 0;

      var additionalSecondaryComplexAssignmentPrice = normalizePrice(
          Math.max((additionalCostWithCoupons * COMPLEX_ASSIGNMENT_PERCENT) / 100)
      );

      var additionalSecondaryComplexAssignmentCost = formState.complexAssignmentDiscipline ? additionalSecondaryComplexAssignmentPrice : 0;

      cost.additionalSecondary = {}

      cost.additionalSecondary.secondaryGetSamplesCost = additionalSecondaryGetSamplesCost;
      cost.additionalSecondary.secondaryProgressiveDeliveryPrice = additionalSecondaryProgressiveDeliveryPrice;
      cost.additionalSecondary.secondaryProgressiveDeliveryCost = additionalSecondaryProgressiveDeliveryCost;
      cost.additionalSecondary.pdDisabled = additionalPdDisabled;
      cost.additionalSecondary.pdForced = additionalPdForced;
      cost.additionalSecondary.secondaryWriterCategoryCost = additionalSecondaryWriterCategoryCost;
      cost.additionalSecondary.secondaryUsedSourcesPrice = additionalSecondaryUsedSourcesPrice;
      cost.additionalSecondary.secondaryUsedSourcesCost = additionalSecondaryUsedSourcesCost;
      cost.additionalSecondary.secondaryComplexAssignmentPrice = additionalSecondaryComplexAssignmentPrice;
      cost.additionalSecondary.secondaryComplexAssignmentCost = additionalSecondaryComplexAssignmentCost;
      cost.additionalSecondary.secondaryCost = normalizePrice(
        additionalSecondaryUsedSourcesCost + additionalSecondaryGetSamplesCost +
        additionalSecondaryProgressiveDeliveryCost + additionalSecondaryWriterCategoryCost +
        additionalSecondaryComplexAssignmentCost
      );

  };

  /**
   * @param {FormState} formState
   * @param {CostInfo} cost
   */
  var calculateCoupons = function(insertData, cost) {

    var formState = insertData.formState

    var additionalServices = insertData.additionalServices

    var couponGetSamplesReduction = 0.0;
    var couponWriterCategoryReduction = 0.0;
    var couponUsedSourcesReduction = 0.0;
    var couponProgressiveDeliveryReduction = 0.0;

    var additionalCouponGetSamplesReduction = 0.0;
    var additionalCouponWriterCategoryReduction = 0.0;
    var additionalCouponUsedSourcesReduction = 0.0;
    var additionalCouponProgressiveDeliveryReduction = 0.0;


    for (var i = 0; i < formState.winbackCoupons.length; i++) {
      var coupon = formState.winbackCoupons[i];
      if (coupon.type_id === COUPONS_TYPES_IDS.PERCENT) {
        switch (coupon["service_type_id"]) {
          case SERVICES_IDS.PROVIDE_ME_SAMPLES:
            couponGetSamplesReduction += normalizePrice(cost.secondaryGetSamplesCost / 100 * coupon.value);
            additionalCouponGetSamplesReduction += normalizePrice(cost.additionalSecondary.secondaryGetSamplesCost / 100 * coupon.value);
            break;

          case SERVICES_IDS.PROGRESSIVE_DELIVERY:
            couponProgressiveDeliveryReduction += normalizePrice(cost.secondaryProgressiveDeliveryCost / 100 * coupon.value);
            additionalCouponProgressiveDeliveryReduction += normalizePrice(cost.additionalSecondary.secondaryProgressiveDeliveryCost / 100 * coupon.value);
            break;

          case SERVICES_IDS.USED_SOURCES:
            couponUsedSourcesReduction += normalizePrice(cost.secondaryUsedSourcesCost / 100 * coupon.value);
            additionalCouponUsedSourcesReduction += normalizePrice(cost.additionalSecondary.secondaryUsedSourcesCost / 100 * coupon.value);
            break;
        }
      } else if (coupon.type_id === COUPONS_TYPES_IDS.CATEGORY_OF_WRITER) {
        if (coupon["service_type_id"] === SERVICES_IDS.CHOOSE_WRITER) {
          if (formState.writerCategoryId === coupon.writer_category_id) {
            couponWriterCategoryReduction += cost.secondaryWriterCategoryCost;
          }
          if (additionalServices.writerCategoryId === coupon.writer_category_id) {
            additionalCouponWriterCategoryReduction += cost.secondaryWriterCategoryCost;
          }
        }
      }
    }

    cost.couponGetSamplesReduction          = couponGetSamplesReduction;
    cost.couponProgressiveDeliveryReduction = couponProgressiveDeliveryReduction;
    cost.couponUsedSourcesReduction         = couponUsedSourcesReduction;
    cost.couponWriterCategoryReduction      = couponWriterCategoryReduction;
    cost.couponsReduction = normalizePrice(
      cost.baseCouponsReduction + couponGetSamplesReduction + couponProgressiveDeliveryReduction +
      couponUsedSourcesReduction + couponWriterCategoryReduction
    );

    cost.additionalCoupon = {}

    cost.additionalCoupon.couponGetSamplesReduction          = additionalCouponGetSamplesReduction;
    cost.additionalCoupon.couponProgressiveDeliveryReduction = additionalCouponProgressiveDeliveryReduction;
    cost.additionalCoupon.couponUsedSourcesReduction         = additionalCouponUsedSourcesReduction;
    cost.additionalCoupon.couponWriterCategoryReduction      = additionalCouponWriterCategoryReduction;
    cost.additionalCoupon.couponsReduction = normalizePrice(
      cost.additionalCouponsReduction + additionalCouponGetSamplesReduction + additionalCouponProgressiveDeliveryReduction +
      additionalCouponUsedSourcesReduction + additionalCouponWriterCategoryReduction
    );
  };

  /**
   * @param {FormState} formState
   * @param {CostInfo} cost
   */
  var calculateDiscount = function(insertData, cost) {
    cost.discountPercent = insertData.formState.discountPercent;
    cost.baseDiscountReduction = normalizePrice((cost.baseRawCost - cost.baseCouponsReduction) * insertData.formState.discountPercent / 100);
    cost.additionalDiscountReduction = normalizePrice((cost.rawCost - cost.additionalCouponsReduction) * insertData.formState.discountPercent / 100);
  };

  /**
   * @param {FormState} formState
   * @returns {FreeThings}
   */
  function calculateFreeThings(formState) {
    var couponsObject = {};
    var categoriesOfWriter = [];
    for (var i = 0; i < formState.winbackCoupons.length; i++) {
      if (formState.winbackCoupons[i].service_type_id === SERVICES_IDS.CHOOSE_WRITER) {
        categoriesOfWriter.push(formState.winbackCoupons[i].writer_category_id);
      } else {
        couponsObject[formState.winbackCoupons[i].service_type_id] = formState.winbackCoupons[i];
      }
    }

    return {
      pages:               couponsObject[SERVICES_IDS.WRITING_PAGES] && couponsObject[SERVICES_IDS.WRITING_PAGES].quantity || 0,
      slides:              couponsObject[SERVICES_IDS.WRITING_SLIDES] && couponsObject[SERVICES_IDS.WRITING_SLIDES].quantity || 0,
      charts:              couponsObject[SERVICES_IDS.WRITING_CHARTS] && couponsObject[SERVICES_IDS.WRITING_CHARTS].quantity || 0,
      progressiveDelivery: couponsObject[SERVICES_IDS.PROGRESSIVE_DELIVERY] !== undefined,
      copyOfSources:       couponsObject[SERVICES_IDS.USED_SOURCES] !== undefined,
      writerSamples:       couponsObject[SERVICES_IDS.PROVIDE_ME_SAMPLES] !== undefined,
      categoriesOfWriter:  categoriesOfWriter
    };
  }

  /**
   * @param {FormState} formState
   * @param {CostInfo} cost
   * @returns {Array.<Service>}
   */
  var calculateServices = function(formState, cost) {

    var services = [];


    /* GET BASE SERVICES */

    if (cost.basePagesCost) {
      services.push({
        "quantity": formState.pages,
        "title":    formState.pages + " " + pluralize("page", formState.pages) + " × $" + normalizePrice(formState.deadlinePricePerPage),
        "type_id":  SERVICES_IDS.WRITING_PAGES,
        "cost":     cost.basePagesCost,
        "priority": 1,
        "free":     false
      });
    }

    if (cost.baseSlidesCost) {
      services.push({
        "quantity": formState.slides,
        "type_id":  SERVICES_IDS.WRITING_SLIDES,
        "title":    "PowerPoint slides",
        "cost":     cost.baseSlidesCost,
        "priority": 1,
        "free":     false
      });
    }

    if (cost.baseChartsCost) {
      services.push({
        "quantity": formState.charts,
        "type_id":  SERVICES_IDS.WRITING_CHARTS,
        "title":    "Charts",
        "cost":     cost.baseChartsCost,
        "priority": 1,
        "free":     false
      });
    }


    /* GET SECONDARY SERVICES */

    if (cost.secondaryGetSamplesCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.PROVIDE_ME_SAMPLES,
        "title":    "Order writer’s samples",
        "cost":     cost.secondaryGetSamplesCost,
        "priority": 3,
        "free":     cost.freeThings.writerSamples && cost.couponGetSamplesReduction > 0
      });
    }

    if (cost.secondaryProgressiveDeliveryCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.PROGRESSIVE_DELIVERY,
        "title":    "Progressive delivery",
        "cost":     cost.secondaryProgressiveDeliveryCost,
        "priority": 2,
        "free":     cost.freeThings.progressiveDelivery && cost.couponProgressiveDeliveryReduction > 0
      });
    }

    if (cost.secondaryWriterCategoryCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.CHOOSE_WRITER,
        "title":    "Category of the writer",
        "cost":     cost.secondaryWriterCategoryCost,
        "priority": 2,
        "free":     cost.couponWriterCategoryReduction > 0
      });
    }

    if (cost.secondaryUsedSourcesCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.USED_SOURCES,
        "title":    "Copy of sources used",
        "cost":     cost.secondaryUsedSourcesCost,
        "priority": 2,
        "free":     cost.freeThings.copyOfSources && cost.couponUsedSourcesReduction > 0
      });
    }

    if (cost.secondaryComplexAssignmentCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.COMPLEX_ASSIGNMENT,
        "title":    "Complex Assignment",
        "cost":     cost.secondaryComplexAssignmentCost,
        "priority": 2,
        "free":     false,
      });
    }


    /* GET DISCOUNT SERVICES */

    if (cost.baseDiscountReduction > 0) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.DISCOUNT,
        "title":    "Discount",
        "cost":     cost.discountReduction,
        "priority": 8,
        "free":     false
      });
    }


    /* GET COUPON SERVICES */

    if (cost.freeThings.pages > 0 && cost.baseCouponsReduction > 0) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.COUPON_WRT_PAGES,
        "title":    cost.freeThings.pages + " " + pluralize("page", cost.freeThings.pages) + " discount",
        "cost":     cost.baseCouponsReduction,
        "priority": 5,
        "free":     false
      });
    }

    return services.sort(function(a, b) { return a.priority - b.priority; });

  };

 var calculateAdditionalServices = function(insertData, cost) {

    var formState = insertData.formState

    var additionalServices = insertData.additionalServices

    var services = [];

    /* GET BASE SERVICES */

    if (cost.additionalPagesCost) {
      services.push({
        "quantity": additionalServices.pages,
        "title":    additionalServices.pages + " " + pluralize("page", additionalServices.pages) + " × $" + normalizePrice(additionalServices.deadlinePricePerPage),
        "type_id":  SERVICES_IDS.WRITING_PAGES,
        "cost":     cost.additionalPagesCost,
        "priority": 1,
        "free":     false
      });
    }

    if (cost.additionalSlidesCost) {
      services.push({
        "quantity": additionalServices.slides,
        "type_id":  SERVICES_IDS.WRITING_SLIDES,
        "title":    "PowerPoint slides",
        "cost":     cost.additionalSlidesCost,
        "priority": 1,
        "free":     false
      });
    }

    if (cost.additionalChartsCost) {
      services.push({
        "quantity": additionalServices.charts,
        "type_id":  SERVICES_IDS.WRITING_CHARTS,
        "title":    "Charts",
        "cost":     cost.additionalChartsCost,
        "priority": 1,
        "free":     false
      });
    }


    /* GET SECONDARY SERVICES */

    if (cost.additionalSecondary.secondaryGetSamplesCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.PROVIDE_ME_SAMPLES,
        "title":    "Order writer’s samples",
        "cost":     cost.secondaryGetSamplesCost,
        "priority": 3,
        "free":     cost.freeThings.writerSamples && cost.couponGetSamplesReduction > 0
      });
    }

    if (cost.additionalSecondary.secondaryProgressiveDeliveryCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.PROGRESSIVE_DELIVERY,
        "title":    "Progressive delivery",
        "cost":     cost.secondaryProgressiveDeliveryCost,
        "priority": 2,
        "free":     cost.freeThings.progressiveDelivery && cost.couponProgressiveDeliveryReduction > 0
      });
    }

    if (cost.additionalSecondary.secondaryWriterCategoryCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.CHOOSE_WRITER,
        "title":    "Category of the writer",
        "cost":     cost.secondaryWriterCategoryCost,
        "priority": 2,
        "free":     cost.couponWriterCategoryReduction > 0
      });
    }

    if (cost.additionalSecondary.secondaryUsedSourcesCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.USED_SOURCES,
        "title":    "Copy of sources used",
        "cost":     cost.secondaryUsedSourcesCost,
        "priority": 2,
        "free":     cost.freeThings.copyOfSources && cost.couponUsedSourcesReduction > 0
      });
    }

    if (cost.additionalSecondary.secondaryComplexAssignmentCost) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.COMPLEX_ASSIGNMENT,
        "title":    "Complex Assignment",
        "cost":     cost.secondaryComplexAssignmentCost,
        "priority": 2,
        "free":     false,
      });
    }


    /* GET DISCOUNT SERVICES */

    if (cost.additionalDiscountReduction > 0) {
      services.push({
        "quantity": 0,
        "type_id":  SERVICES_IDS.DISCOUNT,
        "title":    "Discount",
        "cost":     cost.discountReduction,
        "priority": 8,
        "free":     false
      });
    }

    return services.sort(function(a, b) { return a.priority - b.priority; });
  }

  /**
   * @param {FormState} formState
   * @returns {CostInfo}
   */
  global.UVOCostCalculator = function(formState, additionalState) {

    formState = formState || {};

    // Legacy, remove after FEBRUARY 30, 2016:
    if (!formState.winbackCoupons && formState.couponsObject) {
      formState.winbackCoupons = [];
      for (var couponName in formState.couponsObject) {
        if (formState.couponsObject.hasOwnProperty(couponName)) {
          formState.winbackCoupons.push(formState.couponsObject[couponName]);
        }
      }
      delete formState.couponsObject;
    }
    var insertData = {
      formState: {
        pages:                              parseInt(formState.pages)                  || 0,
        slides:                             parseInt(formState.slides)                 || 0,
        discountPercent:                    parseInt(formState.discountPercent)        || 0,
        charts:                             parseInt(formState.charts)                 || 0,
        winbackCoupons:                     formState.winbackCoupons                   || [],
        writerCategoryId:                   formState.writerCategoryId                 || null,
        deadlinePricePerPage:               parseFloat(formState.deadlinePricePerPage) || 0,
        deadlineHrs:                        parseInt(formState.deadlineHrs)            || 0,
        spacing:                            formState.spacing                          || null,
        getSamplesOn:                       Boolean(formState.getSamplesOn),
        getProgressiveDeliveryOn:           Boolean(formState.getProgressiveDeliveryOn),
        getUsedSourcesOn:                   Boolean(formState.getUsedSourcesOn),
        complexAssignmentDiscipline:        Boolean(formState.complexAssignmentDiscipline),
        writerPercent:                      parseInt(formState.writerPercent)          || 0
      },
      additionalServices: {
        pages:                              additionalState.pages || 0,
        slides:                             additionalState.slides || 0,
        charts:                             additionalState.charts || 0,
        deadlinePricePerPage:               additionalState.deadlinePricePerPage || 0,
        deadlineHrs:                        additionalState.deadlineHrs || 0,
        getSamplesOn:                       additionalState.getSamplesOn || 0,
        getProgressiveDeliveryOn:           additionalState.getProgressiveDeliveryOn || 0,
        getUsedSourcesOn:                   additionalState.getUsedSourcesOn || 0,
        writerPercent:                      additionalState.writerPercent || 0,
      }
    }

    var cost = {};

    calculateBase(insertData, cost);
    calculateBaseCoupons(insertData, cost);
    calculateSecondary(insertData, cost);
    cost.baseRawCost = normalizePrice(cost.baseCost + cost.secondaryCost);
    cost.rawCost = normalizePrice(cost.allBaseCost + cost.additionalSecondary.secondaryCost);
    calculateCoupons(insertData, cost);
    calculateDiscount(insertData, cost);

    cost.baseTotalCost = normalizePrice(cost.baseRawCost - cost.baseDiscountReduction - cost.baseCouponsReduction);

    cost.totalCost = normalizePrice(cost.rawCost - cost.additionalDiscountReduction - cost.additionalCouponsReduction);

    cost.baseProgressiveDeliveryCost = normalizePrice(cost.secondaryProgressiveDeliveryCost - cost.couponProgressiveDeliveryReduction);

    cost.progressiveDeliveryCost = normalizePrice(cost.additionalSecondary.secondaryProgressiveDeliveryCost - cost.additionalCoupon.couponProgressiveDeliveryReduction);

    cost.freeThings = calculateFreeThings(insertData.formState);

    cost.services = calculateServices(insertData.formState, cost);

    cost.additionalServices = calculateAdditionalServices(insertData, cost);

    global.___cost___ = cost;

    return cost;
  };

})


// baseChartsCost:8.5
// baseCost:51
// baseCouponsReduction:0
// basePagesCost:34
// baseSlidesCost:8.5
// couponGetSamplesReduction:0
// couponPagesQuantity:0
// couponPagesReduction:0
// couponProgressiveDeliveryReduction:0
// couponUsedSourcesReduction:0
// couponWriterCategoryReduction:0
// couponsReduction:0
// discountPercent:95
// discountReduction:53.2
// freeThings:Object
// pdDisabled:"Available for orders with a deadline of 5 days and longer, and with the value of $200 and more."
// pdForced:false
// progressiveDeliveryCost:0
// rawCost:56
// secondaryComplexAssignmentCost:0
// secondaryComplexAssignmentPrice:10.2
// secondaryCost:5
// secondaryGetSamplesCost:5
// secondaryGetSamplesPrice:5
// secondaryProgressiveDeliveryCost:0
// secondaryProgressiveDeliveryPercent:10
// secondaryProgressiveDeliveryPrice:0
// secondaryUsedSourcesCost:0
// secondaryUsedSourcesPrice:14.95
// secondaryWriterCategoryCost:0
// services:Array[5]
// totalCost:2.8