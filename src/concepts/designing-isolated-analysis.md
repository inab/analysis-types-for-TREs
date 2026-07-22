---
title: Isolated analysis
style: ../entrust-style.css
---
# Designing Isolated analysis

This section describes the construction of an isolated analysis in detail.
To start, we will work through the calculation of the arithmetic mean, then you can explore some interactive examples. 

## The arithmetic mean

```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{n}
```

If you want to calculate the mean for a dataset you can see the whole of, the way you can think of calculating it is:

1. Count your number of instances (${tex`n`})
2. Add up your values (${tex`\sum^n_{i=1}{x_i}`})
3. Divide the sum by the count

This doesn't work if you can't see all of your data at once, though.
Ignoring federation for now, imagine you could only see one item of data at a time.
You couldn't calculate the mean each time, as you would lose the information needed for the next row.
For example, let's imagine we have a list of numbers: ${tex`27, 1, 26, 23, 15`}.

1. The mean of 27 is 27
2. The mean of 27 and 1 is 14
3. The mean of 14 and 26 is 20

This way of trying to calculate the mean breaks down on step 3, as the mean of 27, 1, and 26 is 18, not 20.
Luckily, in this imaginary scenario, we can store two numbers.
If instead, we write down the sum of values and a running total, we can do this instead.

1. Total = 27, Count = 1
2. Total = 28 (27 + 1), Count = 2 (1 + 1)
3. Total = 54 (28 + 26), Count = 3 (2 + 1)

etc.

This means at each stage, we can look at what we've stored, and calculate the mean from it by dividing the total by the count.
Now if you imagine that you have a friend who is very helpful and volunteers to do some of the calculation for you, you can apply the same logic.

4. You have calculated Total = 54, Count = 3
5. They calculate Total = 23, Count = 1
6. They calculate Total = 38 (23 + 15), Count = 2

They can then pass you their Total and Count and you can use this to calculate the mean.
7. You calculate the aggregate Total = 92 (54 + 38), aggregate Count = 5 (3 + 2)
8. You calculate the mean = 18.4 (92 / 5)

This is the essence of isolated analysis.
We have taken a basic statistic, the arithmetic mean, and defined:

- An object that contains the information needed to calculate our final result
- A function that takes the input and turns it into one of these objects
- A function that takes one of the objects and calculates the final result
- A function that combines these objects

The way you build one of these objects doesn't have to work element-wise like the example above.
In fact, it normally will not be the efficient way to do so.
For example, if your data are in a database, just use `SUM` and `COUNT`.
However, if you **can** make one and define the rules for combining them and getting your final result, then you can do it for arbitrary divisions of your data.

There are different perspectives to take on how this works.

## Perspectives

<input type="radio" name="tab" id="visual" checked>
<input type="radio" name="tab" id="python">
<input type="radio" name="tab" id="maths">

<div class="tabs">
  <label for="visual">Visual examples</label>
  <label for="python">Python example</label>
  <label for="maths">Mathematical description</label>
</div>

<div class="content">
  <div class="tab-content" id="maths-content">

    
We started with the definition of the arithmetic mean:
```tex
\bar{x} = \frac{\sum_{i=1}^{N} x_i}{n}
```

In the description above, we calculated the mean in what looks like a different way, adding values and keeping a running total of the count.
We can see that this is, in fact, the same thing if we reframe the count from ${tex `n`}:
```tex
\bar{x} = \frac{\sum_{i=1}^N x_i}{\sum_{i=1}^N 1}
```

As the count can be seen as a sum, we can make the jump from the case where all the values are together to when they are apart.
As it doesn't matter what order you sum numbers, we can get local sums and then add them together to get a global value, as in the description above.
This means that, for ${tex `K`} TREs:

```tex
\bar{x} = f(\text{global-sum}, \text{global-count}) = \frac{\sum_{j=1}^{K} \sum_{i=1}^{N} x_{j,i}}{\sum_{j=1}^{K} N_j}
```

For our purposes, we can see that both numerator and denominator have ${tex`\sum^K_{j=1}`}, so we can sum the local count and local sum from each TRE.

