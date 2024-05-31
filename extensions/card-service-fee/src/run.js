// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {

  console.error('payment_method:', input.cart.paymentMethod?.value);

  var ops = NO_CHANGES;
  if (input.cart.paymentMethod?.value === 'creditCard') {
    for(var i in input.cart.lines) {
      var line = input.cart.lines[i];

      const serviceFee = line.cost.amountPerQuantity.amount * 0.05;
      ops.operations.push(
        {
          expand: {
            cartLineId: line.id,
            expandedCartItems: [
              {
                // Original item
                merchandiseId: line.merchandise.id,
                quantity: 1,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: line.cost.amountPerQuantity.amount,
                    }
                  }
                }
              },
              {
                // 5% service fee
                merchandiseId: "gid://shopify/ProductVariant/48542340317473",
                quantity: 1,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: serviceFee,
                    }
                  }
                }
              },
            ],
          }
        }
      );
    }
  }

  return ops;
};