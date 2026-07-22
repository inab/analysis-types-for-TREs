import {html} from "npm:htl";

export function displayIntermediates(intermediateResults: any[]) {
    const intermediateBoxes = intermediateResults.map((d, i) =>
        html`
        <div style="background: #EE7326; margin-left: 10px; margin-right: 10px, border-radius: 5px;">
            <h4 style="color: #204F90">Node ${i+1}</h4>
            <p>${JSON.stringify(d)}</p>
        </div>
        `
    );
    return html`
        <div style="display: flex; align-items: center; justify-content: center;">
            ${intermediateBoxes}
        </div>
    `
}

export function displayNodes(n: number) {
    const dataNodes = Array.from(
      {length: n},
      (_, i) => html`
        <div style="background:#EE7326; margin: 10px; border-radius: 5px;">
          <h4 style="color: #204F90"> Node ${i+1}</h4>
          <p>[...]</p>
        </div>
      `
    );
    return html`
        <div style="display: flex; align-items: center; justify-content: center;">
            ${dataNodes}
        </div>
        `
}

export function displayArrows(n: number) {
  const arrows = Array.from(
    {length:n},
    (_, i) => html`
    <div style="margin-left: 15px; margin-right: 15px; font-size: 200%;"
      <p>⬇</p>
    </div>
    `
  );
  return html`
  <div style="display: flex; align-items: center; justify-content: center;">
    ${arrows}
  </div>
  `
}