### Monoids

There is a mathematical structure called a [monoid](https://en.wikipedia.org/wiki/Monoid).
A monoid is a set (${tex`S`}), with an operation (${tex`\oplus`}) that needs three properties.

- Using ${tex`\oplus`} on two elements of ${tex`S`} has to make another ${tex`S`}
- The operation has to be associative, so for ${tex`a,b`} and ${tex`c`} in ${tex`S`}, ${tex`(a \oplus b) \oplus c = a \oplus (b \oplus c)`}
- There needs to be an identity element, ${tex`e`} where ${tex`a \oplus e = a`} and ${tex` e \oplus a = a`}

This looks suspiciously like the function that combines the objects as described above.
Luckily for us, a lot of statistics can be computed using building blocks that can be combined with associative operations: real numbers and addition form a monoid (with 0 as an identity element), and positive real numbers and multiplication (with 1 as an identity element).

If we can express the partial results from nodes in a federation (${tex `p_i`}) and the operation used to combine them as a monoid, we can abstract the aggregation phase of a federated analysis as:

<!--Function that takes a set of values and returns one-->
```tex
f(p_1, p_2, \dots, p_n) = \bigoplus_{i=1}^{n} p_i
```

Then using some other function (${tex `g`}) applied to that aggregated partial result to calculate a final result, the overall function is then

```tex
\text{result} = g(f({p_1, p_2,\dots, p_n}))
```

For our mean example, the partial state is a tuple ${tex`p_i = (\text{sum}_i,\text{count}_i)`}. The monoid operation combines them element-wise:
```tex
(\text{sum}_a, \text{count}_a) \oplus (\text{sum}_b, \text{count}_b) = (\text{sum}_a + \text{sum}_b, \text{count}_a + \text{count}_b)
```

and our finalisation function is simply

```tex
g(\text{sum}, \text{count}) = \frac{\text{sum}}{\text{count}}
```

There are other ways to federate statistics, but if you *can* break the calculation down into something that can be calculated from monoids that can be aggregated, you can federate it.
<!--

PYTHON BIT

-->
  </div>
  <div class="tab-content" id="python-content">





### Do it yourself in Python

To help you understand how basic statistics can be federated, you can run through these examples.
You can define three functions to do a federated analysis yourself.

1. `node_function` runs in each node and summarises a list into a partial result: a summary of the local data
2. `aggregate_function` merges two partial results into another partial result
3. `finalise_function` uses a merged result to calculate the final result of the desired analysis

These will be assembled into a simulation of a federated analytics pipeline.
The examples run on three lists of numbers, one made visible to you so you can verify your `node_function` does what you intend, two hidden from you, representing datasets you can't access directly.

The code currently in the cells will calculate the global count for you.
If you change the `node_function`, the later stages might throw errors.
Your job is to fix these errors and calculate the final result.
Good luck!

```js
import { evaluateNode, evaluateAggregate, evaluateFinal } from "../components/evaluate_pyodide.js";
import { codearea } from "../components/codearea.js";
```

```js
const analysisMethod = view(Inputs.select(
  [
    "Count",
    "Sum",
    "Minimum",
    "Maximum",
    "Mean",
    "Sample Variance"
  ], {label:"Choose an example"}
))
```

#### Computing partial results at the nodes
The `node_function` is what runs in each node to get out the data necessary to calculate your final result.
In reality, you're unlikely to be operating on a list of numbers; this is just so you can think about the partial results that needs to come out of each node.

Write your definition of `node_function` in the box below.
If you change the function names, the evaluation will not run properly.

```js
const nodeFuncHints = {
  "Count": "For the count, you only need to return the length of the list",
  "Sum": "For the sum, you only need to return the sum of the list",
  "Mean": "For the mean, you need both the sum and the length of the list. The easiest way is in a dictionary.",
  "Sample Variance": "For the sample variance, you need the length, sum, and sum of squares of the list. The easiest way is in a dictionary.",
  "Minimum": "For the minimum, you only need the local minimum",
  "Maximum": "For the maximum, you only need the local maximum"
}
```

<details>
  <summary>Give me a hint</summary>


${nodeFuncHints[analysisMethod]}
</details>

```js
const test_integers = Array.from(
  Array(3), () => Array.from(
    Array(Math.floor(Math.random() * 5 + 5)), () => Math.floor(Math.random() * 100)
  )
);

const flat_integers = test_integers.flat();
```

```js
const node_function = view(codearea(
{
  submit: true,
  monospace: true,
  maxlength: 2000,
  value: `def node_function(some_list):
  return len(some_list)`
}
))
```

```js
const userNodeResult = evaluateNode(node_function, test_integers)
```

The first node's data is ${test_integers[0].join(", ")}, and your function gives the partial result:

```js
userNodeResult
```

#### Aggregating partial results
Next, you need to combine your partial results into something that describes the whole dataset across nodes.
To do this, the aggregator has to have some function that combines two partial results, which can then be applied to all of the partial results like this:

```python
result = PartialResult()

for partial in partial_results:
    result = aggregate_function(result, partial)
```

Many programming languages, including python, provide a "reduce" function that performs the same operation.

Define your `aggregate_function` below.

```js
const aggFuncHints = {
  "Count": "For the count, you can add the partial results",
  "Sum": "For the global sum, you can add the partial results",
  "Mean": "For the mean, you need to add the count and sum separately.",
  "Sample Variance": "For the sample variance, you need to add the count, sum, and sum of squares separately.",
  "Minimum": "For the minimum, take the minimum partial result",
  "Maximum": "For the maximum, take the maximum partial result"
}
```

<details>
  <summary>Give me a hint</summary>


${aggFuncHints[analysisMethod]}
</details>

```js
const aggregateFunction = view(codearea(
{
  submit: true,
  monospace: true,
  maxlength: 2000,
  value: `def aggregate_function(node_1, node_2):
  return node_1 + node_2`
}
))
```

```js
const userAggregateResult = evaluateAggregate(node_function, aggregateFunction, test_integers)
```

The aggregate result is:

```js
userAggregateResult
```

After the partial results from nodes have been aggregated, all but the simplest statistics need some further processing before they give their result.
To do this, we need a function definition to apply to the aggregated result.
For the simple statistics, returning the value is sufficient.


```js
const finalFuncHints = {
  "Count": "For the count, simply return the value",
  "Sum": "For the global sum, simply return the value",
  "Mean": "The calculation for the mean is to divide the sum by the count",
  "Sample Variance": html`The calculation for the sample variance, is to divide the sum of squared differences to the mean by the count - 1.
This one is quite difficult, but a place to start is to expand (x - x̄)<sup>2</sup>. If you're still stuck, wikipedia includes
<a href="https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance">alternative algorithms for variance<a> which describes a possible solution`,
  "Minimum": "For the minimum, simply return the value",
  "Maximum": "For the maximum, simply return the value"
}
```

<details>
  <summary>Give me a hint</summary>


${finalFuncHints[analysisMethod]}
</details>

```js
const finaliseFunction = view(codearea(
{
  submit: true,
  monospace: true,
  maxlength: 2000,
  value: `def finalise_function(aggregate_value):
  return aggregate_value`
}
))
```

```js
const userFinalResult = evaluateFinal(node_function, aggregateFunction, finaliseFunction, test_integers)
```

The final result is:

```js
userFinalResult
```

```js
const desiredResult = {
  "Count": flat_integers.length,
  "Sum": flat_integers.reduce((a, b) => a+b, 0),
  "Mean": flat_integers.reduce((a, b) => a+b,0)/flat_integers.length,
  "Sample Variance": d3.variance(flat_integers),
  "Minimum": Math.min(...flat_integers),
  "Maximum": Math.max(...flat_integers)
}
```

${desiredResult[analysisMethod] === userFinalResult ? "which is correct" : `which should be ${desiredResult[analysisMethod]}`}.

The [partialstats](https://github.com/Health-Informatics-UoN/partialstats) module uses this approach to provide functions for aggregating common statistics and a scaffold for making your own functions.
  </div>
  <div class="tab-content" id="visual-content">


Below, there is a demonstrator to help you get a feel for how an isolated analysis can work.

```js
import { runInner, computeAggregate } from "../components/aggregateFunctions.js";
import { analyses } from "../components/decomposables.js";
import { displayIntermediates, displayNodes, displayArrows } from "../components/drawDiagrams.js";
import { populateNodes } from "../components/renderNodes.js";
```

```js
const analysisChoice = view(
  Inputs.select(
    analyses,
    {
      label: "Choose an analysis",
      format: (t) => t.label,
      value: analyses.find((t) => t.label === "Count All")
    }
  )
)
```

## ${analysisChoice.label}

Overall, this analysis ${analysisChoice.decomposableDescription}

### Running an example

Here are some text boxes.
It has some example data in it that will work for the kinds of analysis that take a single number from each row of a dataset.
You can put your own numbers in, just separate them with commas.


```js
const nodeN = view(Inputs.button(
  [
    ["Add Node", value => value + 1],
    ["Remove Node", value => value >= 2 ? value - 1 : value]
  ], {value: 3}
))
```

```js
const dummyNodes = view(populateNodes(nodeN))
```

This page will pretend that this is a dataset held across different nodes.


```js
const dummyData = dummyNodes.map(d => JSON.parse(`[${d}]`))
```


```js
const intermediates = runInner(analysisChoice.inner, dummyData)
```


```js
const dataNodes = html`${displayNodes(dummyData.length)}`;
const intermediatesRepr = html`${displayIntermediates(intermediates)}`;
const arrows = html`${displayArrows(dummyData.length)}`;
const arrows2 = html`${displayArrows(dummyData.length)}`;
```

### Functions

#### Local function
The way it does this is by applying a local function to each of the datasets.
The local function, "${analysisChoice.innerDescription.label}", ${analysisChoice.innerDescription.description}

#### Aggregation function

The analysis takes the output of ${analysisChoice.innerDescription.label} for each dataset and applies an aggregation function to these intermediate values.
The aggregation function, "${analysisChoice.outerDescription.label}", ${analysisChoice.outerDescription.description}

<div class="card">
  ${dataNodes}
  <div style="display:flex; justify-content:center;">
      ${analysisChoice.innerDescription.label}
  </div>
  ${arrows}
  ${intermediatesRepr}
  <div style="display:flex; justify-content:center;">
      ${analysisChoice.outerDescription.label}
  </div>
  ${arrows2}
  <div style="display: flex;
              justify-content: center;
              background: #EE7326;
              margin-left: 30px;
              margin-right: 30px;
              border-radius: 5px;">
    <span><b>Final Result:</b> ${computeAggregate(analysisChoice, dummyData)}</span>
  </div>
</div>

  </div>
</div>


## Further reading
The approaches used here are not new; aggregation in distributed systems has to solve many of the same problems, so federated analytics can crib from their solutions

- [Data Cube: A Relational Aggregation Operator Generalizing Group-By, Cross-Tab, and Sub-Totals](https://dx.doi.org/10.1023/A:1009726021843) a generalisation of particular aggregations.
- [A Survey of Distributed Data Aggregation Algorithms](http://arxiv.org/abs/1110.0725)
- [Monoidify! Monoids as a Design Principle for Efficient MapReduce Algorithms](http://arxiv.org/abs/1304.7544)

<style>
  /* Hide radio buttons */
  input[type="radio"] {
    display: none;
  }

  /* Style tab labels */
  label {
    padding: 10px 20px;
    display: inline-block;
    border: 1px solid gray;
    cursor: pointer;
  }

  /* Highlight active tab */
  #maths:checked ~ .tabs label[for="maths"],
  #visual:checked ~ .tabs label[for="visual"],
  #python:checked ~ .tabs label[for="python"] {
    background: #eee;
    font-weight: bold;
  }

  /* Hide all content sections */
  .tab-content {
    display: none;
    margin-top: 20px;
  }

  /* Show selected tab content */
  #maths:checked ~ .content #maths-content,
  #visual:checked ~ .content #visual-content,
  #python:checked ~ .content #python-content {
    display: block;
  }
</style>
