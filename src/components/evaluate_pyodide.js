import { loadPyodide } from "https://cdn.jsdelivr.net/npm/pyodide@314.0.0/pyodide.mjs";

let pyodide = await loadPyodide({
  indexURL: "https://cdn.jsdelivr.net/npm/pyodide@314.0.0/"
});

export async function hello_python() {
  return pyodide.runPythonAsync("1+1");
}

export async function evaluateNode(userFunction, data) {
  let my_namespace = pyodide.toPy({ user_data: data[0] })
  return pyodide.runPythonAsync(
    `
from pyodide.ffi import to_js
${userFunction}
to_js(node_function(user_data))
    `, {globals: my_namespace}
  )
}

export async function evaluateAggregate(userNodeFunction, userAggregateFunction, data) {
  let my_namespace = pyodide.toPy({ user_data: data })
  return pyodide.runPythonAsync(
    `
from pyodide.ffi import to_js
from functools import reduce
${userNodeFunction}
${userAggregateFunction}

nodes = [node_function(node) for node in user_data]
to_js(reduce(aggregate_function, nodes))
    `, {globals: my_namespace}
  )
}

export async function evaluateFinal(userNodeFunction, userAggregateFunction, userFinalFunction, data) {
  let my_namespace = pyodide.toPy({ user_data: data })
  return pyodide.runPythonAsync(
    `
from pyodide.ffi import to_js
from functools import reduce
${userNodeFunction}
${userAggregateFunction}
${userFinalFunction}

nodes = [node_function(node) for node in user_data]
to_js(finalise_function(reduce(aggregate_function, nodes)))
    `, {globals: my_namespace}
  )
}
