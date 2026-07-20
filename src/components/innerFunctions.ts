import type { InnerFunction } from "./aggregateFunctions.js";

export const countRows: InnerFunction<number, number> = {
    apply: (_) => 1,
    merge: (a, b) => a + b,
    identity: 0
}

export const sumRows: InnerFunction<number, number> = {
  apply: (x) => x,
  merge: (a, b) => a + b,
  identity: 0
}

export const sumAndCountRows: InnerFunction<number, {sum: number, count: number}> = {
  apply: (x) => ({sum: x, count: 1}),
  merge: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0}
}

export const sumCountSumSqRows: InnerFunction<number, {sum: number, count: number, sumsq: number}> = {
  apply: (x) => ({sum: x, count: 1, sumsq: x*x}),
  merge: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count, sumsq: a.sumsq + b.sumsq}),
  identity: {sum: 0, count: 0, sumsq: 0}
}

export const maxRows: InnerFunction<number, number> = {
  apply: (x) => x,
  merge: (a, b) => a > b ? a : b,
  identity: -Infinity
}

export const minRows: InnerFunction<number, number> = {
  apply: (x) => x,
  merge: (a, b) => a < b ? a : b,
  identity: Infinity
}

export const innerFunctionDescriptions = {
  countRows: {
    label: "Count Rows",
    description: "counts the number of instances in the dataset."
  },
  sumRows: {
    label: "Sum Rows",
    description: "sums the instances in the dataset."
  },
  sumAndCountRows: {
    label: "Sum and Count Rows",
    description: "both counts and sums the instances in the dataset, returning both."
  },
  maxRows: {
    label: "Max of Rows",
    description: "finds the maximum of the instances in the dataset."
  },
  minRows: {
    label: "Min of Rows",
    description: "finds the minimum of the instances in the dataset."
  },
  sumCountSumSqRows: {
    label: "Sum, Count, and Sum of Squares of Rows",
    description: "calculates the sum and sum of squares of instances in the dataset, returning these and the count."
  }
}
