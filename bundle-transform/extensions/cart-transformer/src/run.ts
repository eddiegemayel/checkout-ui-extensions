import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

// gid://shopify/ProductVariant/42334054285364

export function run(input: RunInput): FunctionRunResult {
  return NO_CHANGES;
};