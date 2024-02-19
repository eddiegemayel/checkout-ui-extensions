// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

//42334054285364
/**
 * @type {FunctionRunResult}
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */

// Assuming the necessary imports are done in the JavaScript environment as they were in TypeScript
export function run(input) {
  const groupedItems = [];
  input.cart.lines.forEach(line => {
    const bundleId = line.bundleId;
    if(bundleId && bundleId.value) {
      if(!groupedItems[bundleId.value]) {
        groupedItems[bundleId.value] = [];
      }
      groupedItems[bundleId.value].push(line);
    }
  });

  return {
    operations: [
      ...Object.values(groupedItems.map(group => {
        const mergeOperation = {
          merge: {
            cartLines: group.map((line) => {
              return {
                cartLineId: line.id,
                quantity: line.quantity
              }
            }),
            parentVariantId: "gid://shopify/ProductVariant/42334054285364",
          },
        };
        return mergeOperation;
      })),
    ],
  };
};