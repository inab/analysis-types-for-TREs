export interface InnerFunction<T, S> {
  // apply is what happens to each row
  apply: (item: T) => S;
  // merge is how rows within a 
  merge: (a: S, b: S) => S;
  identity: S;
}

export function runInner<T, S>(
  inner: InnerFunction<T, S>,
  data: T[][]
): S[] {
  return data
  .map(
    ds => ds
    .map(inner.apply)
    .reduce(inner.merge, inner.identity)
  )
}

export interface OuterFunction<S, R> {
  // the aggregate function is what takes the intermediate results and produces the final result
  aggregate: (aggregate: S, intermediate: S) => S;
  identity: S;
  finalise: (aggregate: S) => R;
}

export interface Decomposable<T, S, R> {
  inner: InnerFunction<T, S>;
  outer: OuterFunction<S, R>;
}

export function computeAggregate<T, S, R>(
  agg: Decomposable<T, S, R>,
  data: T[][],
): R {
    const intermediates: S[] = data
    .map(
      ds => ds
      .map(agg.inner.apply)
      .reduce(agg.inner.merge, agg.inner.identity)
    );

    const aggregateResult = intermediates.reduce(
      agg.outer.aggregate,
      agg.outer.identity
    )

    return agg.outer.finalise(aggregateResult)
}


export interface AnalysisDescription<T, S, R> {
  label: String;
  decomposableDescription: String;
  inner: InnerFunction<T,S>;
  outer: OuterFunction<S,R>;
  innerDescription: FunctionDescription;
  outerDescription: FunctionDescription;
}

export interface FunctionDescription {
  label: String;
  description: String;
}
