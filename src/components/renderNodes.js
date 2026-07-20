import * as Inputs from "npm:@observablehq/inputs";

function randString(len) {
    return Array.from({length: len}, () => Math.floor(Math.random() * 30)).join(", ")
}

export function populateNodes(n) {
  const inputs = Array.from(
    {length: n},
    (_, i) => Inputs.text({label: `Node ${i+1}`, value: randString(5), submit: true})
  );
  return Inputs.form(inputs)
}
