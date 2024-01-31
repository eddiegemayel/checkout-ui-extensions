// @ts-check

// TESTDISCOUNT is the code
// 00bb0f81-2bd3-4fdd-8950-cfd10f8a872a
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input) {
  const targets = input.cart.lines.filter(line => {
    if(line.merchandise.__typename == "ProductVariant") {
      const hasLimitedEditionTag = line.merchandise.product.hasAnyTag;
      return hasLimitedEditionTag === false;
    }
  }).map(line => {
    return {
      productVariant: {
        id: line.merchandise.id,
      }
    };
  });

  const DISCOUNTED_ITEMS = {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [{
      targets: targets,
      value: {
        percentage: {
          value: 10
        }
      },
      message: "10% off"
    }]
  }

  return targets.length === 0 ? EMPTY_DISCOUNT : DISCOUNTED_ITEMS;
}


// mutation {
//   discountCodeAppCreate(codeAppDiscount: {
//     code: "TESTDISCOUNT",
//     title: "Tag discount",
//     functionId: "00bb0f81-2bd3-4fdd-8950-cfd10f8a872a",
//     startsAt: "2024-01-30T00:00:00"
//   }) {
//     codeAppDiscount {
//       discountId
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }