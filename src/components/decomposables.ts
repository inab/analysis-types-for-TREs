import type { AnalysisDescription } from "./aggregateFunctions.js";
import {
  countRows,
  sumRows,
  sumAndCountRows,
  innerFunctionDescriptions,
  maxRows,
  minRows,
  sumCountSumSqRows
} from "./innerFunctions.js";
import {
  sumIntermediates,
  gatherAvgIntermediates,
  gatherVarIntermediates,
  outerFunctionDescriptions,
  maxIntermediates,
  minIntermediates,
} from "./outerFunctions.js";


export const analyses: AnalysisDescription<any, any, number>[]  = [
  {
    label: "Count All",
    decomposableDescription: "counts the rows across the datasets.",
    inner: countRows,
    outer: sumIntermediates,
    innerDescription: innerFunctionDescriptions.countRows,
    outerDescription: outerFunctionDescriptions.sumIntermediates
  },
  {
    label: "Sum All",
    decomposableDescription: "sums values across the datasets.",
    inner: sumRows,
    outer: sumIntermediates,
    innerDescription: innerFunctionDescriptions.sumRows,
    outerDescription: outerFunctionDescriptions.sumIntermediates
  },
  {
    label: "Mean across all",
    decomposableDescription: "calculates the mean of all values across datasets.",
    inner: sumAndCountRows,
    outer: gatherAvgIntermediates,
    innerDescription: innerFunctionDescriptions.sumAndCountRows,
    outerDescription: outerFunctionDescriptions.gatherAvgIntermediates
  },
  {
    label: "Variance across all",
    decomposableDescription: "calculates the variance of all values across datasets.",
    inner: sumCountSumSqRows,
    outer: gatherVarIntermediates,
    innerDescription: innerFunctionDescriptions.sumCountSumSqRows,
    outerDescription: outerFunctionDescriptions.gatherVarIntermediates
  },
  {
    label: "Max across all",
    decomposableDescription: "calculates the maximum of all values across datasets.",
    inner: maxRows,
    outer: maxIntermediates,
    innerDescription: innerFunctionDescriptions.maxRows,
    outerDescription: outerFunctionDescriptions.maxIntermediates
  },
  {
    label: "Min across all",
    decomposableDescription: "calculates the minimum of all values across datasets.",
    inner: minRows,
    outer: minIntermediates,
    innerDescription: innerFunctionDescriptions.minRows,
    outerDescription: outerFunctionDescriptions.minIntermediates
  }
]
