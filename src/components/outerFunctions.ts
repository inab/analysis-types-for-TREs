import type { OuterFunction } from "./aggregateFunctions.js";

export const sumIntermediates: OuterFunction<number, number> = {
    aggregate: (a, b) => a + b,
    identity: 0,
    finalise: (x) => x
}

export const gatherAvgIntermediates: OuterFunction<{sum: number, count: number}, number> = {
  aggregate: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0},
  finalise: (x: {sum: number, count: number}) => x.sum/x.count
}

export const gatherVarIntermediates: OuterFunction<{sum: number, count: number, sumsq: number}, number> = {
  aggregate: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count, sumsq: a.sumsq + b.sumsq}),
  identity: {sum: 0, count: 0, sumsq: 0},
  finalise: (x: {sum: number, count: number, sumsq: number}) => x.sumsq/x.count - (x.sum/x.count * x.sum/x.count)
}

export const maxIntermediates: OuterFunction<number, number> = {
  aggregate: (a, b) => a > b ? a : b,
  identity: -Infinity,
  finalise: (x) => x
}

export const minIntermediates: OuterFunction<number, number> = {
  aggregate: (a, b) => a < b ? a : b,
  identity: Infinity,
  finalise: (x) => x
}

export const outerFunctionDescriptions = {
  sumIntermediates: {
    label: "Sum the intermediate values",
    description: "takes all the intermediate values and add them together."
  },
  gatherAvgIntermediates: {
    label: "Gather averaging intermediates",
    description: "takes the count and sum from each node. It gets a total sum and total count by adding across nodes, then calculates the mean by dividing sum by count."
  },
  maxIntermediates: {
    label: "Max of intermediate values",
    description: "finds the maximum of intermediate values."
  },
  minIntermediates: {
    label: "Min of intermediate values",
    description: "finds the minimum of intermediate values"
  },
  gatherVarIntermediates: {
    label: "Gather variance intermediates",
    description: "takes the count, sum, and sum of squares from each node. It gets a total count, sum, and sum of squares by adding across nodes, then calculates the population variance."
  }
}
