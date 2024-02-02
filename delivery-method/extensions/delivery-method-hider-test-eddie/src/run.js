// @ts-check

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").Operation} Operation
 */

/**
 * @type {FunctionResult}
 */
 const NO_CHANGES = {
  operations: [],
};

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  const oversized = input.cart.lines.some((line) => {
    const { product } = line.merchandise;
    return product && product.oversized;
  });

  if (oversized) {
    const expressDeliveryOption = input.cart.deliveryGroups
      .flatMap((group) => group.deliveryOptions)
      .find((option) => option.title === "Express");

    if (expressDeliveryOption) {
      return {
        operations: [
          /** @type {Operation} */ ({
            hide: {
              deliveryOptionHandle: expressDeliveryOption.handle,
            },
          }),
        ],
      };
    }
  }

  return NO_CHANGES;
};