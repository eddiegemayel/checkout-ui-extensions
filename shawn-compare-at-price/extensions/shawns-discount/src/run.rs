use shopify_function::prelude::*;
use shopify_function::Result;

// The configured entrypoint for the 'purchase.product-discount.run' extension target
#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let no_discount = output::FunctionRunResult {
        discounts: vec![],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    };

    // Iterate all the lines in the cart to create discount targets
    let targets = input.cart.lines
        .iter()
        // Only include cart lines with a quantity higher than two
        .filter(|line| line.quantity >= 2)
        // Only include cart lines with a targetable product variant
        .filter_map(|line| match &line.merchandise {
            input::InputCartLinesMerchandise::ProductVariant(variant) => Some(variant),
            input::InputCartLinesMerchandise::CustomProduct => None,
        })
        // Use the variant ID to create a discount target
        .map(|variant| output::Target::ProductVariant(output::ProductVariantTarget {
            id: variant.id.to_string(),
            quantity: None,
        }))
        .collect::<Vec<output::Target>>();

    if targets.is_empty() {
        // You can use STDERR for debug logs in your function
        eprintln!("No cart lines qualify for volume discount.");
        return Ok(no_discount);
    }

    // The shopify_function crate serializes your function result and writes it to STDOUT
    Ok(output::FunctionRunResult {
        discounts: vec![output::Discount {
            message: None,
            // Apply the discount to the collected targets
            targets,
            // Define a percentage-based discount
            value: output::Value::Percentage(output::Percentage {
                value: Decimal(10.0)
            }),
        }],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    })
}
